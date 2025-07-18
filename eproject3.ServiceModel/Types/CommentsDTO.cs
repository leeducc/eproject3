// ServiceModel/CommentDtos.cs
using System;
using System.Collections.Generic;
using ServiceStack;

namespace eproject3.ServiceModel
{
    [Route("/api/comments", "GET")]
    public class GetComments : IReturn<GetCommentsResponse>
    {
        public int PostId { get; set; }
    }
    
    public class GetCommentsResponse
    {
        public List<Comment> Comments { get; set; }
    }

    [Route("/api/comments/{Id}", "GET")]
    public class GetComment : IReturn<Comment>
    {
        public int Id { get; set; }
    }
  

    [Route("/api/comments", "POST")]
    public class CreateComment : IReturn<Comment>
    {
        public int PostId { get; set; }
        public int? ParentCommentId { get; set; }  // allow replies
        public string Content { get; set; }
    }

    [Route("/api/comments/{Id}", "PUT")]
    public class UpdateComment : IReturn<Comment>
    {
        public int Id { get; set; }
        public string Content { get; set; }
    }

    [Route("/api/comments/{Id}", "DELETE")]
    public class DeleteComment : IReturnVoid
    {
        public int Id { get; set; }
    }

    
}