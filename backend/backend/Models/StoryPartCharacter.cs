using System;
using System.Text.Json.Serialization;

namespace backend.Models
{
    public class StoryPartCharacter
    {
        public int StoryPartId { get; set; }
        public StoryPart StoryPart { get; set; }

        public int CharacterId { get; set; }

        [JsonIgnore]
        public Character Character { get; set; }
    }

}
