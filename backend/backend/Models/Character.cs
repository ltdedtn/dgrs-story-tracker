using backend.Models;
using System.Text.Json.Serialization;

public class Character
{
    public int CharacterId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public string RelationshipTag { get; set; } = "Neutral"; // Default to 'Neutral'

    // Foreign Key
    public int? StoryId { get; set; }

    [JsonIgnore]
    public Story? Story { get; set; }

    public ICollection<StoryPartCharacter> StoryPartCharacters { get; set; } = new List<StoryPartCharacter>();
}
