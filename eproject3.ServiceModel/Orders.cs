using ServiceStack.DataAnnotations;

namespace eproject3.ServiceModel;

[Alias("Orders")]
public class Order
{
    [AutoIncrement]
    public int Id { get; set; }

    public int UserId { get; set; }

    public decimal TotalAmount { get; set; }

    [Required]
    [StringLength(20)]
    public OrderStatus Status { get; set; }   = OrderStatus.Ongoing;

    [Required]
    [StringLength(20)]
    public PaymentMethod PaymentMethod { get; set; }    // CreditCard, PayPal, COD

    [Required]
    [StringLength(255)]
    public string ShippingAddress { get; set; }

    public DateTime CreatedAt { get; set; }

    // Optional: if you want navigation-style access in memory
    [Computed]
    public List<OrderItem> Items { get; set; }
}

public enum OrderStatus
{
    Ongoing,
    Pending,
    Cancelled,
    Complete
}

public enum PaymentMethod
{
    QRCode,
    CASH
}