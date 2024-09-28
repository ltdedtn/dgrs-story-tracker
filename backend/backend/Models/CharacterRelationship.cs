// Models/CharacterRelationship.cs
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class CharacterRelationship
    {
        [Key]
        public int RelationshipId { get; set; }
        public int CharacterAId { get; set; } // ID of the first character
        public int CharacterBId { get; set; } // ID of the second character
        public string RelationshipTag { get; set; } // Description of the relationship
    }
}
