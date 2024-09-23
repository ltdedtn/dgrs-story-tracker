namespace backend.Models
{
    public class StoryDto
    {
        public int StoryId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Content { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? ImageUrl { get; set; }
        public int? StoryGroupId { get; set; }
    }
}
