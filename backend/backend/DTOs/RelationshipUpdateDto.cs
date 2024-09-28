namespace backend.DTOs
{
    public class RelationshipUpdateDto
    {
        public int RelationshipId { get; set; } // Ensure this matches your model's ID field
        public string RelationshipTag { get; set; } // Assuming you have a Status property
    }

}
