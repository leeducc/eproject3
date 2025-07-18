// ServiceInterface/HighlightService.cs
using ServiceStack;
using ServiceStack.OrmLite;
using eproject3.ServiceModel;
using eproject3.ServiceModel.Types;
using System.Linq;

namespace eproject3.ServiceInterface
{
    public class HighlightService : Service
    {
        // GET /api/highlights?route=/music
        public object Get(QueryHighlights request)
        {
            // Select up to 3 highlights for this route, in SortOrder
            var q = Db.From<Highlight>()
                .Where(x => x.Route == request.Route)
                .OrderBy(x => x.SortOrder)
                .Limit(3);

            var results = Db.Select(q);
            return new QueryHighlightsResponse {
                Results = results
            };
        }
    }
}