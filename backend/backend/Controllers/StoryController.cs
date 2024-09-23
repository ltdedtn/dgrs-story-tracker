using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.DTOs;
using backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

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
        public async Task<ActionResult<IEnumerable<StoryDto>>> GetStories()
        {
            try
            {
                var stories = await _storyRepository.GetStoriesAsync();
                var storyDtos = stories.Select(story => new StoryDto
                {
                    StoryId = story.StoryId,
                    Title = story.Title,
                    Description = story.Description,
                    Content = story.Content,
                    CreatedAt = story.CreatedAt,
                    ImageUrl = story.ImageUrl,
                    StoryGroupId = story.StoryGroupId
                });
                return Ok(storyDtos);
            }
            catch (Exception ex)
            {
                // Use structured logging for better traceability
                // e.g., _logger.LogError($"Error retrieving stories: {ex}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<StoryDto>> GetStory(int id)
        {
            try
            {
                var story = await _storyRepository.GetStoryByIdAsync(id);
                if (story == null)
                {
                    return NotFound();
                }
                var storyDto = new StoryDto
                {
                    StoryId = story.StoryId,
                    Title = story.Title,
                    Description = story.Description,
                    Content = story.Content,
                    CreatedAt = story.CreatedAt,
                    ImageUrl = story.ImageUrl
                };
                return Ok(storyDto);
            }
            catch (Exception ex)
            {
                // Use structured logging
                // e.g., _logger.LogError($"Error retrieving story: {ex}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost]
        [Authorize(Roles = "Editor,Admin")]
        public async Task<ActionResult<StoryDto>> PostStory([FromForm] StoryCreateDto storyDto, [FromForm] IFormFile? imageFile)
        {
            try
            {
                var story = new Story
                {
                    Title = storyDto.Title,
                    Description = storyDto.Description,
                    Content = storyDto.Content,
                    CreatedAt = DateTime.UtcNow,
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
                var storyDtoResponse = new StoryDto
                {
                    StoryId = createdStory.StoryId,
                    Title = createdStory.Title,
                    Description = createdStory.Description,
                    Content = createdStory.Content,
                    CreatedAt = createdStory.CreatedAt,
                    ImageUrl = createdStory.ImageUrl
                };

                return CreatedAtAction(nameof(GetStory), new { id = createdStory.StoryId }, storyDtoResponse);
            }
            catch (Exception ex)
            {
                // Use structured logging
                // e.g., _logger.LogError($"Error creating story: {ex}");
                return StatusCode(500, "Internal server error");
            }
        }



        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteStory(int id)
        {
            try
            {
                var story = await _storyRepository.GetStoryByIdAsync(id);
                if (story == null)
                {
                    return NotFound();
                }

                await _storyRepository.DeleteStoryAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                // Use structured logging
                // e.g., _logger.LogError($"Error deleting story: {ex}");
                return StatusCode(500, "Internal server error");
            }
        }
        // Get stories by story group ID
        [HttpGet("ByStoryGroup/{storyGroupId}")]
        [AllowAnonymous]
        [Authorize(Roles = "StandardUser,Editor,Admin")]
        public async Task<ActionResult<IEnumerable<Story>>> GetStoriesByStoryGroupId(int storyGroupId)
        {
            var stories = await _storyRepository.GetStoriesByStoryGroupIdAsync(storyGroupId);
            if (stories == null || !stories.Any())
            {
                return Ok(new List<Story>());
            }

            return Ok(stories);
        }

    }
}
