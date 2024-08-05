using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Models;
using backend.Repositories; // Add the repository namespace
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StoryPartsController : ControllerBase
    {
        private readonly IStoryPartRepository _storyPartRepository; // Use repository

        public StoryPartsController(IStoryPartRepository storyPartRepository)
        {
            _storyPartRepository = storyPartRepository;
        }

        // Get all story parts or filter by storyId
        [HttpGet]
        public async Task<IActionResult> GetStoryParts([FromQuery] int? storyId)
        {
            var storyParts = await _storyPartRepository.GetStoryPartsAsync(storyId);

            return Ok(storyParts);
        }

        // Get a single story part by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<StoryPart>> GetStoryPart(int id)
        {
            var storyPart = await _storyPartRepository.GetStoryPartByIdAsync(id);

            if (storyPart == null)
            {
                return NotFound();
            }

            return Ok(storyPart);
        }

        // Add a new story part
        [HttpPost]
        public async Task<ActionResult<StoryPart>> PostStoryPart([FromForm] StoryPartCreateDto model, IFormFile? imageFile)
        {
            if (model == null || string.IsNullOrEmpty(model.Content) || model.StoryId <= 0)
            {
                return BadRequest("Invalid data.");
            }

            try
            {
                var storyPart = new StoryPart
                {
                    Content = model.Content,
                    StoryId = model.StoryId,
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

                    storyPart.ImageUrl = "/images/" + fileName;
                }

                var createdStoryPart = await _storyPartRepository.AddStoryPartAsync(storyPart);
                return CreatedAtAction(nameof(GetStoryPart), new { id = createdStoryPart.PartId }, createdStoryPart);
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"Error creating story part: {ex}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Update an existing story part
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStoryPart(int id, StoryPart storyPart)
        {
            if (id != storyPart.PartId)
            {
                return BadRequest();
            }

            try
            {
                await _storyPartRepository.UpdateStoryPartAsync(storyPart);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _storyPartRepository.StoryPartExistsAsync(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // Delete a story part
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStoryPart(int id)
        {
            await _storyPartRepository.DeleteStoryPartAsync(id);
            return NoContent();
        }

        [HttpPost("linkCharacterToStoryPart")]
        public async Task<IActionResult> LinkCharacterToStoryPart([FromBody] LinkCharacterToStoryPartDto dto)
        {
            if (dto == null || dto.StoryPartId <= 0 || dto.CharacterId <= 0)
            {
                return BadRequest("Invalid data.");
            }

            var result = await _storyPartRepository.LinkCharacterToStoryPartAsync(dto.StoryPartId, dto.CharacterId);

            if (!result)
            {
                return NotFound("Story part or character not found.");
            }

            return Ok("Character linked to story part successfully.");
        }
        [HttpDelete("unlinkCharacterFromStoryPart")]
        public async Task<IActionResult> UnlinkCharacterFromStoryPart([FromQuery] int storyPartId, [FromQuery] int characterId)
        {
            if (storyPartId <= 0 || characterId <= 0)
            {
                return BadRequest("Invalid data.");
            }

            var result = await _storyPartRepository.UnlinkCharacterFromStoryPartAsync(storyPartId, characterId);

            if (!result)
            {
                return NotFound("Story part or character not found.");
            }

            return Ok("Character unlinked from story part successfully.");
        }


        [HttpGet("ByStory/{storyId}")]
        public async Task<ActionResult<IEnumerable<StoryPart>>> GetStoryPartsByStoryId(int storyId)
        {
            var storyParts = await _storyPartRepository.GetStoryPartsByStoryIdAsync(storyId);
            if (storyParts == null || !storyParts.Any())
            {
                return Ok(new List<StoryPart>());
            }

            return Ok(storyParts);
        }
    }
}
