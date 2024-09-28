using backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Repositories
{
    public interface IStoryGroupRepository
    {
        Task<IEnumerable<StoryGroup>> GetAllStoryGroupsAsync();
        Task<StoryGroup?> GetStoryGroupByIdAsync(int id);
        Task<StoryGroup> AddStoryGroupAsync(StoryGroup storyGroup);
        Task UpdateStoryGroupAsync(StoryGroup storyGroup);
        Task DeleteStoryGroupAsync(int id);
        Task<IEnumerable<Story>> GetStoriesByGroupIdAsync(int storyGroupId); // Fetch stories for a story group
        Task DeleteStoryPartsByStoryIdAsync(int storyId); // Delete all parts for a story
        Task DeleteStoryAsync(int storyId); // Delete a specific story
        Task UnlinkCharactersFromStoryPartAsync(int storyPartId); // Unlink characters from a story part
        Task DeleteStoryPartAsync(int storyPartId); // Delete a specific story part
        Task<IEnumerable<StoryPart>> GetStoryPartsByStoryIdAsync(int storyId); // Fetch story parts for a specific story
    }

}
