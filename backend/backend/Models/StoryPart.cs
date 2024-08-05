using System;
using System.Collections.Generic;

namespace backend.Models
{
    public class StoryPart
    {
        public int PartId { get; set; }
        public string Content { get; set; } = string.Empty; // Ensure non-nullable
        public int? StoryId { get; set; } // Nullable
        public DateTime CreatedAt { get; set; }
        public string? ImageUrl { get; set; } // Nullable

        public Story? Story { get; set; } // Nullable
        public ICollection<StoryPartCharacter> StoryPartCharacters { get; set; } = new List<StoryPartCharacter>();
    }
}
