using ServiceStack.DataAnnotations;

namespace eproject3.ServiceModel;

[Alias("creators")]
public class Creator
{
    [AutoIncrement]
    public int Id { get; set; }

    [Required]
    public string Name { get; set; }

    [Required]
    public CreatorType Type { get; set; }

    public bool IsHero { get; set; }
    public string Image { get; set; } 
    public string Description { get; set; }
}

public enum CreatorType
{
    Artist,
    Producer,
    Studio
}