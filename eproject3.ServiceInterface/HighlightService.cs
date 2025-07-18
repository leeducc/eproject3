// ServiceInterface/HighlightService.cs
using ServiceStack;
using ServiceStack.OrmLite;
using eproject3.ServiceModel;
using eproject3.ServiceModel.Types;

namespace eproject3.ServiceInterface
{
    public class HighlightService : Service
    {
        // GET /api/highlights?categoryId=1
        public object Get(QueryHighlights req)
        {
            var q = Db.From<Highlight>()
                .Where(h => h.CategoryId == req.CategoryId)
                .OrderBy(h => h.SortOrder)
                .Limit(3);

            return new QueryHighlightsResponse {
                Results = Db.Select(q)
            };
        }

        // GET /api/highlights/{Id}
        public object Get(GetHighlight req)
        {
            return Db.SingleById<Highlight>(req.Id)
                   ?? throw HttpError.NotFound($"Highlight {req.Id} not found");
        }

        // POST /api/highlights
        [Authenticate]
        [RequiredRole("Admin")]
        public object Post(CreateHighlight req)
        {
            var h = req.ConvertTo<Highlight>();
            Db.Insert(h);
            h.Id = (int)Db.LastInsertId();
            return h;
        }

        // PUT /api/highlights/{Id}
        [Authenticate]
        [RequiredRole("Admin")]
        public object Put(UpdateHighlight req)
        {
            var h = Db.SingleById<Highlight>(req.Id)
                    ?? throw HttpError.NotFound($"Highlight {req.Id} not found");

            h.PopulateWith(req);
            Db.Update(h);
            return h;
        }

        // DELETE /api/highlights/{Id}
        [Authenticate]
        [RequiredRole("Admin")]
        public void Delete(DeleteHighlight req)
        {
            if (Db.DeleteById<Highlight>(req.Id) == 0)
                throw HttpError.NotFound($"Highlight {req.Id} not found");
        }
    }
}