using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace backend.Models
{
    public class StoryGroup
    {
        public int StoryGroupId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }

        public ICollection<Story> Stories { get; set; } = new List<Story>();
    }
}
