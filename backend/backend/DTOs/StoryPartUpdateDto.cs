using System.Collections.Generic;

namespace backend.DTOs
{
    public class StoryPartUpdateDto
    {
        public int PartId { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public int StoryId { get; set; }
        public List<int> CharacterIds { get; set; } = new List<int>(); // Adjusted to handle list of CharacterIds
        public string? Description { get; set; } // Add this property
        public string? ImageUrl { get; set; } // Add this property
    }
}
