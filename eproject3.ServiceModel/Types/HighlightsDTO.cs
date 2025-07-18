// ServiceModel/Highlights.cs
using ServiceStack;
using System.Collections.Generic;
using eproject3.ServiceModel.Types;

namespace eproject3.ServiceModel
{
    [Route("/api/highlights", "GET")]
    public class QueryHighlights : IReturn<QueryHighlightsResponse>
    {
        public string Route { get; set; }
    }

    public class QueryHighlightsResponse
    {
        public List<Highlight> Results { get; set; }
    }
}