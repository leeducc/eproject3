
using eproject3.ServiceModel;
using eproject3.ServiceModel.Types;
using ServiceStack;
using ServiceStack.Auth;
using ServiceStack.Text;
using ServiceStack.FluentValidation;

namespace eproject3.ServiceInterface;

public class RegisterExtendedValidator : AbstractValidator<RegisterExtended>
{
    public RegisterExtendedValidator()
    {
        RuleSet(ApplyTo.Post, () =>
        {
            RuleFor(x => x.Password).NotEmpty();

            RuleFor(x => x.ConfirmPassword)
                .Equal(x => x.Password)
                .When(x => !string.IsNullOrEmpty(x.ConfirmPassword))
                .WithErrorCode("PasswordsShouldMatch")
                .WithMessage("Passwords must match");

            RuleFor(x => x.UserName)
                .NotEmpty()
                .When(x => string.IsNullOrEmpty(x.Email));

            RuleFor(x => x.Email)
                .NotEmpty()
                .EmailAddress()
                .When(x => string.IsNullOrEmpty(x.UserName));

            RuleFor(x => x.UserName)
                .MustAsync(async (userName, cancellation) =>
                {
                    var userAuthRepo = HostContext.AppHost.TryResolve<IUserAuthRepository>();
                    if (userAuthRepo == null)
                        return true;

                    var existingUser = await Task.FromResult(userAuthRepo.GetUserAuthByUserName(userName));
                    return existingUser == null;
                })
                .WithErrorCode("AlreadyExists")
                .WithMessage("Username already exists")
                .When(x => !string.IsNullOrEmpty(x.UserName));

            RuleFor(x => x.Email)
                .MustAsync(async (email, cancellation) =>
                {
                    var userAuthRepo = HostContext.AppHost.TryResolve<IUserAuthRepository>();
                    if (userAuthRepo == null)
                        return true;

                    // Check if any user exists with this email or username == email
                    var existingByUserName = await Task.FromResult(userAuthRepo.GetUserAuthByUserName(email));
                    var existingByEmail = await Task.FromResult(userAuthRepo.GetUserAuthByUserName(email)); // Or create method GetUserAuthByEmail if you have one
                    return existingByUserName == null && existingByEmail == null;
                })
                .WithErrorCode("AlreadyExists")
                .WithMessage("Email already exists")
                .When(x => !string.IsNullOrEmpty(x.Email));

            RuleFor(x => x.BirthDate)
                .NotEmpty()
                .Must(birthDate => birthDate.HasValue && birthDate.Value.AddYears(15) <= DateTime.UtcNow)
                .WithMessage("You must be at least 15 years old");

            RuleFor(x => x.PhoneNumber)
                .NotEmpty()
                .Matches(@"^\d{10,13}$")
                .WithMessage("Phone number must be between 10 and 13 digits");

            RuleFor(x => x.Gender)
                .NotEmpty()
                .Must(g => g == "Male" || g == "Female" || g == "Other")
                .WithMessage("Gender must be Male, Female, or Other");

            RuleFor(x => x.Country).NotEmpty();
            RuleFor(x => x.City).NotEmpty();
            RuleFor(x => x.Address).NotEmpty();
        });
    }
}


public class RegisterService(IUserAuthRepository authRepo) : Service
{
    public async Task<object> Post(RegisterExtended request)
    {
        if (authRepo.GetUserAuthByUserName(request.Email) != null)
            throw HttpError.Conflict("Email already exists");

        var user = new CustomUser
        {
            UserName = request.UserName ?? request.Email,
            Email = request.Email,
            BirthDate = request.BirthDate,
            Address = request.Address,
            Gender = request.Gender,
            PhoneNumber = request.PhoneNumber,
            City = request.City,
            Country = request.Country,
            FirstName = request.FirstName,
            LastName = request.LastName,
            DisplayName = $"{request.FirstName} {request.LastName}".Trim()
        };

        var userId = authRepo.CreateUserAuth(user, request.Password);

        var createdUser = authRepo.GetUserAuth(userId.ToString());

        // ✅ Automatically assign the "User" role
        authRepo.AssignRoles(createdUser, roles: new[] { "User" });

        return new RegisterResponse
        {
            UserId = userId.ToString(),
            UserName = createdUser.UserName,
            ReferrerUrl = Request.GetParam("returnUrl") ?? "/",
        };
    }
}

