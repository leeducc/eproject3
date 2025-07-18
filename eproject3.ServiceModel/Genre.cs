using ServiceStack.DataAnnotations;

namespace eproject3.ServiceModel;

[Alias("genres")]
public class Genre
{
    [AutoIncrement]
    public int Id { get; set; }

    [Required]
    public string Name { get; set; }

    [References(typeof(Category))]
    public int CategoryId { get; set; }
}