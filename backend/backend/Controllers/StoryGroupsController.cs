using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Repositories;
using backend.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StoryGroupsController : ControllerBase
    {
        private readonly IStoryGroupRepository _storyGroupRepository;

        public StoryGroupsController(IStoryGroupRepository storyGroupRepository)
        {
            _storyGroupRepository = storyGroupRepository;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<StoryGroup>>> GetStoryGroups()
        {
            try
            {
                var storyGroups = await _storyGroupRepository.GetAllStoryGroupsAsync();
                return Ok(storyGroups);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error retrieving story groups: {ex}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "StandardUser,Editor,Admin")]
        public async Task<ActionResult<StoryGroup>> GetStoryGroup(int id)
        {
            try
            {
                var storyGroup = await _storyGroupRepository.GetStoryGroupByIdAsync(id);
                if (storyGroup == null)
                {
                    return NotFound();
                }
                return Ok(storyGroup);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error retrieving story group: {ex}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost]
        [Authorize(Roles = "Editor,Admin")]
        public async Task<ActionResult<StoryGroup>> PostStoryGroup([FromForm] StoryGroupCreateDto model, IFormFile? imageFile)
        {
            try
            {
                var storyGroup = new StoryGroup
                {
                    Title = model.Title,
                    Description = model.Description
                };

                if (imageFile != null && imageFile.Length > 0)
                {
                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);
                    var filePath = Path.Combine("wwwroot", "images", fileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await imageFile.CopyToAsync(fileStream);
                    }

                    storyGroup.ImageUrl = "/images/" + fileName;
                }

                var createdStoryGroup = await _storyGroupRepository.AddStoryGroupAsync(storyGroup);

                return CreatedAtAction(nameof(GetStoryGroup), new { id = createdStoryGroup.StoryGroupId }, createdStoryGroup);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating story group: {ex}");
                return StatusCode(500, "Internal server error");
            }
        }


        [HttpPut("{id}")]
        [Authorize(Roles = "Editor,Admin")]
        public async Task<IActionResult> UpdateStoryGroup(int id, [FromForm] StoryGroupUpdateDto model)
        {
            if (id != model.StoryGroupId)
            {
                return BadRequest("StoryGroup ID mismatch");
            }

            try
            {
                var storyGroup = await _storyGroupRepository.GetStoryGroupByIdAsync(id);
                if (storyGroup == null)
                {
                    return NotFound();
                }

                storyGroup.Title = model.Title;
                storyGroup.Description = model.Description;
                storyGroup.ImageUrl = model.ImageUrl;

                await _storyGroupRepository.UpdateStoryGroupAsync(storyGroup);
                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating story group: {ex}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteStoryGroup(int id)
        {
            try
            {
                var storyGroup = await _storyGroupRepository.GetStoryGroupByIdAsync(id);
                if (storyGroup == null)
                {
                    return NotFound();
                }

                await _storyGroupRepository.DeleteStoryGroupAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting story group: {ex}");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
