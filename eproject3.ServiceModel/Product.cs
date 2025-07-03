using ServiceStack.DataAnnotations;

namespace eproject3.ServiceModel;


[Alias("products")]
public class Product
{
    [AutoIncrement]
    public int Id { get; set; }

    public string Title { get; set; }
    public string Artist { get; set; }
    public string Image { get; set; }
    public decimal Price { get; set; }
    public string Category { get; set; }
    public string Description { get; set; } 
}
