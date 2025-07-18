using ServiceStack;
using ServiceStack.OrmLite;
using eproject3.ServiceModel.Types;
using eproject3.ServiceModel;

namespace eproject3.ServiceInterface;
public class NewsService : Service
{
    public object Get(GetNews req)
    {
        var q = Db.From<News>()
            .OrderByDescending(x => x.Date);

        if (req.Id != null)
            q.Where(x => x.Id == req.Id.Value);

        if (!string.IsNullOrEmpty(req.Slug))
            q.Where(x => x.Slug == req.Slug);

        // ← YEAR filter: use a date‐range so it's database‐agnostic
        if (req.Year.HasValue)
        {
            var start = new DateTime(req.Year.Value, 1, 1);
            var end   = start.AddYears(1);
            q.Where(x => x.Date >= start && x.Date < end);
        }

        if (!string.IsNullOrEmpty(req.Tag))
            q.Join<NewsTags>((n, nt) => n.Id == nt.NewsId)
                .Join<Tag>((nt, t) => nt.Id == t.Id && t.Name == req.Tag);

        if (req.AuthorId.HasValue)
            q.Where(x => x.AuthorId == req.AuthorId.Value);

        var results = Db.LoadSelect(q);
        var dtos    = results.ConvertAll(n => ToDto(n));
        return new GetNewsResponse { Results = dtos };
    }


    public object Post(CreateNews req)
    {
        var news = req.ConvertTo<News>();
        var newsId = (int)Db.Insert(news, selectIdentity: true);

        if (req.TagIds?.Any() == true)
        {
            var tags = req.TagIds.Select(id => new NewsTags { NewsId = newsId, TagId = id });
            Db.InsertAll(tags);
        }

        var created = Db.LoadSingleById<News>(newsId);
        return ToDto(created);
    }

    public object Put(UpdateNews req)
    {
        var news = Db.SingleById<News>(req.Id);
        if (news == null)
            throw HttpError.NotFound("News not found");

        req.PopulateWith(news); // populate non-null fields only
        Db.Update(news);

        if (req.TagIds != null)
        {
            Db.Delete<NewsTags>(x => x.NewsId == news.Id);
            Db.InsertAll(req.TagIds.Select(id => new NewsTags { NewsId = news.Id, TagId = id }));
        }

        var updated = Db.LoadSingleById<News>(req.Id);
        return ToDto(updated);
    }

    public void Delete(DeleteNews req)
    {
        Db.Delete<NewsTags>(x => x.NewsId == req.Id);
        Db.DeleteById<News>(req.Id);
    }

    private NewsDto ToDto(News news)
    {
        var author = Db.SingleById<Author>(news.AuthorId);
        var tagNames = Db.Select(
            Db.From<Tag>()
              .Join<NewsTags>((t, nt) => t.Id == nt.TagId)
              .Where<NewsTags>(nt => nt.NewsId == news.Id)
        ).Select(t => t.Name).ToList();

        return new NewsDto {
            Id = news.Id,
            Slug = news.Slug,
            Title = news.Title,
            Summary = news.Summary,
            AuthorName = author?.Name,
            AuthorProfileUrl = author?.ProfileUrl,
            Image = news.Image,
            Date = news.Date,
            ContentPath = news.ContentPath,
            WordCount = news.WordCount,
            MinutesToRead = news.MinutesToRead,
            Tags = tagNames,
        };
    }
}

