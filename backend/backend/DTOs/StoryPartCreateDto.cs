namespace backend.DTOs
{
    public class StoryPartCreateDto
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public int StoryId { get; set; }
        public string Description { get; set; }
        public string? ImageUrl { get; set; }
        public string? YoutubeLink { get; set; }
        public int CEYear { get; set; }
        public int MonthNumber { get; set; }
        public int Day { get; set; }
        public bool IsAD { get; set; } // True for AD, false for BC
    }
}
