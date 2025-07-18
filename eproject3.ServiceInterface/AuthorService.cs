using ServiceStack;
using ServiceStack.OrmLite;
using eproject3.ServiceModel;
using eproject3.ServiceModel.Types;
using eproject3.ServiceInterface.Utils;

namespace eproject3.ServiceInterface;

public class AuthorService : Service
{
    public object Get(GetAuthors req)
    {
        var q = Db.From<Author>();

        if (req.Id != null)
            q.Where(x => x.Id == req.Id.Value);
        else if (!string.IsNullOrEmpty(req.NameSlug))
            q.Where(x => x.Slug == req.NameSlug);

        var authors = Db.Select(q);
        return new GetAuthorsResponse {
            Results = authors.ConvertAll(x => x.ConvertTo<AuthorDto>())
        };
    }

    public object Post(CreateAuthor req)
    {
        var slug = SlugUtils.ToSlug(req.Name);

        if (Db.Exists<Author>(x => x.Slug == slug))
            throw HttpError.Conflict("Author with this slug already exists.");

        var author = req.ConvertTo<Author>();
        author.Slug = slug;

        var id = (int)Db.Insert(author, selectIdentity: true);
        return Db.SingleById<Author>(id).ConvertTo<AuthorDto>();
    }

    public object Put(UpdateAuthor req)
    {
        var author = Db.SingleById<Author>(req.Id);
        if (author == null)
            throw HttpError.NotFound("Author not found");

        req.PopulateWith(author);

        if (!string.IsNullOrWhiteSpace(req.Name))
        {
            var newSlug = SlugUtils.ToSlug(req.Name);
            if (newSlug != author.Slug && Db.Exists<Author>(x => x.Slug == newSlug))
                throw HttpError.Conflict("Another author already uses this slug.");
            author.Slug = newSlug;
        }

        Db.Update(author);
        return author.ConvertTo<AuthorDto>();
    }

    public void Delete(DeleteAuthor req)
    {
        Db.DeleteById<Author>(req.Id);
    }
}