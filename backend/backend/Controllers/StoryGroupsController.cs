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
            var storyGroups = await _storyGroupRepository.GetAllStoryGroupsAsync();
            return Ok(storyGroups);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "StandardUser,Editor,Admin")]
        public async Task<ActionResult<StoryGroup>> GetStoryGroup(int id)
        {
            var storyGroup = await _storyGroupRepository.GetStoryGroupByIdAsync(id);
            if (storyGroup == null)
            {
                return NotFound();
            }
            return Ok(storyGroup);
        }

        [HttpPost]
        [Authorize(Roles = "Editor,Admin")]
        public async Task<ActionResult<StoryGroup>> PostStoryGroup([FromForm] StoryGroupCreateDto model)
        {
            var storyGroup = new StoryGroup
            {
                Title = model.Title,
                Description = model.Description,
                ImageUrl = model.ImageUrl
            };

            var createdStoryGroup = await _storyGroupRepository.AddStoryGroupAsync(storyGroup);

            return CreatedAtAction(nameof(GetStoryGroup), new { id = createdStoryGroup.StoryGroupId }, createdStoryGroup);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Editor,Admin")]
        public async Task<IActionResult> UpdateStoryGroup(int id, [FromForm] StoryGroupUpdateDto model)
        {
            if (id != model.StoryGroupId)
            {
                return BadRequest("StoryGroup ID mismatch");
            }

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

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteStoryGroup(int id)
        {
            await _storyGroupRepository.DeleteStoryGroupAsync(id);
            return NoContent();
        }
    }
}
