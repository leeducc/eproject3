using System;
using System.Linq;
using System.Threading.Tasks;
using ServiceStack;
using ServiceStack.OrmLite;
using eproject3.ServiceModel;
using eproject3.ServiceModel.Types;

namespace eproject3.Services
{
    public class CartService : Service
    {
        // Add or update a cart item
        public async Task<CartItemDto> Post(AddToCart req)
        {
            var session = await SessionAsAsync<AuthUserSession>();
            var userId = int.Parse(session.UserAuthId);

            // See if the item already exists
            var existing = await Db.SingleAsync<CartItem>(ci =>
                ci.UserId == userId && ci.ProductId == req.ProductId);

            if (existing != null)
            {
                existing.Quantity += req.Quantity;
                await Db.UpdateAsync(existing);
            }
            else
            {
                existing = new CartItem
                {
                    UserId    = userId,
                    ProductId = req.ProductId,
                    Quantity  = req.Quantity
                };
                existing.Id = (int)await Db.InsertAsync(existing, selectIdentity: true);
            }

            // Load product to fill DTO
            var product = await Db.SingleByIdAsync<Product>(req.ProductId);

            return new CartItemDto
            {
                Id              = existing.Id,
                ProductId       = product.Id,
                ProductTitle    = product.Title,
                ProductImage    = product.Image,
                ProductPrice    = product.Price,
                Quantity        = existing.Quantity,
                AddedAt         = existing.AddedAt,
                DeliveryCharge  = product.DeliveryCharge
            };
        }

        // Get all cart items for the current user
        public async Task<GetCartResponse> Get(GetCart req)
        {
            var session = await SessionAsAsync<AuthUserSession>();
            var userId  = int.Parse(session.UserAuthId);

            var q = Db.From<CartItem>()
                      .Where(ci => ci.UserId == userId)
                      .OrderByDescending(ci => ci.AddedAt);

            var items    = await Db.SelectAsync(q);
            var productIds = items.Select(ci => ci.ProductId).ToList();

            var products = await Db.SelectAsync<Product>(
                Db.From<Product>().Where(p => Sql.In(p.Id, productIds)));

            var dtos = items.Select(ci =>
            {
                var p = products.First(x => x.Id == ci.ProductId);
                return new CartItemDto
                {
                    Id              = ci.Id,
                    ProductId       = p.Id,
                    ProductTitle    = p.Title,
                    ProductImage    = p.Image,
                    ProductPrice    = p.Price,
                    Quantity        = ci.Quantity,
                    AddedAt         = ci.AddedAt,
                    DeliveryCharge  = p.DeliveryCharge
                };
            }).ToList();

            return new GetCartResponse { Items = dtos };
        }

        // Remove a single cart item
        public async Task Delete(RemoveCartItem req)
        {
            var session = await SessionAsAsync<AuthUserSession>();
            var userId  = int.Parse(session.UserAuthId);

            var item = await Db.SingleByIdAsync<CartItem>(req.Id);
            if (item == null || item.UserId != userId)
                throw HttpError.NotFound("Cart item not found.");

            await Db.DeleteByIdAsync<CartItem>(req.Id);
        }

        // Clear all items in the current user's cart
        public async Task Post(ClearCart req)
        {
            var session = await SessionAsAsync<AuthUserSession>();
            var userId  = int.Parse(session.UserAuthId);

            await Db.DeleteAsync<CartItem>(ci => ci.UserId == userId);
        }
    }
}
