
using System;
using ServiceStack.DataAnnotations;

namespace eproject3.ServiceModel.Types
{
    

    [Alias("CollectionItem")]
    public class CollectionItem
    {
        [AutoIncrement]
        public int Id { get; set; }

        public int CollectionId { get; set; }
        public int ProductId    { get; set; }
        public DateTime AddedAt { get; set; }
    }
}