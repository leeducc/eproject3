using System;
using System.Collections.Generic;
using System.Linq;
using ServiceStack;

namespace eproject3.ServiceModel.Types
{
    [RequiredRole("User")]
    [Authenticate]
    [Route("/api/cart", "POST")]
    public class AddToCart : IReturn<CartItemDto>
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; } = 1;
    }

    [RequiredRole("User")]
    [Authenticate]
    [Route("/api/cart/{Id}", "DELETE")]
    public class RemoveCartItem : IReturnVoid
    {
        public int Id { get; set; }
    }

    [RequiredRole("User")]
    [Authenticate]
    [Route("/api/cart", "GET")]
    public class GetCart : IReturn<GetCartResponse> { }

    [RequiredRole("User")]
    [Authenticate]
    [Route("/api/cart/clear", "POST")]
    public class ClearCart : IReturnVoid { }

    public class CartItemDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ProductTitle { get; set; }
        public string ProductImage { get; set; }
        public decimal ProductPrice { get; set; }
        public int Quantity { get; set; }
        public DateTime AddedAt { get; set; }
        public decimal DeliveryCharge { get; set; }
    }

    public class GetCartResponse
    {
        public List<CartItemDto> Items { get; set; }
        public decimal Total => Items?.Sum(i => i.ProductPrice * i.Quantity) ?? 0;
    }
}