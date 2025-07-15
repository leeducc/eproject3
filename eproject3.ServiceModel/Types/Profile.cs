using ServiceStack;

namespace eproject3.ServiceModel.Types;

[Route("/api/profile", "GET")]
public class GetProfile : IReturn<UserProfileResponse> {}

[Route("/api/profile", "PUT")]
public class UpdateProfile : IReturn<UserProfileResponse>
{
    public string? DisplayName { get; set; }
    public string? Address { get; set; }
    public string? Gender { get; set; }
    public DateTime? BirthDate { get; set; }
}
[Route("/api/profile/change-password", "POST")]
public class ChangePassword : IReturn<EmptyResponse>
{
    public string? OldPassword { get; set; }
    public string? NewPassword { get; set; }
}

public class UserProfileResponse
{
    public string? DisplayName { get; set; }
    public string? Email { get; set; }
    public string? Address { get; set; }
    public string? Gender { get; set; }
    public DateTime? BirthDate { get; set; }
    public ResponseStatus? ResponseStatus { get; set; }
}