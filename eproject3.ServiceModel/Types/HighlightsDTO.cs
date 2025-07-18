// ServiceModel/Highlights.cs
using ServiceStack;
using System.Collections.Generic;
using eproject3.ServiceModel.Types;

namespace eproject3.ServiceModel
{
    // — Query by Category —
    [Route("/api/highlights", "GET")]
    public class QueryHighlights : IReturn<QueryHighlightsResponse>
    {
        public int CategoryId { get; set; }
    }

    public class QueryHighlightsResponse
    {
        public List<Highlight> Results { get; set; }
    }

    // — Get single —
    [Route("/api/highlights/{Id}", "GET")]
    public class GetHighlight : IReturn<Highlight>
    {
        public int Id { get; set; }
    }

    // — Create —
    [Route("/api/highlights", "POST")]
    [RequiredRole("Admin")]
    public class CreateHighlight : IReturn<Highlight>
    {
        public int    CategoryId { get; set; }
        public string ImageUrl   { get; set; }
        public string Link       { get; set; }
        public int    SortOrder  { get; set; }
    }

    // — Update —
    [Route("/api/highlights/{Id}", "PUT")]
    [RequiredRole("Admin")]
    public class UpdateHighlight : IReturn<Highlight>
    {
        public int    Id         { get; set; }
        public int    CategoryId { get; set; }
        public string ImageUrl   { get; set; }
        public string Link       { get; set; }
        public int    SortOrder  { get; set; }
    }

    // — Delete —
    [Route("/api/highlights/{Id}", "DELETE")]
    [RequiredRole("Admin")]
    public class DeleteHighlight : IReturnVoid
    {
        public int Id { get; set; }
    }
}