using ServiceStack.DataAnnotations;

namespace eproject3.ServiceModel;
[Alias("channels")]
public class Channel
{
    [AutoIncrement]
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    public string Name { get; set; }

    public string Description { get; set; }

    [Required]
    public DateTime CreatedAt { get; set; }
}


