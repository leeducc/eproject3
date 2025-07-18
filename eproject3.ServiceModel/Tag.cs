namespace eproject3.ServiceModel;
using ServiceStack.DataAnnotations;
[Alias("tags")]
public class Tag
{
    [AutoIncrement] public int Id { get; set; }
    public string Name { get; set; }
}
