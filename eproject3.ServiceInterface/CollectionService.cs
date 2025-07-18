// eproject3.ServiceInterface/CollectionService.cs
using ServiceStack;
using ServiceStack.OrmLite;
using eproject3.ServiceModel.Types;
using eproject3.ServiceModel;

namespace eproject3.ServiceInterface
{
    public class CollectionService : Service
    {
        static readonly string[] BuiltIns = { "Favorites", "Look Again" };

        // POST /api/collections
        public object Post(CreateCollection req)
        {
            var userId = int.Parse(SessionAs<AuthUserSession>().UserAuthId);

            if (string.IsNullOrWhiteSpace(req.Name))
                throw HttpError.BadRequest(nameof(req.Name), "Collection name is required");

            if (Db.Exists<Collection>(c => c.UserId == userId && c.Name == req.Name))
                throw HttpError.Conflict($"Collection '{req.Name}' already exists.");

            var coll = new Collection {
                UserId    = userId,
                Name      = req.Name,
                CreatedAt = DateTime.UtcNow
            };
            coll.Id = (int)Db.Insert(coll, selectIdentity: true);

            return new CollectionDto { Id = coll.Id, Name = coll.Name };
        }

        // GET /api/collections?searchTerm=&prefix=
        public object Get(GetCollections req)
        {
            var userId = int.Parse(SessionAs<AuthUserSession>().UserAuthId);
            var q = Db.From<Collection>().Where(c => c.UserId == userId);

            if (!string.IsNullOrWhiteSpace(req.SearchTerm))
                q = q.And(c => c.Name.Contains(req.SearchTerm));
            if (!string.IsNullOrWhiteSpace(req.Prefix))
                q = q.And(c => c.Name.StartsWith(req.Prefix));

            var cols = Db.Select(q);
            foreach (var name in BuiltIns)
            {
                if (!cols.Any(c => c.Name == name))
                    cols.Insert(0, new Collection { Id = 0, UserId = userId, Name = name });
            }

            return new GetCollectionsResponse { Collections = cols.Select(c => new CollectionDto { Id = c.Id, Name = c.Name }).ToList() };
        }

        // PUT /api/collections/{Id}
        public object Put(UpdateCollection req)
        {
            var userId = int.Parse(SessionAs<AuthUserSession>().UserAuthId);

            if (string.IsNullOrWhiteSpace(req.Name))
                throw HttpError.BadRequest(nameof(req.Name), "Collection name is required");

            var existing = Db.SingleById<Collection>(req.Id);
            if (existing == null || existing.UserId != userId)
                throw HttpError.NotFound($"Collection {req.Id}");
            if (BuiltIns.Contains(existing.Name))
                throw HttpError.Forbidden("Cannot rename a default collection.");
            if (Db.Exists<Collection>(c => c.UserId == userId && c.Name == req.Name && c.Id != req.Id))
                throw HttpError.Conflict($"A collection named '{req.Name}' already exists.");

            existing.Name = req.Name;
            Db.Update(existing);

            return new CollectionDto { Id = existing.Id, Name = existing.Name };
        }

        // DELETE /api/collections/{Id}
        public void Delete(DeleteCollection req)
        {
            var userId = int.Parse(SessionAs<AuthUserSession>().UserAuthId);
            var coll = Db.SingleById<Collection>(req.Id);
            if (coll == null || coll.UserId != userId) return;
            if (BuiltIns.Contains(coll.Name))
                throw HttpError.Forbidden("Cannot delete default collection.");
            Db.Delete<CollectionItem>(ci => ci.CollectionId == req.Id);
            Db.DeleteById<Collection>(req.Id);
        }

        // POST /api/collections/{Name}/items
        public void Post(AddToCollection req)
        {
            var userId = int.Parse(SessionAs<AuthUserSession>().UserAuthId);
            if (string.IsNullOrWhiteSpace(req.Name))
                throw HttpError.BadRequest(nameof(req.Name), "Collection name is required");
            var coll = Db.Single<Collection>(c => c.UserId == userId && c.Name == req.Name);
            if (coll == null)
            {
                coll = new Collection { UserId = userId, Name = req.Name, CreatedAt = DateTime.UtcNow };
                coll.Id = (int)Db.Insert(coll, selectIdentity: true);
            }
            if (!Db.Exists<CollectionItem>(ci => ci.CollectionId == coll.Id && ci.ProductId == req.ProductId))
            {
                Db.Insert(new CollectionItem { CollectionId = coll.Id, ProductId = req.ProductId, AddedAt = DateTime.UtcNow });
            }
        }

        // DELETE /api/collections/{Name}/items/{ProductId}
        public void Delete(RemoveFromCollection req)
        {
            var userId = int.Parse(SessionAs<AuthUserSession>().UserAuthId);
            var coll = Db.Single<Collection>(c => c.UserId == userId && c.Name == req.Name);
            if (coll == null || BuiltIns.Contains(coll.Name)) return;
            Db.Delete<CollectionItem>(ci => ci.CollectionId == coll.Id && ci.ProductId == req.ProductId);
        }

        // GET /api/collections/{Name}/items
        public object Get(GetCollectionItems req)
        {
            var userId = int.Parse(SessionAs<AuthUserSession>().UserAuthId);
            var coll = Db.Single<Collection>(c => c.UserId == userId && c.Name == req.Name);
            if (coll == null) return new GetCollectionItemsResponse { Items = new List<CollectionItemDto>() };
            var items = Db.Select<CollectionItem>(ci => ci.CollectionId == coll.Id);
            var productIds = items.Select(i => i.ProductId).ToArray();
            var products = Db.Select<Product>(p => Sql.In(p.Id, productIds));
            return new GetCollectionItemsResponse
            {
                Items = items.Select(ci =>
                {
                    var p = products.First(pr => pr.Id == ci.ProductId);
                    return new CollectionItemDto { ProductId = p.Id, Title = p.Title, Image = p.Image, Price = p.Price, AddedAt = ci.AddedAt };
                }).ToList()
            };
        }
    }
}
