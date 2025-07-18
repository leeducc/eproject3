// ServiceInterface/VoteService.cs
using System.Threading.Tasks;
using ServiceStack;
using ServiceStack.OrmLite;
using eproject3.ServiceModel.Types;
using eproject3.ServiceModel;

namespace eproject3.ServiceInterface
{
    public class VoteService : Service
    {
        // POST /api/posts/{PostId}/vote
        // Body: { PostId, VoteType }
        // Toggles: if same VoteType exists, remove it; else insert/update
        public async Task Any(VotePost request)
        {
            var userId = int.Parse(SessionAs<AuthUserSession>().UserAuthId);

            // 1) check existing vote
            var existing = await Db.SingleAsync<PostVote>(pv =>
                pv.PostId == request.PostId && pv.UserId == userId);

            if (existing != null && existing.VoteType == request.VoteType)
            {
                // same vote again → remove (undo)
                await Db.DeleteAsync<PostVote>(pv =>
                    pv.PostId == request.PostId && pv.UserId == userId);
            }
            else
            {
                // new or changed vote → upsert
                await Db.ExecuteSqlAsync(@"
INSERT INTO PostVote (PostId, UserId, VoteType)
VALUES (@PostId,@UserId,@VoteType)
ON DUPLICATE KEY UPDATE VoteType = @VoteType",
                    new { request.PostId, UserId = userId, request.VoteType });
            }
        }

        // DELETE /api/posts/{PostId}/vote
        // You can still call this directly to force unvote
        public Task Any(UnvotePost request)
        {
            var userId = int.Parse(SessionAs<AuthUserSession>().UserAuthId);
            return Db.DeleteAsync<PostVote>(pv =>
                pv.PostId == request.PostId && pv.UserId == userId);
        }

        // POST /api/comments/{CommentId}/vote
        public async Task Any(VoteComment request)
        {
            var userId = int.Parse(SessionAs<AuthUserSession>().UserAuthId);

            var existing = await Db.SingleAsync<CommentVote>(cv =>
                cv.CommentId == request.CommentId && cv.UserId == userId);

            if (existing != null && existing.VoteType == request.VoteType)
            {
                await Db.DeleteAsync<CommentVote>(cv =>
                    cv.CommentId == request.CommentId && cv.UserId == userId);
            }
            else
            {
                await Db.ExecuteSqlAsync(@"
INSERT INTO CommentVote (CommentId, UserId, VoteType)
VALUES (@CommentId,@UserId,@VoteType)
ON DUPLICATE KEY UPDATE VoteType = @VoteType",
                    new { request.CommentId, UserId = userId, request.VoteType });
            }
        }

        // DELETE /api/comments/{CommentId}/vote
        public Task Any(UnvoteComment request)
        {
            var userId = int.Parse(SessionAs<AuthUserSession>().UserAuthId);
            return Db.DeleteAsync<CommentVote>(cv =>
                cv.CommentId == request.CommentId && cv.UserId == userId);
        }
    }
}
