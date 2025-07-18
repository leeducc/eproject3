using ServiceStack.DataAnnotations;

namespace eproject3.ServiceModel;

[Alias("postvote")]
public class PostVote
{
    [AutoIncrement]
    public int Id { get; set; }

    [References(typeof(Post))]
    public int PostId { get; set; }

    [References(typeof(CustomUser))]
    public int UserId { get; set; }

    [Required]
    public sbyte VoteType { get; set; } // 1 or -1
}