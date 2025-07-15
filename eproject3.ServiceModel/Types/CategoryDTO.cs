using ServiceStack;
using System.Collections.Generic;

namespace eproject3.ServiceModel.Types
{
    // Create Category (Admin Only)
    [Route("/api/categories", "POST")]
    [RequiredRole("Admin")]
    public class CreateCategory : IReturn<Category>
    {
        public string Name { get; set; }
    }

    // Get Category by Id
    [Route("/api/categories/{Id}", "GET")]
    public class GetCategory : IReturn<Category>
    {
        public int Id { get; set; }
    }

    // Get All Categories (Public)
    [Route("/api/categories", "GET")]
    public class QueryCategories : IReturn<QueryCategoriesResponse> { }

    public class QueryCategoriesResponse
    {
        public List<Category> Results { get; set; }
    }

    // Update Category (Admin Only)
    [Route("/api/categories/{Id}", "PUT")]
    [RequiredRole("Admin")]
    public class UpdateCategory : IReturn<Category>
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    // Delete Category (Admin Only)
    [Route("/api/categories/{Id}", "DELETE")]
    [RequiredRole("Admin")]
    public class DeleteCategory : IReturnVoid
    {
        public int Id { get; set; }
    }
}