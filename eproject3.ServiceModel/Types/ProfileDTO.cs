using ServiceStack.DataAnnotations;
using ServiceStack;
using ServiceStack.FluentValidation;

namespace eproject3.ServiceModel.Types
{
    // --------- Profile DTOs ---------

    [Route("/api/profile", "GET")]
    public class GetProfile : IReturn<UserProfileResponse> { }
    [Route("/api/profile", "PUT")]
    public class UpdateProfile : IReturn<UserProfileResponse>
    {
        public string DisplayName { get; set; }
       
        public string Address { get; set; }
       
        public string Gender { get; set; }
        public DateTime? BirthDate { get; set; }
        public string Email        { get; set; }   // ← added
        public string PhoneNumber  { get; set; } 
    }

    [Route("/api/profile/image", "POST")]
   
    public class UploadProfileImage : IReturn<UserProfileResponse>
    {
        // This acts as a placeholder so that ServiceStack will validate presence of the multipart body.
        // The actual file is read from IRequest.Files in the service.
      
        public bool Dummy { get; set; }
    }

    [Route("/api/profile/change-password", "POST")]
    public class ChangePassword : IReturn<EmptyResponse>
    {
        public string OldPassword { get; set; }

        public string NewPassword { get; set; }
    }

    // --------- Response DTO ---------

    public class UserProfileResponse
    {
        public string DisplayName     { get; set; }
        public string Email           { get; set; }    // ← ensure this exists
        public string PhoneNumber     { get; set; }    // ← add this
        public string Address         { get; set; }
        public string Gender          { get; set; }
        public DateTime? BirthDate    { get; set; }
        public string ProfileImageUrl { get; set; }    // ← add this
        public ResponseStatus ResponseStatus { get; set; }
    }

    
    
}
