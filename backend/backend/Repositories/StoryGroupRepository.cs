using backend.Models;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Repositories
{
    public class StoryGroupRepository : IStoryGroupRepository
    {
        private readonly BackendContext _context;

        public StoryGroupRepository(BackendContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<StoryGroup>> GetAllStoryGroupsAsync()
        {
            return await _context.StoryGroup
                .Include(sg => sg.Stories)
                .ToListAsync();
        }

        public async Task<StoryGroup?> GetStoryGroupByIdAsync(int id)
        {
            return await _context.StoryGroup
                .Include(sg => sg.Stories)
                .FirstOrDefaultAsync(sg => sg.StoryGroupId == id);
        }

        public async Task<StoryGroup> AddStoryGroupAsync(StoryGroup storyGroup)
        {
            _context.StoryGroup.Add(storyGroup);
            await _context.SaveChangesAsync();
            return storyGroup;
        }

        public async Task UpdateStoryGroupAsync(StoryGroup storyGroup)
        {
            _context.Entry(storyGroup).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteStoryGroupAsync(int id)
        {
            var storyGroup = await _context.StoryGroup.FindAsync(id);
            if (storyGroup != null)
            {
                _context.StoryGroup.Remove(storyGroup);
                await _context.SaveChangesAsync();
            }
        }
    }
}
