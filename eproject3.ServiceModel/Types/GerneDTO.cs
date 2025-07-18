using ServiceStack;
using System.Collections.Generic;

namespace eproject3.ServiceModel.Types
{
    // Create Genre (Admin Only)
    [Route("/api/genres", "POST")]
    [RequiredRole("Admin")]
    public class CreateGenre : IReturn<Genre>
    {
        public string Name { get; set; }
        public int CategoryId { get; set; }
    }

    // Get Genre by Id
    [Route("/api/genres/{Id}", "GET")]
    public class GetGenre : IReturn<Genre>
    {
        public int Id { get; set; }
    }

    // Query Genres by Category
    [Route("/api/genres", "GET")]
    public class QueryGenres : IReturn<QueryGenresResponse>
    {
        public int? CategoryId { get; set; }
    }

    public class QueryGenresResponse
    {
        public List<Genre> Results { get; set; }
    }

    // Update Genre (Admin Only)
    [Route("/api/genres/{Id}", "PUT")]
    [RequiredRole("Admin")]
    public class UpdateGenre : IReturn<Genre>
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int CategoryId { get; set; }
    }

    // Delete Genre (Admin Only)
    [Route("/api/genres/{Id}", "DELETE")]
    [RequiredRole("Admin")]
    public class DeleteGenre : IReturnVoid
    {
        public int Id { get; set; }
    }
}