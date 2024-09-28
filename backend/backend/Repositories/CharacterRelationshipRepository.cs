using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq; // Ensure this is included for LINQ methods
using System.Threading.Tasks;

namespace backend.Repositories
{
    public class CharacterRelationshipRepository : ICharacterRelationshipRepository
    {
        private readonly BackendContext _context;

        public CharacterRelationshipRepository(BackendContext context)
        {
            _context = context;
        }

        public async Task<CharacterRelationship> AddRelationshipAsync(CharacterRelationship relationship)
        {
            _context.CharacterRelationships.Add(relationship);
            await _context.SaveChangesAsync();
            return relationship;
        }

        public async Task<IEnumerable<CharacterRelationship>> GetAllRelationshipsAsync()
        {
            return await _context.CharacterRelationships.ToListAsync();
        }

        public async Task<CharacterRelationship> GetRelationshipByIdAsync(int id)
        {
            return await _context.CharacterRelationships.FindAsync(id);
        }

        // New method to get relationships by character ID
        public async Task<IEnumerable<CharacterRelationship>> GetRelationshipsByCharacterIdAsync(int characterId)
        {
            return await _context.CharacterRelationships
                .Where(cr => cr.CharacterAId == characterId || cr.CharacterBId == characterId)
                .ToListAsync();
        }
        public async Task<CharacterRelationship> GetRelationshipByCharactersAsync(int characterAId, int characterBId)
        {
            return await _context.CharacterRelationships
                .FirstOrDefaultAsync(r =>
                    (r.CharacterAId == characterAId && r.CharacterBId == characterBId) ||
                    (r.CharacterAId == characterBId && r.CharacterBId == characterAId));
        }

    }
}
