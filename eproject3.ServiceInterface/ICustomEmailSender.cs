using ServiceStack.Auth;

namespace eproject3.ServiceInterface;

/// <summary>
/// Interface for sending user-related emails (confirmations, password resets, etc.)
/// </summary>
public interface ICustomEmailSender
{
    Task SendConfirmationLinkAsync(UserAuth user, string confirmationLink);
    Task SendPasswordResetLinkAsync(UserAuth user, string resetLink);
    Task SendPasswordResetCodeAsync(UserAuth user, string resetCode);
}