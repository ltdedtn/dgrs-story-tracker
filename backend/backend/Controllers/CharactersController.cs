using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Repositories;
using backend.DTOs;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using backend.Data;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CharactersController : ControllerBase
    {
        private readonly ICharacterRepository _characterRepository;
        private readonly IStoryPartRepository _storyPartRepository;
        private readonly ICharacterRelationshipRepository _characterRelationshipRepository;
        private readonly BackendContext _context; // Add context for database operations

        public CharactersController(
            ICharacterRepository characterRepository,
            IStoryPartRepository storyPartRepository,
            ICharacterRelationshipRepository characterRelationshipRepository,
            BackendContext context) // Add BackendContext to constructor
        {
            _characterRepository = characterRepository;
            _storyPartRepository = storyPartRepository;
            _characterRelationshipRepository = characterRelationshipRepository;
            _context = context; // Assign the context
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Character>>> GetCharacters()
        {
            var characters = await _characterRepository.GetCharactersAsync();
            return Ok(characters);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "StandardUser,Editor,Admin")]
        public async Task<ActionResult<Character>> GetCharacter(int id)
        {
            var character = await _characterRepository.GetCharacterByIdAsync(id);
            if (character == null)
            {
                return NotFound();
            }
            return Ok(character);
        }

        [HttpGet("{id}/storyparts")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<StoryPart>>> GetStoryPartsByCharacterId(int id)
        {
            var storyParts = await _storyPartRepository.GetStoryPartsByCharacterIdAsync(id);

            if (storyParts == null || !storyParts.Any())
            {
                return Ok(new List<StoryPart>());
            }

            return Ok(storyParts);
        }

        [HttpPost]
        [Authorize(Roles = "Editor,Admin")]
        public async Task<ActionResult<Character>> PostCharacter([FromForm] CharacterCreateDto model, IFormFile? imageFile)
        {
            try
            {
                var character = new Character
                {
                    Name = model.Name,
                    Description = model.Description,
                    RelationshipTag = model.RelationshipTag
                };

                if (imageFile != null && imageFile.Length > 0)
                {
                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);
                    var filePath = Path.Combine("wwwroot", "images", fileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await imageFile.CopyToAsync(fileStream);
                    }

                    character.ImageUrl = "/images/" + fileName;
                }

                var createdCharacter = await _characterRepository.AddCharacterAsync(character);
                return CreatedAtAction(nameof(GetCharacter), new { id = createdCharacter.CharacterId }, createdCharacter);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating character: {ex}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Editor,Admin")]
        public async Task<IActionResult> UpdateCharacter(int id, [FromForm] CharacterUpdateDto model)
        {
            if (id != model.CharacterId)
            {
                return BadRequest("Character ID mismatch");
            }

            try
            {
                var character = await _characterRepository.GetCharacterByIdAsync(id);
                if (character == null)
                {
                    return NotFound();
                }

                character.Name = model.Name;
                character.Description = model.Description;
                character.ImageUrl = model.ImageUrl;
                character.RelationshipTag = model.RelationshipTag;

                await _characterRepository.UpdateCharacterAsync(character);
                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating character: {ex}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteCharacter(int id)
        {
            try
            {
                await _characterRepository.DeleteCharacterAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting character: {ex}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("relationship")]
        public async Task<IActionResult> AddRelationship([FromBody] CharacterRelationship relationship)
        {
            if (relationship == null)
            {
                return BadRequest("Relationship cannot be null.");
            }

            var newRelationship = await _characterRelationshipRepository.AddRelationshipAsync(relationship);
            return CreatedAtAction(nameof(GetRelationshipById), new { id = newRelationship.RelationshipId }, newRelationship);
        }


        [HttpGet("{id}/relationships")]
        public async Task<ActionResult<IEnumerable<CharacterRelationship>>> GetRelationshipsByCharacterId(int id)
        {
            var relationships = await _characterRelationshipRepository.GetRelationshipsByCharacterIdAsync(id);

            if (relationships == null || !relationships.Any())
            {
                return NoContent(); // Return 204 if no relationships found
            }

            return Ok(relationships); // Return the list of relationships
        }


        [HttpGet("relationship/{id}")]
        [AllowAnonymous] // Adjust as needed
        public async Task<ActionResult<CharacterRelationship>> GetRelationshipById(int id)
        {
            var relationship = await _characterRelationshipRepository.GetRelationshipByIdAsync(id);
            if (relationship == null)
            {
                return NotFound();
            }
            return Ok(relationship);
        }

        [HttpPut("relationship/{id}")]
        public async Task<IActionResult> UpdateRelationship(int id, [FromBody] RelationshipUpdateDto relationshipDto)
        {
            if (id != relationshipDto.RelationshipId)
            {
                return BadRequest("Relationship ID mismatch.");
            }

            var existingRelationship = await _context.CharacterRelationships.FindAsync(id); // Use CharacterRelationships
            if (existingRelationship == null)
            {
                return NotFound("Relationship not found.");
            }

            // Update the relationship properties
            existingRelationship.RelationshipTag = relationshipDto.RelationshipTag; // Assuming you have a Status field

            _context.CharacterRelationships.Update(existingRelationship);
            await _context.SaveChangesAsync();

            return NoContent(); // Indicate success without returning any content
        }

        [HttpDelete("relationship/{id}")]
        public async Task<IActionResult> DeleteRelationship(int id)
        {
            var existingRelationship = await _context.CharacterRelationships.FindAsync(id); // Use CharacterRelationships
            if (existingRelationship == null)
            {
                return NotFound("Relationship not found.");
            }

            _context.CharacterRelationships.Remove(existingRelationship);
            await _context.SaveChangesAsync();

            return NoContent(); // Indicate success without returning any content
        }


    }
}
