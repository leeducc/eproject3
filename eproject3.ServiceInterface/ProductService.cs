using System.Linq;
using ServiceStack;
using ServiceStack.OrmLite;
using eproject3.ServiceModel.Types; 
using eproject3.ServiceModel;
namespace eproject3.ServiceInterface
{
    public class ProductService : Service
    {
        public object Post(CreateProduct request)
        {
            var product = request.ConvertTo<Product>();
            Db.Insert(product);
            product.Id = (int)Db.LastInsertId();

            if (request.GenreIds?.Any() == true)
            {
                foreach (var genreId in request.GenreIds)
                {
                    Db.Insert(new ProductGenre
                    {
                        ProductId = product.Id,
                        GenreId = genreId
                    });
                }
            }

            return product;
        }

      
        public object Get(GetProduct request)
        {
            var product = Db.SingleById<Product>(request.Id);
            if (product == null)
                throw HttpError.NotFound($"Product with Id {request.Id} not found");

            // load genres
            var genreIds = Db.Column<int>(
                Db.From<ProductGenre>()
                    .Where(pg => pg.ProductId == request.Id)
                    .Select(pg => pg.GenreId));
            var genres = Db.Select<Genre>(g => genreIds.Contains(g.Id));

            // load creator
            var creator = Db.Single<Creator>(c => c.Id == product.CreatorId);

            // promotions & ratings…
            var now = DateTime.UtcNow;
            var activePromotion = Db.Single<Promotion>(p =>
                p.ProductId == request.Id &&
                p.StartDate <= now &&
                p.EndDate   >= now);

            var avgRating = Db.Scalar<double?>(
                "SELECT AVG(Rating) FROM reviews WHERE ProductId = @id",
                new { id = request.Id }) ?? 0;

            var reviewCount = Db.Scalar<int>(
                "SELECT COUNT(*) FROM reviews WHERE ProductId = @id",
                new { id = request.Id });

            return new ProductResponse {
                Product         = product,
                Genres          = genres,
                Creator         = creator,
                ActivePromotion = activePromotion,
                AverageRating   = (decimal)avgRating,
                ReviewCount     = reviewCount
            };
        }


        public object Get(QueryProducts request)
        {
            var q = Db.From<Product>();

            if (request.CategoryId.HasValue)
                q.Where(p => p.CategoryId == request.CategoryId.Value);

            if (request.CreatorId.HasValue)
                q.And(p => p.CreatorId == request.CreatorId.Value);

            if (request.Available.HasValue)
                q.And(p => p.Available == request.Available.Value);

            if (request.PriceMin.HasValue)
                q.And(p => p.Price >= request.PriceMin.Value);

            if (request.PriceMax.HasValue)
                q.And(p => p.Price <= request.PriceMax.Value);

            if (!string.IsNullOrEmpty(request.TitleContains))
                q.And(p => p.Title.Contains(request.TitleContains));

            // Filter by genres (product must have all genres in GenreIds)
            if (request.GenreIds?.Count > 0)
            {
                foreach (var genreId in request.GenreIds)
                {
                    var subQuery = Db.From<ProductGenre>()
                        .Where(pg => pg.GenreId == genreId)
                        .Select(pg => pg.ProductId);

                    q.And(p => Sql.In(p.Id, subQuery));
                }
            }

            var total = Db.Count(q);

            q.Limit(request.Skip, request.Take);

            var products = Db.Select(q);

            var now = DateTime.UtcNow;
            var productViews = products.Select(p =>
            {
                var promo = Db.Single<Promotion>(x =>
                    x.ProductId == p.Id &&
                    x.StartDate <= now &&
                    x.EndDate >= now);

                var avg = Db.Scalar<double?>(
                    "SELECT AVG(Rating) FROM reviews WHERE ProductId = @id", new { id = p.Id });

                return new ProductView
                {
                    Id = p.Id,
                    Title = p.Title,
                    Image = p.Image,
                    Price = p.Price,
                    Description = p.Description,
                    Available = p.Available,
                    Stock = p.Stock,
                    CategoryId = p.CategoryId,
                    CreatorId = p.CreatorId,
                    HeroSection = p.HeroSection,
                    YoutubeTrailerLink = p.YoutubeTrailerLink,
                    PromotionName = promo?.PromotionName,
                    AverageRating = (decimal?)avg
                };
            }).ToList();


            return new QueryProductsResponse
            {
                Results = productViews,
                Total = (int)total
            };

        }

        public object Put(UpdateProduct request)
        {
            var product = Db.SingleById<Product>(request.Id);
            if (product == null)
                throw HttpError.NotFound($"Product with Id {request.Id} not found");

            product.Title = request.Title;
            product.Image = request.Image;
            product.Price = request.Price;
            product.Description = request.Description;
            product.Available = request.Available;
            product.Stock = request.Stock;
            product.CategoryId = request.CategoryId;
            product.CreatorId = request.CreatorId;
            product.HeroSection = request.HeroSection;
            product.YoutubeTrailerLink = request.YoutubeTrailerLink;

            Db.Update(product);

            // Update genres: delete old ones, insert new ones
            Db.Delete<ProductGenre>(pg => pg.ProductId == product.Id);
            if (request.GenreIds?.Any() == true)
            {
                foreach (var genreId in request.GenreIds)
                {
                    Db.Insert(new ProductGenre
                    {
                        ProductId = product.Id,
                        GenreId = genreId
                    });
                }
            }

            return product;
        }

        public void Delete(DeleteProduct request)
        {
            var product = Db.SingleById<Product>(request.Id);
            if (product == null)
                throw HttpError.NotFound($"Product with Id {request.Id} not found");

            Db.Delete<ProductGenre>(pg => pg.ProductId == request.Id);
            Db.DeleteById<Product>(request.Id);
        }
    }
}
