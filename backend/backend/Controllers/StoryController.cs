using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.DTOs;
using backend.Repositories;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Tokens;

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
        public async Task<ActionResult<IEnumerable<Story>>> GetStories()
        {
            return Ok(await _storyRepository.GetStoriesAsync());
        }

        [HttpGet("{id}")]
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
        public async Task<ActionResult<Story>> PostStory([FromForm] StoryCreateDto storyDto, [FromForm] IFormFile imageFile)
        {
            try
            {
                var story = new Story
                {
                    Title = storyDto.Title,
                    Description = storyDto.Description,
                    CreatedAt = DateTime.UtcNow,
                    UserId = storyDto.UserId // Directly assign the nullable int
                };

                if (imageFile != null && imageFile.Length > 0)
                {
                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);
                    var filePath = Path.Combine("wwwroot", "images", fileName); // Save to wwwroot/images folder

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await imageFile.CopyToAsync(fileStream);
                    }

                    story.ImageUrl = "/images/" + fileName; // Store relative URL in database
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
            story.ImageUrl = storyDto.ImageUrl;

            await _storyRepository.UpdateStoryAsync(story);
            return NoContent();
        }

        [HttpDelete("{id}")]
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
