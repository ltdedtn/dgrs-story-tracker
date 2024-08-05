namespace backend.DTOs
{
    public class CharacterUpdateDto
    {
        public int CharacterId { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
    }
}
