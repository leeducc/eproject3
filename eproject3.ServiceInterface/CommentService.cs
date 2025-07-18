
using ServiceStack;
using ServiceStack.OrmLite;
using eproject3.ServiceModel;
using eproject3.ServiceModel.Types;

namespace eproject3.ServiceInterface
{
    public class CommentService : Service
    {
        // GET /api/comments?postId={postId}
        public async Task<GetCommentsResponse> Get(GetComments request)
        {
            // 1) Load all comments for the post
            var allComments = await Db.SelectAsync<Comment>(c => c.PostId == request.PostId);

            // 2) Compute vote sums in one query
            var voteSums = (await Db.SelectAsync<(int CommentId, int Sum)>(@"
                SELECT CommentId, COALESCE(SUM(VoteType),0) AS Sum
                FROM CommentVote
                WHERE CommentId IN (@ids)
                GROUP BY CommentId",
                new { ids = allComments.Select(c => c.Id).ToArray() }))
              .ToDictionary(x => x.CommentId, x => x.Sum);

            // 3) Convert to DTOs (with review and empty Replies)
            var dtos = allComments
                .Select(c => {
                    var dto = c.ConvertTo<Comment>();
                    dto.Review = voteSums.TryGetValue(c.Id, out var sum) ? sum : 0;
                    return dto;
                })
                .ToDictionary(d => d.Id);

            // 4) Build threaded tree
            var roots = new List<Comment>();
            foreach (var dto in dtos.Values)
            {
                if (dto.ParentCommentId.HasValue
                    && dtos.TryGetValue(dto.ParentCommentId.Value, out var parent))
                {
                    parent.Replies.Add(dto);
                }
                else
                {
                    roots.Add(dto);
                }
            }

            return new GetCommentsResponse { Comments = roots };
        }

        // GET /api/comments/{Id}
        public async Task<Comment> Get(GetComment request)
        {
            var c = await Db.SingleByIdAsync<Comment>(request.Id)
                    ?? throw HttpError.NotFound("Comment not found");
            var dto = c.ConvertTo<Comment>();
            // compute its review sum
            dto.Review = await Db.ScalarAsync<int>(
                "SELECT COALESCE(SUM(VoteType),0) FROM CommentVote WHERE CommentId=@Id",
                new { Id = c.Id });
            return dto;
        }

        // POST /api/comments
        public async Task<Comment> Post(CreateComment request)
        {
            var session = await SessionAsAsync<AuthUserSession>();
            var comment = request.ConvertTo<Comment>();
            comment.UserId    = int.Parse(session.UserAuthId);
            comment.CreatedAt = DateTime.UtcNow;
            comment.Id        = (int)await Db.InsertAsync(comment, selectIdentity: true);

            var saved = await Db.SingleByIdAsync<Comment>(comment.Id);
            var dto   = saved.ConvertTo<Comment>();
            dto.Review = 0;
            return dto;
        }

        // PUT /api/comments/{Id}
        public async Task<Comment> Put(UpdateComment request)
        {
            await Db.UpdateAsync(request);
            var updated = await Db.SingleByIdAsync<Comment>(request.Id);
            var dto     = updated.ConvertTo<Comment>();
            // recompute its review
            dto.Review = await Db.ScalarAsync<int>(
                "SELECT COALESCE(SUM(VoteType),0) FROM CommentVote WHERE CommentId=@Id",
                new { Id = dto.Id });
            return dto;
        }

        // DELETE /api/comments/{Id}
        public Task Delete(DeleteComment request) =>
            Db.DeleteByIdAsync<Comment>(request.Id);
    }
}
