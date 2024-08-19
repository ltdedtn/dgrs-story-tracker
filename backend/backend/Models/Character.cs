using System.Text.Json.Serialization;

namespace backend.Models
{
    public class Character
    {
        public int CharacterId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int? StoryId { get; set; }
        public string? ImageUrl { get; set; }
        public string RelationshipStatus { get; set; } = "Neutral"; // Default to 'Neutral'

        [JsonIgnore]
        public Story? Story { get; set; }

        public ICollection<StoryPartCharacter> StoryPartCharacters { get; set; } = new List<StoryPartCharacter>();
    }
}
