using backend.Enums;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string userId { get; set; }
        public string Name { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string HashPassword { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        [BsonRepresentation(BsonType.String)]
        public UserRole Role { get; set; } = UserRole.Customer;
        public string UserAvatar { get; set; }
        public DateTime BirthDate { get; set; }
        [BsonRepresentation(BsonType.String)]
        public EmailVerification EmailVerified { get; set; } = EmailVerification.Unverified;
        [BsonRepresentation(BsonType.String)]
        public UserStatus Status { get; set; } = UserStatus.Active;
    }
}
