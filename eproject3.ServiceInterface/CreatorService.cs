using ServiceStack;
using ServiceStack.OrmLite;
using eproject3.ServiceModel.Types;
using eproject3.ServiceModel;
namespace eproject3.ServiceInterface
{
    public class CreatorService : Service
    {
        public object Post(CreateCreator request)
        {
            var creator = request.ConvertTo<Creator>();
            Db.Save(creator);
            return creator;
        }

        public object Get(GetCreator request)
        {
            var creator = Db.SingleById<Creator>(request.Id);
            if (creator == null)
                throw HttpError.NotFound($"Creator with Id {request.Id} not found");
            return creator;
        }

        public object Get(QueryCreators request)
        {
            var q = Db.From<Creator>();
            if (request.Type != null)
                q.Where(x => x.Type == request.Type.Value);
            return new QueryCreatorsResponse { Results = Db.Select(q) };
        }

        public object Put(UpdateCreator request)
        {
            var creator = Db.SingleById<Creator>(request.Id);
            if (creator == null)
                throw HttpError.NotFound($"Creator with Id {request.Id} not found");

            creator.Name = request.Name;
            creator.Type = request.Type;
            creator.IsHero = request.IsHero;
            Db.Update(creator);
            return creator;
        }

        public void Delete(DeleteCreator request)
        {
            if (Db.SingleById<Creator>(request.Id) == null)
                throw HttpError.NotFound($"Creator with Id {request.Id} not found");

            Db.DeleteById<Creator>(request.Id);
        }
    }
}