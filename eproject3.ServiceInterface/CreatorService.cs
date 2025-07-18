// ServiceInterface/CreatorService.cs
using ServiceStack;
using ServiceStack.OrmLite;
using eproject3.ServiceModel;
using eproject3.ServiceModel.Types;
using System.Collections.Generic;

namespace eproject3.ServiceInterface
{
    public class CreatorService : Service
    {
        // GET /api/creators?Type=&IsHero=
        public object Get(QueryCreators request)
        {
            var q = Db.From<Creator>();

            if (request.Type   != null)
                q.Where(x => x.Type   == request.Type.Value);

            if (request.IsHero != null)
                q.Where(x => x.IsHero == request.IsHero.Value);

            var results = Db.Select(q);
            return new QueryCreatorsResponse { Results = results };
        }

        // GET /api/creators/{Id}
        public object Get(GetCreator request)
        {
            var creator = Db.SingleById<Creator>(request.Id)
                          ?? throw HttpError.NotFound($"Creator {request.Id} not found");

            return creator;
        }

        // POST /api/creators
        public object Post(CreateCreator request)
        {
            var creator = request.ConvertTo<Creator>();
            Db.Save(creator);
            return creator;
        }

        // PUT /api/creators/{Id}
        public object Put(UpdateCreator request)
        {
            var creator = Db.SingleById<Creator>(request.Id)
                          ?? throw HttpError.NotFound($"Creator {request.Id} not found");

            creator.Name        = request.Name;
            creator.Type        = request.Type;
            creator.IsHero      = request.IsHero;
            creator.Image       = request.Image;
            creator.Description = request.Description;

            Db.Update(creator);
            return creator;
        }

        // DELETE /api/creators/{Id}
        public void Delete(DeleteCreator request)
        {
            if (Db.DeleteById<Creator>(request.Id) == 0)
                throw HttpError.NotFound($"Creator {request.Id} not found");
        }
    }
}
