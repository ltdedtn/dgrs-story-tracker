namespace backend.DTOs
{
    public class StoryPartCreateDto
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public int StoryId { get; set; }
        public string Description { get; set; }
        public string? ImageUrl { get; set; }
    }
}
