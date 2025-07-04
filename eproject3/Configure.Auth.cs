using ServiceStack.Auth;
using eproject3.Data;
using ServiceStack.Html;

[assembly: HostingStartup(typeof(eproject3.ConfigureAuth))]

namespace eproject3;

public class ConfigureAuth : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices(services =>
        {
            services.AddPlugin(new AuthFeature(IdentityAuth.For<ApplicationUser>(options => {
                options.SessionFactory = () => new CustomUserSession();
                options.CredentialsAuth();
                options.AdminUsersFeature(feature =>
                {
                    feature.QueryIdentityUserProperties =
                    [
                        nameof(ApplicationUser.Id),
                        nameof(ApplicationUser.DisplayName),
                        nameof(ApplicationUser.Email),
                        nameof(ApplicationUser.UserName),
                        nameof(ApplicationUser.LockoutEnd),
                    ];
                    feature.DefaultOrderBy = nameof(ApplicationUser.DisplayName);
                    feature.SearchUsersFilter = (q, query) =>
                    {
                        var queryUpper = query.ToUpper();
                        return q.Where(x =>
                            x.DisplayName!.Contains(query) ||
                            x.Id.Contains(queryUpper) ||
                            x.NormalizedUserName!.Contains(queryUpper) ||
                            x.NormalizedEmail!.Contains(queryUpper));
                    };
                    feature.CreateUser = () => new ApplicationUser { EmailConfirmed = true };
                    feature.CreateUserValidation = async (req, createUser) =>
                    {
                        await IdentityAdminUsers.ValidateCreateUserAsync(req, createUser);
                        var displayName = createUser.GetUserProperty(nameof(ApplicationUser.DisplayName));
                        if (string.IsNullOrEmpty(displayName))
                            throw new ArgumentNullException(nameof(AdminUserBase.DisplayName));
                        return null;
                    };
                    feature.ResolveLockoutDate = user => DateTimeOffset.Now.AddDays(7);
                    feature.FormLayout =
                    [
                        Input.For<ApplicationUser>(x => x.UserName, c => c.FieldsPerRow(2)),
                        Input.For<ApplicationUser>(x => x.Email, c => { 
                            c.Type = Input.Types.Email;
                            c.FieldsPerRow(2); 
                        }),
                        Input.For<ApplicationUser>(x => x.FirstName, c => c.FieldsPerRow(2)),
                        Input.For<ApplicationUser>(x => x.LastName, c => c.FieldsPerRow(2)),
                        Input.For<ApplicationUser>(x => x.DisplayName, c => c.FieldsPerRow(2)),
                        Input.For<ApplicationUser>(x => x.PhoneNumber, c =>
                        {
                            c.Type = Input.Types.Tel;
                            c.FieldsPerRow(2); 
                        }),
                    ];
                });
            })));
        });
}
