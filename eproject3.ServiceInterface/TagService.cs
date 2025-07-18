using ServiceStack;
using ServiceStack.OrmLite;
using eproject3.ServiceModel;
using Types = eproject3.ServiceModel.Types;

namespace eproject3.ServiceInterface;

public class TagService : Service
{
    public object Get(Types.GetTags req)
    {
        var q = Db.From<Tag>();
        if (req.Id != null)
            q.Where(x => x.Id == req.Id.Value);

        var tags = Db.Select(q);
        return new Types.GetTagsResponse {
            Results = tags.ConvertAll(t => t.ConvertTo<Tag>())
        };
    }

    public object Post(Types.CreateTag req)
    {
        var tag = new Tag { Name = req.Name };
        var id = (int)Db.Insert(tag, selectIdentity: true);
        return Db.SingleById<Tag>(id);
    }

    public object Put(Types.UpdateTag req)
    {
        var tag = Db.SingleById<Tag>(req.Id);
        if (tag == null)
            throw HttpError.NotFound("Tag not found");

        tag.Name = req.Name;
        Db.Update(tag);
        return tag;
    }

    public void Delete(Types.DeleteTag req)
    {
        Db.DeleteById<Tag>(req.Id);
    }
}