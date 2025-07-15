using ServiceStack;
using ServiceStack.Auth;
using eproject3.ServiceModel.Types;

namespace eproject3.ServiceInterface;

public class ProfileService : Service
{
    private readonly IUserAuthRepository _authRepo;

    public ProfileService(IUserAuthRepository authRepo)
    {
        _authRepo = authRepo ?? throw new ArgumentNullException(nameof(authRepo));
    }

    public object Get(GetProfile request)
    {
        if (_authRepo == null)
            throw new Exception("authRepo is null - DI not working");
        var session = GetSession();
        if (session == null || string.IsNullOrEmpty(session.UserAuthId))
            throw HttpError.Unauthorized("You must be logged in.");

        var userAuth = _authRepo.GetUserAuth(session.UserAuthId);
        if (userAuth == null)
            throw HttpError.NotFound("User not found");

        return new UserProfileResponse
        {
            DisplayName = userAuth.DisplayName,
            Email = userAuth.Email,
            Address = userAuth.Address,
            Gender = userAuth.Gender,
            BirthDate = userAuth.BirthDate,
        };
    }

    public object Put(UpdateProfile request)
    {
        // Validate session
        var session = GetSession();
        if (session == null || string.IsNullOrEmpty(session.UserAuthId))
            throw HttpError.Unauthorized("Authentication required");

        // Validate request
        if (request == null)
            throw HttpError.BadRequest("Request cannot be empty");

        var userAuth = _authRepo.GetUserAuth(session.UserAuthId);
        if (userAuth == null)
            throw HttpError.NotFound("User not found");

        // Update only provided fields
        userAuth.PopulateWithNonDefaultValues(request);
        _authRepo.SaveUserAuth(userAuth);

        return new UserProfileResponse {
            DisplayName = userAuth.DisplayName,
            Email = userAuth.Email,
            Address = userAuth.Address,
            Gender = userAuth.Gender,
            BirthDate = userAuth.BirthDate
        };
    } 
    
    public object Post(ChangePassword request)
    {
        var session = GetSession();
        if (session == null || string.IsNullOrEmpty(session.UserAuthId))
            throw HttpError.Unauthorized("Authentication required");

        if (string.IsNullOrEmpty(request.OldPassword) || string.IsNullOrEmpty(request.NewPassword))
            throw HttpError.BadRequest("Old and new passwords are required");

        // Authenticate the user with old password
        if (!_authRepo.TryAuthenticate(session.UserAuthName, request.OldPassword, out var userAuth))
            throw HttpError.Unauthorized("Old password is incorrect");

        // Manually update the password (hashing required)
        var saltedHash = new SaltedHash();
        saltedHash.GetHashAndSaltString(request.NewPassword, out var hash, out var salt);

        userAuth.PasswordHash = hash;
        userAuth.Salt = salt;

        _authRepo.SaveUserAuth(userAuth);

        return new EmptyResponse();
    }

}



