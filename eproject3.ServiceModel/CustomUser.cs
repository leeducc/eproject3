using System;
using ServiceStack.Auth;
using ServiceStack.DataAnnotations;

namespace eproject3.ServiceModel
{
    [Alias("customuser")]
    public class CustomUser : UserAuth
    {
        // Existing overrides/additions
        public bool? EmailConfirmed { get; set; }
        public bool? BanStatus      { get; set; }
        public new string? PhoneNumber { get; set; }
        public new string? City        { get; set; }
        public new string? Country     { get; set; }
        public new string? Address     { get; set; }
        public new string? Gender      { get; set; }
        public new DateTime? BirthDate { get; set; }
        public new string? FirstName   { get; set; }
        public new string? LastName    { get; set; }

        
        public string? ProfileImageUrl  { get; set; }
    }
}