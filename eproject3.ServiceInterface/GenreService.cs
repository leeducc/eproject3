using ServiceStack;
using ServiceStack.OrmLite;
using eproject3.ServiceModel.Types;
using eproject3.ServiceModel;
namespace eproject3.ServiceInterface
{
    public class GenreService : Service
    {
        public object Post(CreateGenre request)
        {
            var genre = new Genre
            {
                Name = request.Name,
                CategoryId = request.CategoryId
            };
            Db.Save(genre);
            return genre;
        }

        public object Get(GetGenre request)
        {
            var genre = Db.SingleById<Genre>(request.Id);
            if (genre == null)
                throw HttpError.NotFound($"Genre with Id {request.Id} not found");
            return genre;
        }

        public object Get(QueryGenres request)
        {
            var q = Db.From<Genre>();
            if (request.CategoryId != null)
            {
                q.Where(g => g.CategoryId == request.CategoryId.Value);
            }
            return new QueryGenresResponse
            {
                Results = Db.Select(q)
            };
        }

        public object Put(UpdateGenre request)
        {
            var genre = Db.SingleById<Genre>(request.Id);
            if (genre == null)
                throw HttpError.NotFound($"Genre with Id {request.Id} not found");

            genre.Name = request.Name;
            genre.CategoryId = request.CategoryId;
            Db.Update(genre);
            return genre;
        }

        public void Delete(DeleteGenre request)
        {
            var genre = Db.SingleById<Genre>(request.Id);
            if (genre == null)
                throw HttpError.NotFound($"Genre with Id {request.Id} not found");

            Db.DeleteById<Genre>(request.Id);
        }
    }
}