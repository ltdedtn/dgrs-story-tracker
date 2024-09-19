using System;
using System.Collections.Generic;

namespace backend.Models
{
    public class User
    {
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }

        public ICollection<Story> Stories { get; set; } = new List<Story>();
        public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    }
}
