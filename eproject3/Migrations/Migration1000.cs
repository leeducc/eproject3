using System.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using eproject3.Data;
using ServiceStack;
using ServiceStack.Auth;
using ServiceStack.DataAnnotations;
using ServiceStack.OrmLite;

namespace eproject3.Migrations;

public class Migration1000 : MigrationBase
{
    // Declare schema (do NOT reuse App DTOs)
    public class Product
    {
        [AutoIncrement]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string Artist { get; set; }

        public string Image { get; set; }

        [Required]
        public decimal Price { get; set; }

        [Required]
        public string Category { get; set; }
    }

    public override void Up()
    {
        Db.CreateTable<Product>();

        var seedProducts = new List<Product>
        {
            new() { Title = "Dreammee", Artist = "Soobin Hoàng Sơn", Image = "/img/album.jpg", Price = 1200000, Category = "Vinyl" },
            new() { Title = "Bình Yên", Artist = "Đen Vâu", Image = "/img/album.jpg", Price = 1050000, Category = "Vinyl" },
            new() { Title = "Radio", Artist = "Hòa Minzy", Image = "/img/album.jpg", Price = 800000, Category = "CD" },
            new() { Title = "Something Beautiful", Artist = "Ngọt", Image = "/img/album.jpg", Price = 1000000, Category = "Vinyl" },
            new() { Title = "Close To What", Artist = "Tate McRae", Image = "/img/album.jpg", Price = 980000, Category = "Vinyl" },
            new() { Title = "Angel Music Baby", Artist = "Gwen Stefani", Image = "/img/album.jpg", Price = 1350000, Category = "Vinyl" },
            new() { Title = "American Idiot", Artist = "Green Day", Image = "/img/album.jpg", Price = 3200000, Category = "Vinyl" },
            new() { Title = "Blue Album", Artist = "Weezer", Image = "/img/album.jpg", Price = 1100000, Category = "category1" },
            new() { Title = "1989", Artist = "Taylor Swift", Image = "/img/album.jpg", Price = 1300000, Category = "category1" },
            new() { Title = "30", Artist = "Adele", Image = "/img/album.jpg", Price = 1200000, Category = "Vinyl" },
            new() { Title = "Parachutes", Artist = "Coldplay", Image = "/img/album.jpg", Price = 1150000, Category = "CD" },
            new() { Title = "Divide", Artist = "Ed Sheeran", Image = "/img/album.jpg", Price = 1100000, Category = "CD" },
            new() { Title = "Fine Line", Artist = "Harry Styles", Image = "/img/album.jpg", Price = 1250000, Category = "Vinyl" },
            new() { Title = "Positions", Artist = "Ariana Grande", Image = "/img/album.jpg", Price = 1300000, Category = "CD" },
            new() { Title = "Happier Than Ever", Artist = "Billie Eilish", Image = "/img/album.jpg", Price = 1350000, Category = "Vinyl" },
            new() { Title = "24K Magic", Artist = "Bruno Mars", Image = "/img/album.jpg", Price = 1200000, Category = "Vinyl" },
            new() { Title = "After Hours", Artist = "The Weeknd", Image = "/img/album.jpg", Price = 1300000, Category = "Vinyl" },
            new() { Title = "Random Access Memories", Artist = "Daft Punk", Image = "/img/album.jpg", Price = 1400000, Category = "CD" },
            new() { Title = "Hybrid Theory", Artist = "Linkin Park", Image = "/img/album.jpg", Price = 1150000, Category = "category1" },
            new() { Title = "Songs About Jane", Artist = "Maroon 5", Image = "/img/album.jpg", Price = 1100000, Category = "category1" },
        };

        Db.InsertAll(seedProducts);
    }

    public override void Down()
    {
        Db.DropTable<Product>();
    }
}
