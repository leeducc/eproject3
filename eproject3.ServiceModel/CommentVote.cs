using ServiceStack.DataAnnotations;

namespace eproject3.ServiceModel;

[Alias("commentvote")]
public class CommentVote
{
    [AutoIncrement]
    public int Id { get; set; }

    [References(typeof(Comment))]
    public int CommentId { get; set; }

    [References(typeof(CustomUser))]
    public int UserId { get; set; }

    [Required]
    public sbyte VoteType { get; set; } // 1 or -1
}