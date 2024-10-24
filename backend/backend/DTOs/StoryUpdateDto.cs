﻿namespace backend.DTOs
{
    public class StoryUpdateDto
    {
        public int StoryId { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }
        public string? Content { get; set; }
        public int? StoryGroupId { get; set; }
        public string? ImageUrl { get; set; } // Include this if you're allowing image URL updates
    }

}
