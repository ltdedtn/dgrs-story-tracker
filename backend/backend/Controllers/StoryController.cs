using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.DTOs;
using backend.Repositories;
using Microsoft.AspNetCore.Authorization; // Add this
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StoryController : ControllerBase
    {
        private readonly IStoryRepository _storyRepository;

        public StoryController(IStoryRepository storyRepository)
        {
            _storyRepository = storyRepository;
        }

        [HttpGet]
        [AllowAnonymous]
        [Authorize(Roles = "StandardUser,Editor,Admin")]
        public async Task<ActionResult<IEnumerable<Story>>> GetStories()
        {
            return Ok(await _storyRepository.GetStoriesAsync());
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        [Authorize(Roles = "StandardUser,Editor,Admin")]
        public async Task<ActionResult<Story>> GetStory(int id)
        {
            var story = await _storyRepository.GetStoryByIdAsync(id);
            if (story == null)
            {
                return NotFound();
            }
            return Ok(story);
        }

        [HttpPost]
        [Authorize(Roles = "Editor,Admin")]
        public async Task<ActionResult<Story>> PostStory([FromForm] StoryCreateDto storyDto, [FromForm] IFormFile imageFile)
        {
            try
            {
                var story = new Story
                {
                    Title = storyDto.Title,
                    Description = storyDto.Description,
                    Content = storyDto.Content,
                    CreatedAt = DateTime.UtcNow,
                    UserId = storyDto.UserId
                };

                if (imageFile != null && imageFile.Length > 0)
                {
                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);
                    var filePath = Path.Combine("wwwroot", "images", fileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await imageFile.CopyToAsync(fileStream);
                    }

                    story.ImageUrl = "/images/" + fileName;
                }

                var createdStory = await _storyRepository.AddStoryAsync(story);
                return CreatedAtAction(nameof(GetStory), new { id = createdStory.StoryId }, createdStory);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating story: {ex}");
                return StatusCode(500, "Internal server error");
            }
        }


        [HttpPut("{id}")]
        [Authorize(Roles = "Editor,Admin")]
        public async Task<IActionResult> PutStory(int id, StoryUpdateDto storyDto)
        {
            if (id != storyDto.StoryId)
            {
                return BadRequest("Story ID mismatch");
            }

            var story = await _storyRepository.GetStoryByIdAsync(id);
            if (story == null)
            {
                return NotFound();
            }

            story.Title = storyDto.Title;
            story.Description = storyDto.Description;
            story.Content = storyDto.Content;
            story.ImageUrl = storyDto.ImageUrl;

            await _storyRepository.UpdateStoryAsync(story);
            return NoContent();
        }


        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteStory(int id)
        {
            var story = await _storyRepository.GetStoryByIdAsync(id);
            if (story == null)
            {
                return NotFound();
            }

            await _storyRepository.DeleteStoryAsync(id);
            return NoContent();
        }
    }
}
