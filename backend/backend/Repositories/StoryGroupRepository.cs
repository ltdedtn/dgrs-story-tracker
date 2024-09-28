using backend.Models;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

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
            else
            {
                throw new KeyNotFoundException("StoryGroup not found");
            }
        }

        public async Task<IEnumerable<Story>> GetStoriesByGroupIdAsync(int storyGroupId)
        {
            return await _context.Stories
                .Where(s => s.StoryGroupId == storyGroupId)
                .ToListAsync();
        }

        public async Task DeleteStoryPartsByStoryIdAsync(int storyId)
        {
            var storyParts = await _context.StoryParts
                .Where(sp => sp.StoryId == storyId)
                .ToListAsync();

            _context.StoryParts.RemoveRange(storyParts);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteStoryAsync(int storyId)
        {
            var story = await _context.Stories.FindAsync(storyId);
            if (story != null)
            {
                _context.Stories.Remove(story);
                await _context.SaveChangesAsync();
            }
            else
            {
                throw new KeyNotFoundException("Story not found");
            }
        }

        public async Task UnlinkCharactersFromStoryPartAsync(int storyPartId)
        {
            var characterLinks = await _context.StoryPartCharacters
                .Where(csp => csp.StoryPartId == storyPartId)
                .ToListAsync();

            if (characterLinks.Count > 0)
            {
                _context.StoryPartCharacters.RemoveRange(characterLinks);
                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteStoryPartAsync(int storyPartId)
        {
            var storyPart = await _context.StoryParts.FindAsync(storyPartId);
            if (storyPart != null)
            {
                _context.StoryParts.Remove(storyPart);
                await _context.SaveChangesAsync();
            }
            else
            {
                throw new KeyNotFoundException("StoryPart not found");
            }
        }

        public async Task<IEnumerable<StoryPart>> GetStoryPartsByStoryIdAsync(int storyId)
        {
            return await _context.StoryParts
                .Where(sp => sp.StoryId == storyId)
                .ToListAsync();
        }
    }
}
