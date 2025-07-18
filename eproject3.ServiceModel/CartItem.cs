using ServiceStack.DataAnnotations;
namespace eproject3.ServiceModel;
[Alias("CartItem")]
public class CartItem
{
    [AutoIncrement]
    public int Id { get; set; }

    public int UserId { get; set; }
    public int ProductId { get; set; }

    public int Quantity { get; set; }

    [Default(typeof(string), "CURRENT_TIMESTAMP")]
    public DateTime AddedAt { get; set; }
}