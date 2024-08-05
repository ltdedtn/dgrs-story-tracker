using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Repositories;
using backend.DTOs;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CharactersController : ControllerBase
    {
        private readonly ICharacterRepository _characterRepository;
        private readonly IStoryPartRepository _storyPartRepository; // Add the story part repository

        public CharactersController(ICharacterRepository characterRepository, IStoryPartRepository storyPartRepository)
        {
            _characterRepository = characterRepository;
            _storyPartRepository = storyPartRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Character>>> GetCharacters()
        {
            var characters = await _characterRepository.GetCharactersAsync();
            return Ok(characters);
        }

        [HttpGet("{id}")]
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
        public async Task<ActionResult<Character>> PostCharacter([FromForm] CharacterCreateDto model, IFormFile imageFile)
        {
            try
            {
                // Create a new Character instance from the DTO
                var character = new Character
                {
                    Name = model.Name,
                    Description = model.Description,
                    StoryId = model.StoryId
                };

                // Handle the uploaded image file if it exists
                if (imageFile != null && imageFile.Length > 0)
                {
                    // Generate a unique file name
                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);
                    var filePath = Path.Combine("wwwroot", "images", fileName); // Path where the file will be saved

                    // Save the file to the server
                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await imageFile.CopyToAsync(fileStream);
                    }

                    // Store the relative URL of the uploaded image
                    character.ImageUrl = "/images/" + fileName;
                }

                // Save the new character to the database
                var createdCharacter = await _characterRepository.AddCharacterAsync(character);

                // Return a response indicating the character was created successfully
                return CreatedAtAction(nameof(GetCharacter), new { id = createdCharacter.CharacterId }, createdCharacter);
            }
            catch (Exception ex)
            {
                // Log the exception and return a 500 Internal Server Error
                Console.WriteLine($"Error creating character: {ex}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("{id}")]
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
    }
}
