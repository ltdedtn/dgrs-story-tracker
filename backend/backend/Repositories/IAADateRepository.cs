using backend.Models;
using System.Threading.Tasks;

namespace backend.Repositories
{
    public interface IAADateRepository
    {
        Task<AADates> AddAADateAsync(AADates aadate);
        Task<AADates> GetAADateByIdAsync(int id);
        Task UpdateAADateAsync(AADates aadate);
        Task DeleteAADateAsync(int id);
    }
}
