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
            return await _context.Characters.ToListAsync();
        }

        public async Task<Character> GetCharacterByIdAsync(int id)
        {
            return await _context.Characters
                .FirstOrDefaultAsync(c => c.CharacterId == id);
        }

        public async Task<Character> AddCharacterAsync(Character character)
        {
            _context.Characters.Add(character);
            await _context.SaveChangesAsync();
            return character; // Ensure this matches the return type of Task<Character>
        }

        public async Task UpdateCharacterAsync(Character character)
        {
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

            // Now remove the character
            _context.Characters.Remove(character);

            await _context.SaveChangesAsync();
        }

    }
}
