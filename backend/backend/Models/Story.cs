using System.Text.Json.Serialization;

namespace backend.Models
{
    public class Story
    {
        public int StoryId { get; set; }
        public string Title { get; set; } = string.Empty; // Ensure non-nullable
        public string? Description { get; set; }
        public string? Content { get; set; }
        public DateTime CreatedAt { get; set; }
        public int? UserId { get; set; }
        public string? ImageUrl { get; set; }

        public User? User { get; set; }
        public ICollection<Character> Characters { get; set; } = new List<Character>();
        [JsonIgnore]
        public ICollection<StoryPart> StoryParts { get; set; } = new List<StoryPart>();

        // New Foreign Key for StoryGroup
        public int? StoryGroupId { get; set; }
        public StoryGroup? StoryGroup { get; set; }
    }
}
