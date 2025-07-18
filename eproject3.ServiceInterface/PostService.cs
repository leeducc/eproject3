using System;
using System.Threading.Tasks;
using ServiceStack;
using ServiceStack.OrmLite;
using eproject3.ServiceModel;
using eproject3.ServiceModel.Types;

namespace eproject3.ServiceInterface
{
    public class PostService : Service
    {
        public async Task<GetPostsResponse> Get(GetPosts request)
        {
            var q = Db.From<Post>();
            if (request.ChannelId.HasValue)
                q.Where(p => p.ChannelId == request.ChannelId.Value);
            var posts = await Db.SelectAsync(q);
            return new GetPostsResponse { Posts = posts };
        }

        public async Task<Post> Get(GetPost request)
        {
            var post = await Db.SingleByIdAsync<Post>(request.Id)
                       ?? throw HttpError.NotFound("Post not found");
            post.Review = await Db.ScalarAsync<int>(
                "SELECT COALESCE(SUM(VoteType),0) FROM PostVote WHERE PostId=@Id",
                new { Id = post.Id });
            return post;
        }

        public async Task<Post> Post(CreatePost request)
        {
            var session = await SessionAsAsync<AuthUserSession>();
            var post = request.ConvertTo<Post>();
            post.UserId = int.Parse(session.UserAuthId);
            post.CreatedAt = DateTime.UtcNow;
            post.Id = (int)await Db.InsertAsync(post, selectIdentity: true);
            return post;
        }

        public async Task<Post> Put(UpdatePost request)
        {
            var post = await Db.SingleByIdAsync<Post>(request.Id);
            post.Title   = request.Title;
            post.Content = request.Content;
            await Db.UpdateAsync(post);
            return post;
        }

        public Task Delete(DeletePost request)
            => Db.DeleteByIdAsync<Post>(request.Id);
    }
}