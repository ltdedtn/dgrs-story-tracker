using backend.Models;
using System.Threading.Tasks;

namespace backend.Repositories
{
    public interface IAADateRepository
    {
        Task<AADate> AddAADateAsync(AADate aadate);
        Task<AADate> GetAADateByIdAsync(int id);
        Task UpdateAADateAsync(AADate aadate);
        Task DeleteAADateAsync(int id);
    }
}
