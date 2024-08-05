namespace backend.DTOs
{
    public class CharacterCreateDto
    {
        public string Name { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public int? StoryId { get; set; }
    }
}
