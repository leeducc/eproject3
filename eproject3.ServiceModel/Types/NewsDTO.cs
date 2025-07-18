using ServiceStack;


namespace eproject3.ServiceModel.Types;

[Route("/api/news",    "GET")]
[Route("/api/GetNews", "GET")]
[Route("/api/news/{Id}",    "GET")]
[Route("/api/GetNews/{Id}", "GET")]
public class GetNews : IReturn<GetNewsResponse>
{
    public int? Id { get; set; }
    public string? Slug { get; set; }
    public int? AuthorId { get; set; }
    public string? AuthorSlug { get; set; } 
    public string? Tag { get; set; }
    public int?    Year       { get; set; }
}

public class GetNewsResponse
{
    public List<NewsDto> Results { get; set; }
    public ResponseStatus ResponseStatus { get; set; }
}
[RequiredRole ("Admin")]
[Route("/api/News", "POST")]
public class CreateNews : IReturn<NewsDto>
{
    public string Title { get; set; }
    public string Slug { get; set; }
    public string Summary { get; set; }
    public int AuthorId { get; set; }
    public string Image { get; set; }
    public DateTime Date { get; set; }
    public string ContentPath { get; set; }
    public int WordCount { get; set; }
    public int MinutesToRead { get; set; }
    public List<int> TagIds { get; set; }
}
[RequiredRole ("Admin")]
[Route("/api/News/{Id}", "PUT")]
public class UpdateNews: IReturn<NewsDto>
{
    public int Id { get; set; }
    public string? Title { get; set; }
    public string? Slug { get; set; }
    public string? Summary { get; set; }
    public int? AuthorId { get; set; }
    public string? Image { get; set; }
    public DateTime? Date { get; set; }
    public string? ContentPath { get; set; }
    public int? WordCount { get; set; }
    public int? MinutesToRead { get; set; }
    public List<int>? TagIds { get; set; }
}
[RequiredRole ("Admin")]
[Route("/api/News/{Id}", "DELETE")]
public class DeleteNews : IReturnVoid
{
    public int Id { get; set; }
}


public class NewsDto
{
    public int Id { get; set; }
    public string Slug { get; set; }
    public string Title { get; set; }
    public string Summary { get; set; }
    public string Image { get; set; }
    public DateTime Date { get; set; }
    public string ContentPath { get; set; }
    public int WordCount { get; set; }
    public int MinutesToRead { get; set; }
    public int AuthorId { get; set; }
    // Extra fields from JOINs
    public string AuthorName { get; set; }
    public string AuthorProfileUrl { get; set; }
    public List<string> Tags { get; set; }
}