public class StoryPartDto
{
    public int StoryPartId { get; set; }
    public int StoryId { get; set; }
    public string Title { get; set; }
    public string Content { get; set; }
    public string Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public string ImageUrl { get; set; }
}
