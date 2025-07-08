namespace eproject3.Migrations;

// Migrations/Migration1004_AddHeroAndTrailer.cs
using ServiceStack.DataAnnotations;
using ServiceStack.OrmLite;
using ServiceStack;


[Description("Add heroSection and youtubeTrailerLink columns to Product table")]
public class Migration1004 : MigrationBase
{
    [Alias("products")]
    public class Product
    {
        [Default(0)]             // ← added
        public bool HeroSection { get; set; } // added
        [Default("https://youtu.be/yh5bKLle5lE?si=Jzz9552bJA5CIFhm")]
        public string YoutubeTrailerLink { get; set; } // added
    }

    public override void Up()
    {
        Db.AddColumn<Product>(x => x.HeroSection); // added
        Db.AddColumn<Product>(x => x.YoutubeTrailerLink); // added
    }

    public override void Down()
    {
        Db.DropColumn<Product>(x => x.HeroSection); // added
        Db.DropColumn<Product>(x => x.YoutubeTrailerLink); // added
    }
}
