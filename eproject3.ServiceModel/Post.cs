using ServiceStack.DataAnnotations;

namespace eproject3.ServiceModel;

[Alias("posts")]
public class Post
{
    [AutoIncrement]
    public int Id { get; set; }

    [References(typeof(Channel))]
    public int ChannelId { get; set; }

    [References(typeof(CustomUser))]
    public int UserId { get; set; }

    [Required]
    [StringLength(200)]
    public string Title { get; set; }

    public string Content { get; set; }

    [Required]
    public DateTime CreatedAt { get; set; }
    
    [Ignore]
    public int Review { get; set; }
}