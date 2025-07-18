

using ServiceStack;

namespace eproject3.ServiceModel
{
    [Route("/api/posts/{PostId}/vote", "POST")]
    public class VotePost : IReturnVoid
    {
        public int PostId { get; set; }
        public sbyte VoteType { get; set; }
    }

    [Route("/api/posts/{PostId}/vote", "DELETE")]
    public class UnvotePost : IReturnVoid
    {
        public int PostId { get; set; }
    }

    [Route("/api/comments/{CommentId}/vote", "POST")]
    public class VoteComment : IReturnVoid
    {
        public int CommentId { get; set; }
        public sbyte VoteType { get; set; }
    }

    [Route("/api/comments/{CommentId}/vote", "DELETE")]
    public class UnvoteComment : IReturnVoid
    {
        public int CommentId { get; set; }
    }
}