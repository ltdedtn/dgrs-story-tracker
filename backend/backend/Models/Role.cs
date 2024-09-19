namespace backend.Models
{
    public class Role
    {
        public int RoleId { get; set; }
        public string RoleName { get; set; } = string.Empty; // Ensure non-nullable
        public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    }
}
