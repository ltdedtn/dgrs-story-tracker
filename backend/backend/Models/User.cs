using System;
using System.Collections.Generic;

namespace backend.Models
{
    public class User
    {
        public int UserId { get; set; }
        public string Username { get; set; }
        public string PasswordHash { get; set; }
        public string Email { get; set; }
        public DateTime CreatedAt { get; set; }

        public ICollection<Story> Stories { get; set; }
    }
}
