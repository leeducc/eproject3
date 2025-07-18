using ServiceStack;

namespace eproject3.ServiceModel.Types;

public class AuthorDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Slug { get; set; }
    public string Email { get; set; }
    public string Bio { get; set; }
    public string ProfileUrl { get; set; }
    public string TwitterUrl { get; set; }
    public string ThreadsUrl { get; set; }
    public string GitHubUrl { get; set; }
    public string MastodonUrl { get; set; }
}

[Route("/api/authors", "GET")]
[Route("/api/authors/{Id}", "GET")]
public class GetAuthors : IReturn<GetAuthorsResponse>
{
    public int? Id { get; set; }
    public string? NameSlug { get; set; }
}

public class GetAuthorsResponse
{
    public List<AuthorDto> Results { get; set; }
    public ResponseStatus ResponseStatus { get; set; }
}

[RequiredRole("Admin")]
[Route("/api/authors", "POST")]
public class CreateAuthor : IReturn<AuthorDto>
{
    public string Name { get; set; }
    public string Email { get; set; }
    public string Bio { get; set; }
    public string ProfileUrl { get; set; }
    public string TwitterUrl { get; set; }
    public string ThreadsUrl { get; set; }
    public string GitHubUrl { get; set; }
    public string MastodonUrl { get; set; }
}

[RequiredRole("Admin")]
[Route("/api/authors/{Id}", "PUT")]
public class UpdateAuthor : IReturn<AuthorDto>
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string? Bio { get; set; }
    public string? ProfileUrl { get; set; }
    public string? TwitterUrl { get; set; }
    public string? ThreadsUrl { get; set; }
    public string? GitHubUrl { get; set; }
    public string? MastodonUrl { get; set; }
}

[RequiredRole("Admin")]
[Route("/api/authors/{Id}", "DELETE")]
public class DeleteAuthor : IReturnVoid
{
    public int Id { get; set; }
}