using ServiceStack.DataAnnotations;

namespace eproject3.ServiceModel;

[Alias("products")]
public class Product
{
    [AutoIncrement]
    public int Id { get; set; }

    [Required]
    public string Title { get; set; }

    [Required]
    public string Image { get; set; }

    [Required]
    public decimal Price { get; set; }

    public string Description { get; set; }

    public bool Available { get; set; } = true;

    public int Stock { get; set; }

    [References(typeof(Category))]
    public int CategoryId { get; set; }

    [References(typeof(Creator))]
    public int CreatorId { get; set; }

    public bool HeroSection { get; set; }

    public string YoutubeTrailerLink { get; set; }

    
}


public class ProductView : Product
{
    public string PromotionName { get; set; }
    public decimal? AverageRating { get; set; }
}