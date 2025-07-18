using ServiceStack.DataAnnotations;

namespace eproject3.ServiceModel;

[Alias("promotions")]
public class Promotion
{
    [AutoIncrement]
    public int Id { get; set; }

    [References(typeof(Product))]
    public int ProductId { get; set; }

    [Required]
    public string PromotionName { get; set; }

    [Required]
    public decimal DiscountPercentage { get; set; }

    [Required]
    public DateTime StartDate { get; set; }

    [Required]
    public DateTime EndDate { get; set; }
}
