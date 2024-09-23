using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Repositories
{
    public class StoryRepository : IStoryRepository
    {
        private readonly BackendContext _context;

        public StoryRepository(BackendContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<StoryDto>> GetStoriesAsync()
        {
            return await _context.Stories
                .Select(s => new StoryDto
                {
                    StoryId = s.StoryId,
                    Title = s.Title,
                    Description = s.Description,
                    Content = s.Content,
                    CreatedAt = s.CreatedAt,
                    ImageUrl = s.ImageUrl,
                    StoryGroupId = s.StoryGroupId
                })
                .ToListAsync();
        }

        public async Task<StoryDto> GetStoryByIdAsync(int id)
        {
            return await _context.Stories
                .Where(s => s.StoryId == id)
                .Select(s => new StoryDto
                {
                    StoryId = s.StoryId,
                    Title = s.Title,
                    Description = s.Description,
                    Content = s.Content,
                    CreatedAt = s.CreatedAt,
                    ImageUrl = s.ImageUrl,
                    StoryGroupId= s.StoryGroupId
                })
                .FirstOrDefaultAsync();
        }

        public async Task<Story> AddStoryAsync(Story story)
        {
            _context.Stories.Add(story);
            await _context.SaveChangesAsync();
            return story;
        }

        public async Task UpdateStoryAsync(Story story)
        {
            _context.Entry(story).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteStoryAsync(int id)
        {
            var story = await _context.Stories.FindAsync(id);
            if (story != null)
            {
                _context.Stories.Remove(story);
                await _context.SaveChangesAsync();
            }
        }
        public async Task<IEnumerable<Story>> GetStoriesByStoryGroupIdAsync(int storyGroupId)
        {
            return await _context.Stories
                .Where(s => s.StoryGroupId == storyGroupId)
                .ToListAsync();
        }

    }
}
