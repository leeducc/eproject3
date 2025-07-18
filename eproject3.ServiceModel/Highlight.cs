// ServiceModel/Types/Highlight.cs
using ServiceStack.DataAnnotations;

namespace eproject3.ServiceModel.Types
{
    [Alias("highlights")]
    public class Highlight
    {
        [AutoIncrement]
        public int    Id         { get; set; }

        [Required]
        public int    CategoryId { get; set; }   

        [Required]
        public string ImageUrl   { get; set; }  

        public string Link       { get; set; }   

        [Required]
        public int    SortOrder  { get; set; }   
    }
}