// eproject3.ServiceModel/Types/CollectionsDtos.cs
using ServiceStack;
using System.Collections.Generic;

namespace eproject3.ServiceModel.Types
{
    // Create a new collection
    [Authenticate]
    [Route("/api/collections", "POST")]
    public class CreateCollection : IReturn<CollectionDto>
    {
        public string Name { get; set; }
    }

    // List (and filter) collections
    [Authenticate]
    [Route("/api/collections", "GET")]
    public class GetCollections : IReturn<GetCollectionsResponse>
    {
        public string? SearchTerm { get; set; }
        public string? Prefix     { get; set; }
    }

    public class GetCollectionsResponse
    {
        public List<CollectionDto> Collections { get; set; }
    }

    // Rename a collection
    [Authenticate]
    [Route("/api/collections/{Id}", "PUT")]
    public class UpdateCollection : IReturn<CollectionDto>
    {
        public int    Id   { get; set; }
        public string Name { get; set; }
    }

    // Delete a collection
    [Authenticate]
    [Route("/api/collections/{Id}", "DELETE")]
    public class DeleteCollection : IReturnVoid
    {
        public int Id { get; set; }
    }

    // Add an item to a collection
    [Authenticate]
    [Route("/api/collections/{Name}/items", "POST")]
    public class AddToCollection : IReturnVoid
    {
        public string Name      { get; set; }
        public int    ProductId { get; set; }
    }

    // Remove an item from a collection
    [Authenticate]
    [Route("/api/collections/{Name}/items/{ProductId}", "DELETE")]
    public class RemoveFromCollection : IReturnVoid
    {
        public string Name      { get; set; }
        public int    ProductId { get; set; }
    }

    // List items in a collection
    [Authenticate]
    [Route("/api/collections/{Name}/items", "GET")]
    public class GetCollectionItems : IReturn<GetCollectionItemsResponse>
    {
        public string Name { get; set; }
    }

    public class GetCollectionItemsResponse
    {
        public List<CollectionItemDto> Items { get; set; }
    }

    // Shared DTOs
    public class CollectionDto
    {
        public int    Id   { get; set; }
        public string Name { get; set; }
    }

    public class CollectionItemDto
    {
        public int      ProductId { get; set; }
        public string   Title     { get; set; }
        public string   Image     { get; set; }
        public decimal  Price     { get; set; }
        public DateTime AddedAt   { get; set; }
    }
}