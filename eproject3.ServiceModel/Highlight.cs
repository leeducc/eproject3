using ServiceStack.DataAnnotations;


namespace eproject3.ServiceModel;

[Alias("Highlights")]
public class Highlight
{
    [AutoIncrement]
    public int    Id        { get; set; }

    
    public string Route     { get; set; }   

    
    public string ImageUrl  { get; set; }   
   
    public string Link      { get; set; }   
    [Required]
    public int    SortOrder { get; set; }   
}