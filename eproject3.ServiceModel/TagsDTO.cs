namespace eproject3.ServiceModel;
using ServiceStack;
[Route("/api/tags", "GET")]
[Route("/api/tags/{Id}", "GET")]
public class GetTags : IReturn<GetTagsResponse>
{
    public int? Id { get; set; }
}

public class GetTagsResponse
{
    public List<Tag> Results { get; set; }
    public ResponseStatus ResponseStatus { get; set; }
}
[RequiredRole ("Admin")]
[Route("/api/tags", "POST")]
public class CreateTag : IReturn<Tag>
{
    public string Name { get; set; }
}
[RequiredRole ("Admin")]
[Route("/api/tags/{Id}", "PUT")]
public class UpdateTag : IReturn<Tag>
{
    public int Id { get; set; }
    public string Name { get; set; }
}
[RequiredRole ("Admin")]
[Route("/api/tags/{Id}", "DELETE")]
public class DeleteTag : IReturnVoid
{
    public int Id { get; set; }
}
