using ServiceStack;
namespace eproject3.ServiceModel.Types;

[Route("/register", "POST")]
public class RegisterExtended : Register
{
    public DateTime? BirthDate { get; set; }
    public string? Address { get; set; }
    public string? Gender { get; set; }
    public string? PhoneNumber { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
}