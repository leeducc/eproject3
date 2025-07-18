using ServiceStack.DataAnnotations;

namespace eproject3.ServiceModel;

[Alias("product_genres")]
public class ProductGenre
{
    [PrimaryKey]
    [References(typeof(Product))]
    public int ProductId { get; set; }

    [PrimaryKey]
    [References(typeof(Genre))]
    public int GenreId { get; set; }
}