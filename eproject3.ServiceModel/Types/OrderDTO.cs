using System;
using System.Collections.Generic;
using ServiceStack;

namespace eproject3.ServiceModel.Types
{
    // your existing CreateOrder
    [Authenticate]
    [RequiredRole("User")]
    [Route("/api/orders", "POST")]
    public class CreateOrder : IReturn<OrderResponse>
    {
        public string ShippingAddress { get; set; }
        public PaymentMethod PaymentMethod { get; set; }
        public List<OrderItemRequest> Items { get; set; }
    }

    public class OrderItemRequest
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }

   

    public class OrderResponse
    {
        public int OrderId   { get; set; }
        public OrderStatus Status { get; set; }
        public decimal Total { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    // NEW: Fetch orders
    [Authenticate]
    [RequiredRole("User")]
    [Route("/api/orders", "GET")]
    public class GetOrders : IReturn<GetOrdersResponse> { }

    public class GetOrdersResponse
    {
        public List<OrderDto> Orders { get; set; }
    }

    public class OrderDto
    {
        public int OrderId       { get; set; }
        public DateTime CreatedAt { get; set; }
        public decimal Total     { get; set; }
        public string PaymentMethod { get; set; }
        public string Status     { get; set; }
        public List<OrderItemDto> Items { get; set; }
    }

    public class OrderItemDto
    {
        public int Id           { get; set; }
        public int ProductId    { get; set; }
        public string ProductTitle { get; set; }
        public decimal UnitPrice   { get; set; }
        public int Quantity      { get; set; }
    }

    // NEW: Cancel order
    [Authenticate]
    [RequiredRole("User")]
    [Route("/api/orders/cancel", "POST")]
    public class CancelOrder : IReturnVoid
    {
        public int OrderId { get; set; }
    }
}
