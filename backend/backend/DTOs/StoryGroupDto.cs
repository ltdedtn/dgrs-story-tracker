using backend.Models;

public class StoryGroupDto
{
    public int StoryGroupId { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string ImageUrl { get; set; }
    public List<StoryDto> Stories { get; set; }
}