using Microsoft.AspNetCore.Identity;
using ServiceStack.DataAnnotations;

namespace eproject3.Data;

[Alias("aspnetusers")]
public class ApplicationUser : IdentityUser
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? DisplayName { get; set; }
    public string? ProfileUrl { get; set; }
    
    public string? Address { get; set; }
    public string? Gender { get; set; } // Consider enum later
    public DateTime? BirthDate { get; set; }
}
