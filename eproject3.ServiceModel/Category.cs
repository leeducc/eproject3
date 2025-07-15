using ServiceStack.DataAnnotations;

namespace eproject3.ServiceModel;

[Alias("categories")]
public class Category
{
    [AutoIncrement]
    public int Id { get; set; }

    [Required]
    public string Name { get; set; }
}