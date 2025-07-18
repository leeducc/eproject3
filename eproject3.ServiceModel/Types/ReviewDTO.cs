using System;
using System.Collections.Generic;
using ServiceStack;
using ServiceStack.DataAnnotations;

namespace eproject3.ServiceModel;


[RequiredRole("User", "Admin")]
[Route("/api/reviews", "POST")]
[Authenticate]
public class CreateReview : IReturn<ReviewDto>
{
    public int ProductId { get; set; }
    public byte Rating { get; set; }
    public string ReviewText { get; set; }
}

[RequiredRole("User", "Admin")]
[Route("/api/reviews/{Id}", "PUT")]
[Authenticate]
public class UpdateReview : IReturn<ReviewDto>
{
    public int Id { get; set; }
    public byte Rating { get; set; }
    public string ReviewText { get; set; }
}


[RequiredRole("User", "Admin")]
[Route("/api/reviews/{Id}", "DELETE")]
[Authenticate]
public class DeleteReview : IReturnVoid
{
    public int Id { get; set; }
}


[RequiredRole("User", "Admin")]
[Route("/api/reviews", "GET")]
[Route("/api/reviews/{ProductId}", "GET")]
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
    public int Total { get; set; }
}

public class ReviewDto
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public int UserId { get; set; }
    public string UserEmail { get; set; }
    public byte Rating { get; set; }
    public string ReviewText { get; set; }
    public DateTime CreatedAt { get; set; }
}