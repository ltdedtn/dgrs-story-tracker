using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using backend.Data;

namespace backend.Services
{
    public class AuthorizationService : IAuthorizationService
    {
        private readonly BackendContext _context;

        public AuthorizationService(BackendContext context)
        {
            _context = context;
        }

        public async Task<bool> HasPermissionAsync(int userId, string permission)
        {
            var userRoles = await _context.UserRoles
                .Include(ur => ur.Role)
                .Where(ur => ur.UserId == userId)
                .Select(ur => ur.Role.RoleName)
                .ToListAsync();

            switch (permission)
            {
                case "View":
                    return userRoles.Contains("Guest") || userRoles.Contains("Standard User") || userRoles.Contains("Editor") || userRoles.Contains("Admin");
                case "EditOwn":
                    return userRoles.Contains("Editor") || userRoles.Contains("Admin");
                case "EditAll":
                    return userRoles.Contains("Admin");
                default:
                    return false;
            }
        }
    }
}
