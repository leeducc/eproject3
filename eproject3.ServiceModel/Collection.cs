// in eproject3.ServiceModel.Types

using System;
using ServiceStack.DataAnnotations;

namespace eproject3.ServiceModel.Types
{
    [Alias("Collections")]
    public class Collection
    {
        [AutoIncrement]
        public int Id { get; set; }

        public int UserId { get; set; }

        [StringLength(100)]
        public string Name { get; set; }

        public DateTime CreatedAt { get; set; }
    }

    
}