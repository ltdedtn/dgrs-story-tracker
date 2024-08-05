public class StoryCreateDto
{
    public string Title { get; set; }
    public string? Description { get; set; }
    public int? UserId { get; set; } // Change to nullable int
}
