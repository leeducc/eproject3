namespace eproject3.ServiceModel;
using ServiceStack.DataAnnotations;
[Alias("news")]
public class News
{
    [AutoIncrement] public int Id { get; set; }
    public string Slug { get; set; }
    public string Title { get; set; }
    public string Summary { get; set; }
    public int AuthorId { get; set; }
    public string Image { get; set; }
    public DateTime Date { get; set; }
    public string ContentPath { get; set; }
    public int WordCount { get; set; }
    public int MinutesToRead { get; set; }

    
}
