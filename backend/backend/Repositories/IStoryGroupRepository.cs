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
    }
}
