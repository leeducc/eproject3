using System;
using System.IO;
using System.Linq;
using ServiceStack;
using ServiceStack.Auth;
using eproject3.ServiceModel;
using eproject3.ServiceModel.Types;
using ServiceStack.FluentValidation;

namespace eproject3.ServiceInterface
{
    public class UpdateProfileValidator : AbstractValidator<UpdateProfile>
    {
        public UpdateProfileValidator()
        {
            RuleSet(ApplyTo.Put, () =>
            {
                RuleFor(x => x)
                    .Must(x =>
                        !string.IsNullOrWhiteSpace(x.DisplayName) ||
                        !string.IsNullOrWhiteSpace(x.Address)     ||
                        !string.IsNullOrWhiteSpace(x.Gender)      ||
                        x.BirthDate.HasValue                     ||
                        !string.IsNullOrWhiteSpace(x.Email)       ||
                        !string.IsNullOrWhiteSpace(x.PhoneNumber) )
                    .WithMessage("You must supply at least one profile field to update.");

                When(x => !string.IsNullOrWhiteSpace(x.Email), () =>
                    RuleFor(x => x.Email)
                        .EmailAddress()
                        .WithMessage("Invalid email address."));

                When(x => !string.IsNullOrWhiteSpace(x.PhoneNumber), () =>
                    RuleFor(x => x.PhoneNumber)
                        .Matches(@"^\d{10,13}$")
                        .WithMessage("Phone number must be between 10 and 13 digits."));

                When(x => !string.IsNullOrWhiteSpace(x.Gender), () =>
                    RuleFor(x => x.Gender)
                        .Must(g => g == "Male" || g == "Female" || g == "Other")
                        .WithMessage("Gender must be Male, Female, or Other."));

                When(x => x.BirthDate.HasValue, () =>
                    RuleFor(x => x.BirthDate.Value)
                        .Must(d => d.AddYears(15) <= DateTime.UtcNow)
                        .WithMessage("You must be at least 15 years old."));
            });
        }
    }
    public class ProfileService : Service
    {
        private readonly IUserAuthRepository _authRepo;

        public ProfileService(IUserAuthRepository authRepo)
        {
            _authRepo = authRepo;
        }

        // GET /api/profile
        public object Get(GetProfile request)
        {
            var session = GetSession();
            if (session?.UserAuthId == null)
                throw HttpError.Unauthorized("Authentication required");

            var user = _authRepo.GetUserAuth(session.UserAuthId) as CustomUser
                       ?? throw HttpError.NotFound("User not found");

            return new UserProfileResponse
            {
                DisplayName     = user.DisplayName,
                Email           = user.Email,
                PhoneNumber     = user.PhoneNumber,
                Address         = user.Address,
                Gender          = user.Gender,
                BirthDate       = user.BirthDate,
                ProfileImageUrl = user.ProfileImageUrl,
                ResponseStatus  = new ResponseStatus(),
            };
        }

        // PUT /api/profile
        public object Put(UpdateProfile request)
        {
            var session = GetSession();
            if (session?.UserAuthId == null)
                throw HttpError.Unauthorized("Authentication required");

            var user = _authRepo.GetUserAuth(session.UserAuthId) as CustomUser
                       ?? throw HttpError.NotFound("User not found");

            // Apply only provided fields
            user.PopulateWithNonDefaultValues(request);
            _authRepo.SaveUserAuth(user);

            return new UserProfileResponse
            {
                DisplayName     = user.DisplayName,
                Email           = user.Email,
                PhoneNumber     = user.PhoneNumber,
                Address         = user.Address,
                Gender          = user.Gender,
                BirthDate       = user.BirthDate,
                ProfileImageUrl = user.ProfileImageUrl,
                ResponseStatus  = new ResponseStatus(),
            };
        }

        // POST /api/profile/image
        public object Post(UploadProfileImage request)
        {
            var session = GetSession();
            if (session?.UserAuthId == null)
                throw HttpError.Unauthorized("Authentication required");

            var file = Request.Files.FirstOrDefault()
                       ?? throw HttpError.BadRequest("No file uploaded");

            // Get physical wwwroot path
            var webRoot = HostContext.Config.WebHostPhysicalPath
                       ?? throw new InvalidOperationException("WebHostPhysicalPath is not configured");

            // Ensure directory exists
            var profileDir = Path.Combine(webRoot, "images", "profile");
            Directory.CreateDirectory(profileDir);

            // Build filename
            var ext      = Path.GetExtension(file.FileName);
            var fileName = $"{session.UserAuthId}{ext}";
            var relPath  = Path.Combine("images", "profile", fileName).Replace("\\", "/");

            // Read bytes
            byte[] bytes;
            using (var ms = new MemoryStream())
            {
                file.WriteTo(ms);
                bytes = ms.ToArray();
            }

            // Write via VirtualFiles
            VirtualFiles.WriteFile(relPath, bytes);

            // Update user record
            var user = _authRepo.GetUserAuth(session.UserAuthId) as CustomUser
                       ?? throw HttpError.NotFound("User not found");

            user.ProfileImageUrl = "/" + relPath;
            _authRepo.SaveUserAuth(user);

            return new UserProfileResponse
            {
                DisplayName     = user.DisplayName,
                Email           = user.Email,
                PhoneNumber     = user.PhoneNumber,
                Address         = user.Address,
                Gender          = user.Gender,
                BirthDate       = user.BirthDate,
                ProfileImageUrl = user.ProfileImageUrl,
                ResponseStatus  = new ResponseStatus(),
            };
        }

        // POST /api/profile/change-password
        public object Post(ChangePassword request)
        {
            var session = GetSession();
            if (session?.UserAuthId == null)
                throw HttpError.Unauthorized("Authentication required");

            if (string.IsNullOrEmpty(request.OldPassword) || string.IsNullOrEmpty(request.NewPassword))
                throw HttpError.BadRequest("Old and new passwords are required");

            if (!_authRepo.TryAuthenticate(session.UserAuthName, request.OldPassword, out var authUser))
                throw HttpError.Unauthorized("Old password is incorrect");

            var user = authUser as CustomUser
                       ?? throw HttpError.NotFound("User not found");

            var saltedHash = new SaltedHash();
            saltedHash.GetHashAndSaltString(request.NewPassword, out var hash, out var salt);

            user.PasswordHash = hash;
            user.Salt         = salt;
            _authRepo.SaveUserAuth(user);

            return new EmptyResponse();
        }
    }
}