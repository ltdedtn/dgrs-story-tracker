using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace backend.Models
{
    public class Story
    {
        public int StoryId { get; set; }
        public string Title { get; set; } = string.Empty; // Ensure non-nullable
        public string? Description { get; set; } // Nullable
        public DateTime CreatedAt { get; set; }
        public int? UserId { get; set; } // Nullable
        public string? ImageUrl { get; set; } // Nullable

        public User? User { get; set; } // Nullable
        public ICollection<Character> Characters { get; set; } = new List<Character>();
        [JsonIgnore]
        public ICollection<StoryPart> StoryParts { get; set; } = new List<StoryPart>();
    }
}
