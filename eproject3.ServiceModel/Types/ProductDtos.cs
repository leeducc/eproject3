// ServiceModel/ProductDtos.cs
using ServiceStack;

namespace eproject3.ServiceModel.Types;

// AutoQuery for listing/filtering
[Route("/api/products")]
public class QueryProducts : QueryDb<Product>, IReturn<QueryResponse<Product>> { }

// Create
[Route("/products", "POST")]
public class CreateProduct : IReturn<Product>
{
    public string Title { get; set; }
    public string Artist { get; set; }
    public string Image { get; set; }
    public decimal Price { get; set; }
    public string Category { get; set; }
    public string Description { get; set; } 
}

// Update
[Route("/products/{Id}", "PUT")]
public class UpdateProduct : IReturn<Product>
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Artist { get; set; }
    public string Image { get; set; }
    public decimal Price { get; set; }
    public string Category { get; set; }
    public string Description { get; set; } 
}

// Delete
[Route("/products/{Id}", "DELETE")]
public class DeleteProduct : IReturnVoid
{
    public int Id { get; set; }
}

// Get by ID
[Route("/api/products/{Id}", "GET")]
public class GetProduct : IReturn<Product>
{
    public int Id { get; set; }
}

// Optional: Custom search with filters
[Route("/products", "GET")]
public class SearchProducts : IReturn<List<Product>>
{
    public string? Category { get; set; }
    public string? Query { get; set; }     // Matches title or artist
    public string? SortBy { get; set; }    // "asc", "desc", "newest"
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}