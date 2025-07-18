using ServiceStack.DataAnnotations;
namespace eproject3.ServiceModel;

[Alias("OrderItem")]
public class OrderItem
{
    [AutoIncrement]
    public int Id { get; set; }

    public int OrderId { get; set; }
    public int ProductId { get; set; }

    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
}