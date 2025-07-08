using ServiceStack;
using ServiceStack.OrmLite;
using ServiceStack.OrmLite.Legacy;
using eproject3.ServiceModel;
using eproject3.ServiceModel.Types;
using eproject3.Data;

namespace eproject3.ServiceInterface;

public class ReviewServices : Service
{
    public async Task<object> Get(GetReviews request)
    {
        var q = Db.From<Review>()
            .Where(x => x.ProductId == request.ProductId)
            .Join<Review, ApplicationUser>((r, u) => r.UserId == u.Id)
            .Select<Review, ApplicationUser>((r, u) => new {
                r.Id,
                r.Comment,
                r.Rating,
                r.CreatedAt,
                UserEmail = u.Email
            })
            .Limit((request.Page - 1) * request.PageSize, request.PageSize);

        var results = await Db.SelectAsync<ReviewDto>(q);
        var total = await Db.ScalarAsync<int>(Db.From<Review>().Where(x => x.ProductId == request.ProductId).Select(x => Sql.Count("*")));

        return new GetReviewsResponse { Reviews = results, Total = total };
    }

    public async Task<ReviewDto> Post(CreateReview request)
    {
        var session = await GetSessionAsync();
        if (!session.IsAuthenticated)
            throw HttpError.Unauthorized("Login required");

        // 🚫 Check if user has already reviewed this product
        var existing = await Db.SingleAsync<Review>(x =>
            x.ProductId == request.ProductId && x.UserId == session.UserAuthId);

        if (existing != null)
            throw HttpError.Conflict("You have already reviewed this product.");

        var review = new Review
        {
            ProductId = request.ProductId,
            UserId = session.UserAuthId,
            Rating = request.Rating,
            Comment = request.Comment,
            CreatedAt = DateTime.UtcNow
        };

        review.Id = (int)(await Db.InsertAsync(review, selectIdentity: true));
        var user = await Db.SingleByIdAsync<ApplicationUser>(review.UserId);

        return new ReviewDto
        {
            Id = review.Id,
            ProductId = review.ProductId,
            UserId = review.UserId,
            Rating = review.Rating,
            Comment = review.Comment,
            CreatedAt = review.CreatedAt,
            UserEmail = user?.Email
        };
    }


    public async Task<ReviewDto> Put(UpdateReview request)
    {
        var session = await GetSessionAsync();
        if (!session.IsAuthenticated)
            throw HttpError.Unauthorized("Login required");

        var existing = await Db.SingleByIdAsync<Review>(request.Id);
        if (existing == null)
            throw HttpError.NotFound("Review not found");

        if (existing.UserId != session.UserAuthId)
            throw HttpError.Forbidden("You can only edit your own review");

        existing.Rating = request.Rating;
        existing.Comment = request.Comment;

        await Db.UpdateAsync(existing);

        var user = await Db.SingleByIdAsync<ApplicationUser>(existing.UserId);

        return new ReviewDto
        {
            Id = existing.Id,
            ProductId = existing.ProductId,
            UserId = existing.UserId,
            Rating = existing.Rating,
            Comment = existing.Comment,
            CreatedAt = existing.CreatedAt,
            UserEmail = user?.Email
        };
    }

    public async Task Delete(DeleteReview request)
    {
        var session = await GetSessionAsync();
        if (!session.IsAuthenticated)
            throw HttpError.Unauthorized("Login required");

        var existing = await Db.SingleByIdAsync<Review>(request.Id);
        if (existing == null)
            throw HttpError.NotFound("Review not found");

        if (existing.UserId != session.UserAuthId)
            throw HttpError.Forbidden("You can only delete your own review");

        await Db.DeleteByIdAsync<Review>(request.Id);
    }
}
