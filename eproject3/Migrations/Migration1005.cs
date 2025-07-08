using ServiceStack;
using ServiceStack.DataAnnotations;
using ServiceStack.OrmLite;

namespace eproject3.Migrations;

public class Migration1005 : MigrationBase
{
    // Just for FK reference, NOT for table creation
    [Alias("products")]
    public class ProductRef
    {
        public int Id { get; set; }
    }

    [Alias("aspnetusers")]
    public class ApplicationUserRef
    {
        public string Id { get; set; }
    }

    [Alias("reviews")]
    public class Review
    {
        [AutoIncrement]
        public int Id { get; set; }

        [References(typeof(ProductRef))]
        public int ProductId { get; set; }

        [References(typeof(ApplicationUserRef))]
        public string UserId { get; set; }

        [Required]
        public int Rating { get; set; }

        public string Comment { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public override void Up()
    {
        // Only create the new "reviews" table
        Db.CreateTable<Review>();

        // Seed test reviews (ensure these product/user IDs exist)
        var reviews = new List<Review>
        {
            new() { ProductId = 1, UserId = "089d31c1-9f2f-4195-849f-8b0031794532", Rating = 5, Comment = "Amazing product!" },
            new() { ProductId = 1, UserId = "97b1c7a4-4c74-4ba6-9a34-064f0b4aba09", Rating = 4, Comment = "Very good, I love it." },
            new() { ProductId = 2, UserId = "98a9fa28-2480-4d41-84db-84e402a4e24c", Rating = 3, Comment = "Not bad, could be better." },
            new() { ProductId = 3, UserId = "089d31c1-9f2f-4195-849f-8b0031794532", Rating = 5, Comment = "Perfect gift for a friend." },
        };

        Db.InsertAll(reviews);
    }

    public override void Down()
    {
        Db.DropTable<Review>();
    }
}
