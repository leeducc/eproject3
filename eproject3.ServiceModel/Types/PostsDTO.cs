using System;
using System.Collections.Generic;
using ServiceStack;

namespace eproject3.ServiceModel
{
    [Route("/api/posts", "GET")]
    public class GetPosts : IReturn<GetPostsResponse>
    {
        public int? ChannelId { get; set; }
    }

    public class GetPostsResponse
    {
        public List<Post> Posts { get; set; }
    }

    [Route("/api/posts/{Id}", "GET")]
    public class GetPost : IReturn<Post>
    {
        public int Id { get; set; }
    }

    [Route("/api/posts", "POST")]
    public class CreatePost : IReturn<Post>
    {
        public int ChannelId { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
    }

    [Route("/api/posts/{Id}", "PUT")]
    public class UpdatePost : IReturn<Post>
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
    }

    [Route("/api/posts/{Id}", "DELETE")]
    public class DeletePost : IReturnVoid
    {
        public int Id { get; set; }
    }
}