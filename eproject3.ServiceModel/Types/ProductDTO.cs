using System;
using System.Collections.Generic;
using ServiceStack;

namespace eproject3.ServiceModel.Types
{
    // CREATE Product - Admin only
    [Route("/api/products", "POST")]
    [RequiredRole("Admin")]
    public class CreateProduct : IReturn<Product>
    {
        public string Title { get; set; }
        public string Image { get; set; }
        public decimal Price { get; set; }
        public string Description { get; set; }
        public bool Available { get; set; } = true;
        public int Stock { get; set; }
        public int CategoryId { get; set; }
        public int CreatorId { get; set; }
        public bool HeroSection { get; set; }
        public string YoutubeTrailerLink { get; set; }
        public List<int> GenreIds { get; set; }
    }

    // GET Product by Id - public
    [Route("/api/products/{Id}", "GET")]
    public class GetProduct : IReturn<ProductResponse>
    {
        public int Id { get; set; }
    }

    public class ProductResponse
    {
        public Product Product { get; set; }
        public List<Genre> Genres { get; set; }
        public Promotion ActivePromotion { get; set; }
        public decimal AverageRating { get; set; }
        public int ReviewCount { get; set; }
    }

    // GET Products list with filters & paging - public
    [Route("/api/products", "GET,POST")]
    public class QueryProducts : IReturn<QueryProductsResponse>, IQueryDb<Product>
    {
        public int? CategoryId { get; set; }
        public int? CreatorId { get; set; }
        public bool? Available { get; set; }
        public decimal? PriceMin { get; set; }
        public decimal? PriceMax { get; set; }
        public string? TitleContains { get; set; }
       
        public int? RatingMin { get; set; }
        public bool? HeroSection { get; set; }
        
        public int? Skip { get; set; }
        public int? Take { get; set; } = 20;
       
        public string OrderBy { get; set; }
        public string OrderByDesc { get; set; }
        public string Include { get; set; }
        public string Fields { get; set; }
        public List<int>? GenreIds { get; set; } = new();
        public Dictionary<string, string>? Meta { get; set; } 
    }

    public class QueryProductsResponse
    {
        public List<ProductView> Results { get; set; }
        public int Total { get; set; }
        
    }

    // UPDATE Product - Admin only
    [Route("/api/products/{Id}", "PUT")]
    [RequiredRole("Admin")]
    public class UpdateProduct : IReturn<Product>
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Image { get; set; }
        public decimal Price { get; set; }
        public string Description { get; set; }
        public bool Available { get; set; }
        public int Stock { get; set; }
        public int CategoryId { get; set; }
        public int CreatorId { get; set; }
        public bool HeroSection { get; set; }
        public string YoutubeTrailerLink { get; set; }
        public List<int> GenreIds { get; set; }
    }

    // DELETE Product - Admin only
    [Route("/api/products/{Id}", "DELETE")]
    [RequiredRole("Admin")]
    public class DeleteProduct : IReturnVoid
    {
        public int Id { get; set; }
    }
}
