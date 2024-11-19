using backend.Models;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Repositories
{
    public class CharacterRepository : ICharacterRepository
    {
        private readonly BackendContext _context;

        public CharacterRepository(BackendContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Character>> GetCharactersAsync()
        {
            return await _context.Characters
                .Include(c => c.StoryPartCharacters)
                .Include(c => c.CharacterRelationshipsA)
                .Include(c => c.CharacterRelationshipsB)
                .ToListAsync();
        }
        public async Task<IEnumerable<Character>> GetAllCharactersAsync()
        {
            // Return the result as IEnumerable
            return await _context.Characters
                .Include(c => c.StoryPartCharacters)
                    .ThenInclude(spc => spc.StoryPart)
                        .ThenInclude(sp => sp.Story)
                .Include(c => c.StoryPartCharacters)
                    .ThenInclude(spc => spc.StoryPart)
                        .ThenInclude(sp => sp.AADate)
                .Include(c => c.CharacterRelationshipsA)
                .Include(c => c.CharacterRelationshipsB)
                .ToListAsync();
        }


        // Fetch a single character by ID, including related entities
        public async Task<Character> GetCharacterByIdAsync(int id)
        {
            return await _context.Characters
                .Include(c => c.StoryPartCharacters)
                .Include(c => c.CharacterRelationshipsA)
                .Include(c => c.CharacterRelationshipsB)
                .FirstOrDefaultAsync(c => c.CharacterId == id);

        }

        public async Task<Character> AddCharacterAsync(Character character)
        {
            _context.Characters.Add(character);
            await _context.SaveChangesAsync();
            return character; // This should match the return type of Task<Character>
        }

        public async Task UpdateCharacterAsync(Character character)
        {
            // Attach the entity and mark it as modified
            _context.Entry(character).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteCharacterAsync(int id)
        {
            // Find the character
            var character = await _context.Characters.FindAsync(id);
            if (character == null)
            {
                throw new KeyNotFoundException("Character not found");
            }

            // Remove related records from StoryPartCharacters
            var storyPartCharacters = _context.StoryPartCharacters
                                              .Where(spc => spc.CharacterId == id);

            _context.StoryPartCharacters.RemoveRange(storyPartCharacters);

            // Remove related records from CharacterRelationships
            var relationships = _context.CharacterRelationships
                                         .Where(cr => cr.CharacterAId == id || cr.CharacterBId == id);

            _context.CharacterRelationships.RemoveRange(relationships);

            // Now remove the character
            _context.Characters.Remove(character);

            // Save changes
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Character>> GetCharactersByStoryPartIdAsync(int storyPartId)
        {
            return await _context.StoryPartCharacters
                .Where(spc => spc.StoryPartId == storyPartId)
                .Select(spc => spc.Character)
                .ToListAsync();
        }
    }
}
