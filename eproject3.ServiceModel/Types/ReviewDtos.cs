

using ServiceStack;
using ServiceStack.DataAnnotations;

namespace eproject3.ServiceModel;

[Route("/api/reviews", "GET")]
public class GetReviews : IReturn<GetReviewsResponse>
{
    public int? ProductId { get; set; }
    public int? Rating { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class GetReviewsResponse
{
    public List<ReviewDto> Reviews { get; set; }
    public long Total { get; set; }
}

public class ReviewDto
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string UserId { get; set; }
    public string Comment { get; set; }
    public int Rating { get; set; }
    public DateTime CreatedAt { get; set; }
    public string UserEmail { get; set; }
}

[Route("/api/reviews", "POST")]
public class CreateReview : IReturn<ReviewDto>
{
    public int ProductId { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; }
}

[Route("/api/reviews/{Id}", "PUT")]
public class UpdateReview : IReturn<ReviewDto>
{
    public int Id { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; }
}

[Route("/api/reviews/{Id}", "DELETE")]
public class DeleteReview : IReturnVoid
{
    public int Id { get; set; }
}
