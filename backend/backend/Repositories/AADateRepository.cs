using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace backend.Repositories
{
    public class AADateRepository : IAADateRepository
    {
        private readonly BackendContext _context;

        public AADateRepository(BackendContext context)
        {
            _context = context;
        }

        public async Task<AADates> AddAADateAsync(AADates aadate)
        {
            await _context.AADates.AddAsync(aadate);
            await _context.SaveChangesAsync();
            return aadate;
        }


        public async Task<AADates> GetAADateByIdAsync(int id)
        {
            return await _context.AADates.FirstOrDefaultAsync(a => a.AADateId == id);
        }

        public async Task UpdateAADateAsync(AADates aadate)
        {
            _context.Entry(aadate).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAADateAsync(int id)
        {
            var aadate = await _context.AADates.FindAsync(id);
            if (aadate != null)
            {
                _context.AADates.Remove(aadate);
                await _context.SaveChangesAsync();
            }
        }
    }
}
