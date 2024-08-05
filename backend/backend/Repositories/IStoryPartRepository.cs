using backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Repositories
{
    public interface IStoryPartRepository
    {
        Task<IEnumerable<StoryPart>> GetStoryPartsAsync(int? storyId);
        Task<StoryPart> GetStoryPartByIdAsync(int id);
        Task<StoryPart> AddStoryPartAsync(StoryPart storyPart);
        Task UpdateStoryPartAsync(StoryPart storyPart);
        Task DeleteStoryPartAsync(int id);
        Task<bool> StoryPartExistsAsync(int id);
        Task<IEnumerable<StoryPart>> GetStoryPartsByStoryIdAsync(int storyId);
        Task<IEnumerable<StoryPart>> GetStoryPartsByCharacterIdAsync(int characterId);
        Task<bool> LinkCharacterToStoryPartAsync(int storyPartId, int characterId);
        Task<bool> UnlinkCharacterFromStoryPartAsync(int storyPartId, int characterId);

    }
}
