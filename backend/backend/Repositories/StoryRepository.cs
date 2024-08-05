using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
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

        public async Task<IEnumerable<Story>> GetStoriesAsync()
        {
            return await _context.Stories.ToListAsync();
        }

        public async Task<Story> GetStoryByIdAsync(int id)
        {
            return await _context.Stories
                .Include(s => s.StoryParts)
                .Include(s => s.Characters)
                .FirstOrDefaultAsync(s => s.StoryId == id);
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
    }
}
