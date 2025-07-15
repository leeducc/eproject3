using ServiceStack;
using System.Collections.Generic;

namespace eproject3.ServiceModel.Types
{
    

    [Route("/api/creators", "POST")]
    [RequiredRole("Admin")]
    public class CreateCreator : IReturn<Creator>
    {
        public string Name { get; set; }
        public CreatorType Type { get; set; }
        public bool IsHero { get; set; } 
        public string Image { get; set; } 
    }

    [Route("/api/creators/{Id}", "GET")]
    public class GetCreator : IReturn<Creator>
    {
        public int Id { get; set; }
    }

    [Route("/api/creators", "GET")]
    public class QueryCreators : IReturn<QueryCreatorsResponse>
    {
        public CreatorType? Type { get; set; }
    }

    public class QueryCreatorsResponse
    {
        public List<Creator> Results { get; set; }
    }

    [Route("/api/creators/{Id}", "PUT")]
    [RequiredRole("Admin")]
    public class UpdateCreator : IReturn<Creator>
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public CreatorType Type { get; set; }
        public bool IsHero { get; set; }
        public string Image { get; set; } 
    }

    [Route("/api/creators/{Id}", "DELETE")]
    [RequiredRole("Admin")]
    public class DeleteCreator : IReturnVoid
    {
        public int Id { get; set; }
    }
}