namespace eproject3.ServiceModel;

using ServiceStack.DataAnnotations;

[Alias("newstags")]
public class NewsTags
{
    [PrimaryKey]
    public int NewsId { get; set; }

    [PrimaryKey]
    public int TagId { get; set; }
}
