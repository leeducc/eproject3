using ServiceStack.DataAnnotations;

namespace eproject3.ServiceModel;

[Alias("reviews")]
public class Review
{
    [AutoIncrement]
    public int Id { get; set; }

    [References(typeof(Product))]
    public int ProductId { get; set; }

    [References(typeof(CustomUser))]
    public int UserId { get; set; }

    [Required]
    public byte Rating { get; set; } // 1-5

    public string ReviewText { get; set; }

    [Required]
    public DateTime CreatedAt { get; set; }
}