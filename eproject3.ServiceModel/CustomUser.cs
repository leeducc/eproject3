using ServiceStack.Auth;

namespace eproject3.ServiceModel;

public class CustomUser : UserAuth
{
    public bool? EmailConfirmed { get; set; }
    public bool? BanStatus { get; set; }
    public new string? PhoneNumber { get; set; }
    public new string? City { get; set; }
    public new string? Country { get; set; }
    public new string? Address { get; set; }
    public new string? Gender { get; set; }
    public new DateTime? BirthDate { get; set; }
    public new string? FirstName { get; set; }
    public new string? LastName { get; set; }

}