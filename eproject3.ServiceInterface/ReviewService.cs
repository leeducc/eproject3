using System;
using System.Linq;
using ServiceStack;
using ServiceStack.OrmLite;
using eproject3.ServiceModel;

namespace eproject3.ServiceInterface;

public class ReviewService : Service
{
    public async Task<ReviewDto> Post(CreateReview request)
    {
        var userSession = await this.SessionAsAsync<AuthUserSession>();
        var userId = int.Parse(userSession.UserAuthId);

        var existing = await Db.SingleAsync<Review>(x => x.ProductId == request.ProductId && x.UserId == userId);
        if (existing != null)
            throw HttpError.Conflict("You have already submitted a review for this product.");

        var review = new Review
        {
            ProductId = request.ProductId,
            UserId = userId,
            Rating = request.Rating,
            ReviewText = request.ReviewText,
            CreatedAt = DateTime.UtcNow
        };

        review.Id = Convert.ToInt32(await Db.InsertAsync(review, selectIdentity: true));


        var user = await Db.SingleByIdAsync<CustomUser>(userId);

        return new ReviewDto
        {
            Id = review.Id,
            ProductId = review.ProductId,
            UserId = userId,
            UserEmail = user?.Email,
            Rating = review.Rating,
            ReviewText = review.ReviewText,
            CreatedAt = review.CreatedAt
        };
    }

    public async Task<ReviewDto> Put(UpdateReview request)
    {
        var review = await Db.SingleByIdAsync<Review>(request.Id);
        if (review == null)
            throw HttpError.NotFound("Review not found.");

        var userSession = await this.SessionAsAsync<AuthUserSession>();
        var userId = int.Parse(userSession.UserAuthId);
        if (review.UserId != userId)
            throw HttpError.Forbidden("You can only update your own reviews.");

        review.Rating = request.Rating;
        review.ReviewText = request.ReviewText;

        await Db.UpdateAsync(review);

        var user = await Db.SingleByIdAsync<CustomUser>(userId);

        return new ReviewDto
        {
            Id = review.Id,
            ProductId = review.ProductId,
            UserId = review.UserId,
            UserEmail = user?.Email,
            Rating = review.Rating,
            ReviewText = review.ReviewText,
            CreatedAt = review.CreatedAt
        };
    }

    public async Task Delete(DeleteReview request)
    {
        var review = await Db.SingleByIdAsync<Review>(request.Id);
        if (review == null)
            throw HttpError.NotFound("Review not found.");

        var userSession = await this.SessionAsAsync<AuthUserSession>();
        var userId = int.Parse(userSession.UserAuthId);
        if (review.UserId != userId)
            throw HttpError.Forbidden("You can only delete your own reviews.");

        await Db.DeleteByIdAsync<Review>(request.Id);
    }

    public async Task<GetReviewsResponse> Get(GetReviews request)
    {
        var q = Db.From<Review>();

        if (request.ProductId != null)
            q.Where(x => x.ProductId == request.ProductId);

        if (request.Rating != null)
            q.And(x => x.Rating == request.Rating); // ⭐️ Add this

        q.OrderByDescending((Review x) => x.CreatedAt); // ✅ Type-specified lambda

        var total = await Db.CountAsync(q);

        q.Limit((request.Page - 1) * request.PageSize, request.PageSize);

        var reviews = await Db.SelectAsync(q);

        var userIds = reviews.Select(x => x.UserId).Distinct().ToList();
        var users = await Db.SelectAsync(Db.From<CustomUser>().Where(x => Sql.In(x.Id, userIds)));

        var result = reviews.Select(r => new ReviewDto
        {
            Id = r.Id,
            ProductId = r.ProductId,
            UserId = r.UserId,
            UserEmail = users.FirstOrDefault(u => u.Id == r.UserId)?.Email ?? "Unknown",
            Rating = r.Rating,
            ReviewText = r.ReviewText,
            CreatedAt = r.CreatedAt
        }).ToList();

        return new GetReviewsResponse
        {
            Reviews = result,
            Total = (int)total
        };
    }


}
