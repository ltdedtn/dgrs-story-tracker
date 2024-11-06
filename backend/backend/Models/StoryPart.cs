using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace backend.Models
{
    public class StoryPart
    {
        public int StoryPartId { get; set; }
        public int StoryId { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? ImageUrl { get; set; }
        public int? CreatedBy { get; set; }
        public string YoutubeLink { get; set; }
        public int AADateId { get; set; } // Foreign key to AADate

        // Navigation properties
        public Story? Story { get; set; }
        public AADate? AADate { get; set; } // Navigation property to AADate
        [JsonIgnore]
        public ICollection<StoryPartCharacter> StoryPartCharacters { get; set; } = new List<StoryPartCharacter>();
    }

}
