using backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Repositories
{
    public interface ICharacterRelationshipRepository
    {
        Task<CharacterRelationship> AddRelationshipAsync(CharacterRelationship relationship);
        Task<IEnumerable<CharacterRelationship>> GetAllRelationshipsAsync();
        Task<CharacterRelationship> GetRelationshipByIdAsync(int id);
        Task<IEnumerable<CharacterRelationship>> GetRelationshipsByCharacterIdAsync(int characterId);
        Task<CharacterRelationship> GetRelationshipByCharactersAsync(int characterAId, int characterBId);

    }
}
