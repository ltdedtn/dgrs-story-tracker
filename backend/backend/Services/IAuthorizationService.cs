using System.Threading.Tasks;

namespace backend.Services
{
    public interface IAuthorizationService
    {
        Task<bool> HasPermissionAsync(int userId, string permission);
    }
}
