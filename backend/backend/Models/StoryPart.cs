using System;
using System.Collections.Generic;

namespace backend.Models
{
    public class StoryPart
    {
        public int StoryPartId { get; set; } // Updated to match database schema
        public int StoryId { get; set; } // Foreign key to Story
        public string Title { get; set; }
        public string Content { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public string ?ImageUrl { get; set; }

        // Navigation propertiesa
        public Story? Story { get; set; }
        public ICollection<StoryPartCharacter> StoryPartCharacters { get; set; } = new List<StoryPartCharacter>(); // Initialized as empty list
    }
}
