using ServiceStack.DataAnnotations;

namespace eproject3.ServiceModel;

[Alias("comments")]
public class Comment
{
    public int Id { get; set; }
    public int PostId { get; set; }
    public int? ParentCommentId { get; set; }  
    public int UserId { get; set; }
    public string Content { get; set; }
    public DateTime CreatedAt { get; set; }
    [Ignore]
    public int Review { get; set; }
    [Ignore]
    public List<Comment> Replies { get; set; } = new List<Comment>();
}