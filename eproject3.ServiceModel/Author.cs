namespace eproject3.ServiceModel;

using ServiceStack.DataAnnotations;

// ---- POCOs for OrmLite ----
[Alias("authors")]
public class Author
{
    [AutoIncrement] public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string Bio { get; set; }
    public string Slug { get; set; }
    public string ProfileUrl { get; set; }
    public string TwitterUrl { get; set; }
    public string ThreadsUrl { get; set; }
    public string GitHubUrl { get; set; }
    public string MastodonUrl { get; set; }
}