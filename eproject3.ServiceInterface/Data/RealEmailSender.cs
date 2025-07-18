using ServiceStack;
using ServiceStack.Auth;
using ServiceStack.Jobs;
using Microsoft.Extensions.Logging;



namespace eproject3.ServiceInterface;

/// <summary>
/// Sends real user emails using SMTP and background jobs
/// </summary>
public class RealEmailSender(
    IBackgroundJobs backgroundJobs,
    ILogger<RealEmailSender> logger,
    SmtpConfig config) : ICustomEmailSender
{
    public Task SendConfirmationLinkAsync(UserAuth user, string confirmationLink)
    {
        var subject = "Confirm your email";
        var htmlBody = $"Please confirm your account by <a href='{confirmationLink}'>clicking here</a>.";
        return SendAsync(user.Email, user.DisplayName ?? user.UserName, subject, htmlBody);
    }

    public Task SendPasswordResetLinkAsync(UserAuth user, string resetLink)
    {
        var subject = "Reset your password";
        var htmlBody = $"Please reset your password by <a href='{resetLink}'>clicking here</a>.";
        return SendAsync(user.Email, user.DisplayName ?? user.UserName, subject, htmlBody);
    }

    public Task SendPasswordResetCodeAsync(UserAuth user, string resetCode)
    {
        var subject = "Reset your password";
        var body = $"Please use the following code to reset your password: {resetCode}";
        return SendAsync(user.Email, user.DisplayName ?? user.UserName, subject, body);
    }

    private Task SendAsync(string? toEmail, string? toName, string subject, string bodyHtml)
    {
        if (string.IsNullOrWhiteSpace(toEmail))
        {
            logger.LogWarning("Email not sent. User email is missing.");
            return Task.CompletedTask;
        }

        var email = new SendEmail
        {
            To = toEmail,
            ToName = toName,
            Subject = subject,
            BodyHtml = bodyHtml
        };

        backgroundJobs.EnqueueApi(new SendEmail {
            To = toEmail,
            ToName = toName,
            Subject = subject,
            BodyHtml = bodyHtml
        });

        logger.LogInformation("Queued email to {Email}: {Subject}", toEmail, subject);
        return Task.CompletedTask;
    }
}