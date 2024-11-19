using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class AADates
    {
        [Key]
        public int AADateId { get; set; } // Primary key
        public int CEYear { get; set; }
        public int MonthNumber { get; set; }
        public int Day { get; set; }
        public bool IsAD { get; set; }
    }
}
