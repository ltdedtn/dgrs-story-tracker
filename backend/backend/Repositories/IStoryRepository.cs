using backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Repositories
{
    public interface IStoryRepository
    {
        Task<IEnumerable<Story>> GetStoriesAsync();
        Task<Story> GetStoryByIdAsync(int id);
        Task<Story> AddStoryAsync(Story story);
        Task UpdateStoryAsync(Story story);
        Task DeleteStoryAsync(int id);
    }
}
