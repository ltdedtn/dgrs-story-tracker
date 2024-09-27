using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Models;
using backend.Repositories;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System;
using System.IO;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StoryPartsController : ControllerBase
    {
        private readonly IStoryPartRepository _storyPartRepository;

        public StoryPartsController(IStoryPartRepository storyPartRepository)
        {
            _storyPartRepository = storyPartRepository;
        }

        // Get all story parts or filter by storyId
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetStoryParts([FromQuery] int? storyId)
        {
            var storyParts = await _storyPartRepository.GetStoryPartsAsync(storyId);

            return Ok(storyParts);
        }

        // Get a single story part by ID
        [HttpGet("{id}")]
        [AllowAnonymous]
        [Authorize(Roles = "StandardUser,Editor,Admin")]
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
        [Authorize(Roles = "Editor,Admin")]
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
                    Title = model.Title,
                    Content = model.Content,
                    StoryId = model.StoryId,
                    Description = model.Description,
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

                    storyPart.ImageUrl = $"/images/{fileName}";
                }

                var createdStoryPart = await _storyPartRepository.AddStoryPartAsync(storyPart);
                return CreatedAtAction(nameof(GetStoryPart), new { id = createdStoryPart.StoryPartId }, createdStoryPart);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating story part: {ex}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Update an existing story part
        [HttpPut("{id}")]
        [Authorize(Roles = "Editor,Admin")]
        public async Task<IActionResult> PutStoryPart(int id, [FromForm] StoryPartUpdateDto model, IFormFile? imageFile)
        {
            if (id != model.PartId)
            {
                return BadRequest("StoryPart ID mismatch");
            }

            try
            {
                var existingStoryPart = await _storyPartRepository.GetStoryPartByIdAsync(id);
                if (existingStoryPart == null)
                {
                    return NotFound();
                }

                // Update text fields
                existingStoryPart.Title = model.Title;
                existingStoryPart.Content = model.Content;
                existingStoryPart.Description = model.Description;

                // If an image file is provided, save it and update the ImageUrl
                if (imageFile != null && imageFile.Length > 0)
                {
                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);
                    var filePath = Path.Combine("wwwroot", "images", fileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await imageFile.CopyToAsync(fileStream);
                    }

                    // Update the image URL to the new file path
                    existingStoryPart.ImageUrl = $"/images/{fileName}";
                }

                // Save changes to the repository
                await _storyPartRepository.UpdateStoryPartAsync(existingStoryPart);

                // Return the updated story part, including the new ImageUrl
                return Ok(existingStoryPart);
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
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating story part: {ex}");
                return StatusCode(500, "Internal server error");
            }
        }


        // Delete a story part
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteStoryPart(int id)
        {
            try
            {
                var storyPart = await _storyPartRepository.GetStoryPartByIdAsync(id);
                if (storyPart == null)
                {
                    return NotFound();
                }

                await _storyPartRepository.DeleteStoryPartAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting story part: {ex}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Link character to story part
        [HttpPost("linkCharacterToStoryPart")]
        [Authorize(Roles = "Editor,Admin")]
        public async Task<IActionResult> LinkCharacterToStoryPart([FromBody] LinkCharacterToStoryPartDto dto)
        {
            if (dto == null || dto.StoryPartId <= 0 || dto.CharacterId <= 0)
            {
                return BadRequest("Invalid data.");
            }

            try
            {
                var result = await _storyPartRepository.LinkCharacterToStoryPartAsync(dto.StoryPartId, dto.CharacterId);
                if (!result)
                {
                    return NotFound("Story part or character not found.");
                }
                return Ok("Character linked to story part successfully.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error linking character to story part: {ex}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Unlink character from story part
        [HttpDelete("unlinkCharacterFromStoryPart")]
        [Authorize(Roles = "Editor,Admin")]
        public async Task<IActionResult> UnlinkCharacterFromStoryPart([FromQuery] int storyPartId, [FromQuery] int characterId)
        {
            if (storyPartId <= 0 || characterId <= 0)
            {
                return BadRequest("Invalid data.");
            }

            try
            {
                var result = await _storyPartRepository.UnlinkCharacterFromStoryPartAsync(storyPartId, characterId);
                if (!result)
                {
                    return NotFound("Story part or character not found.");
                }
                return Ok("Character unlinked from story part successfully.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error unlinking character from story part: {ex}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Get story parts by story ID
        [HttpGet("ByStory/{storyId}")]
        [AllowAnonymous]
        [Authorize(Roles = "StandardUser,Editor,Admin")]
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
