using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Repositories;
using backend.DTOs;
using Microsoft.AspNetCore.Authorization; // Add this
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CharactersController : ControllerBase
    {
        private readonly ICharacterRepository _characterRepository;
        private readonly IStoryPartRepository _storyPartRepository;

        public CharactersController(ICharacterRepository characterRepository, IStoryPartRepository storyPartRepository)
        {
            _characterRepository = characterRepository;
            _storyPartRepository = storyPartRepository;
        }

        [HttpGet]
        [AllowAnonymous]
        [Authorize(Roles = "Guest,StandardUser,Editor,Admin")]
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
        [Authorize(Roles = "StandardUser,Editor,Admin")]
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
        public async Task<ActionResult<Character>> PostCharacter([FromForm] CharacterCreateDto model, IFormFile imageFile)
        {
            try
            {
                var character = new Character
                {
                    Name = model.Name,
                    Description = model.Description,
                    StoryId = model.StoryId
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
    }
}
