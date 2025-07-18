using System;
using System.Collections.Generic;
using System.Linq;
using ServiceStack;
using ServiceStack.OrmLite;
using eproject3.ServiceModel.Types;
using eproject3.ServiceModel;
namespace eproject3.Services
{
    public class OrderService : Service
    {
        // 0) POST /api/orders — Create a new order
        public object Post(CreateOrder req)
        {
            var session = SessionAs<AuthUserSession>();
            var userId  = int.Parse(session.UserAuthId);

            // Start a transaction for header + items
            using var tx = Db.OpenTransaction();

            // 1) Insert order header
            var order = new Order
            {
                UserId          = userId,
                ShippingAddress = req.ShippingAddress,
                PaymentMethod   = req.PaymentMethod,
                Status          = OrderStatus.Ongoing,
                CreatedAt       = DateTime.UtcNow
            };
            // Insert and get back the new Id as an int
            var newId = (int)Db.Insert(order, selectIdentity: true);
            order.Id = newId;

            // 2) Insert items & compute total (always re‑fetch price from DB)
            decimal total = 0m;
            foreach (var itemReq in req.Items)
            {
                var product = Db.SingleById<Product>(itemReq.ProductId)
                              ?? throw HttpError.NotFound($"Product {itemReq.ProductId} not found.");

                var line = new OrderItem
                {
                    OrderId   = order.Id,
                    ProductId = itemReq.ProductId,
                    UnitPrice = product.Price,
                    Quantity  = itemReq.Quantity
                };
                Db.Insert(line);
                total += product.Price * itemReq.Quantity;
            }

            // 3) Update order total
            order.TotalAmount = total;
            Db.Update(order);

            tx.Commit();

            return new OrderResponse
            {
                OrderId   = order.Id,
                Status    = order.Status,
                Total     = total,
                CreatedAt = order.CreatedAt
            };
        }

        // 1) GET /api/orders — Fetch all orders for the current user
        public object Get(GetOrders req)
        {
            var session = SessionAs<AuthUserSession>();
            var userId  = int.Parse(session.UserAuthId);

            // a) Fetch all orders
            var orders = Db.Select<Order>(o => o.UserId == userId);
            if (orders.Count == 0)
                return new GetOrdersResponse { Orders = new List<OrderDto>() };

            // b) Fetch all items and products in two queries
            var orderIds   = orders.ConvertAll(o => o.Id);
            var allItems   = Db.Select<OrderItem>(i => Sql.In(i.OrderId, orderIds));
            var productIds = allItems.Select(i => i.ProductId).Distinct().ToList();
            var products   = Db.Select<Product>(p => Sql.In(p.Id, productIds))
                               .ToDictionary(p => p.Id, p => p);

            // c) Map each order → OrderDto
            var orderDtos = orders.Select(o =>
            {
                var itemsForOrder = allItems
                    .Where(i => i.OrderId == o.Id)
                    .Select(i => new OrderItemDto
                    {
                        Id           = i.Id,
                        ProductId    = i.ProductId,
                        ProductTitle = products[i.ProductId].Title,
                        UnitPrice    = i.UnitPrice,
                        Quantity     = i.Quantity
                    }).ToList();

                return new OrderDto
                {
                    OrderId       = o.Id,
                    CreatedAt     = o.CreatedAt,
                    Total         = o.TotalAmount,
                    PaymentMethod = o.PaymentMethod.ToString(),
                    Status        = o.Status.ToString(),
                    Items         = itemsForOrder
                };
            }).ToList();

            return new GetOrdersResponse { Orders = orderDtos };
        }

        // 2) POST /api/orders/cancel — Cancel a specific order
        public void Post(CancelOrder req)
        {
            var session = SessionAs<AuthUserSession>();
            var userId  = int.Parse(session.UserAuthId);

            var order = Db.SingleById<Order>(req.OrderId)
                        ?? throw HttpError.NotFound("Order not found.");

            if (order.UserId != userId)
                throw HttpError.Forbidden("You may only cancel your own orders.");

            if (order.Status != OrderStatus.Pending)
                throw HttpError.Conflict($"Cannot cancel order in status '{order.Status}'.");

            order.Status = OrderStatus.Cancelled;
            Db.Update(order);
        }
    }
}
