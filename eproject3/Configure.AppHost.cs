using eproject3.ServiceInterface;
using ServiceStack.NativeTypes.TypeScript;
using ServiceStack.Auth;
using ServiceStack.OrmLite;
using eproject3.ServiceModel;
using ServiceStack.Data;
using ServiceStack.IO;
using ServiceStack.FluentValidation;
using ServiceStack.Text; 
[assembly: HostingStartup(typeof(eproject3.AppHost))]

namespace eproject3;

public class AppHost() : AppHostBase("eproject3"), IHostingStartup
{  

    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices((context, services) => {
            // Configure ASP.NET Core IOC Dependencies
            services.AddSingleton(new AppConfig {
                AppBaseUrl = context.HostingEnvironment.IsDevelopment()
                    ? "https://localhost:5173"  
                    : null,
                ApiBaseUrl = context.HostingEnvironment.IsDevelopment()
                    ? "https://localhost:5001"  
                    : null,
                AdminBaseUrl = context.HostingEnvironment.IsDevelopment()
                    ? "https://localhost:5174"  
                    : null,
            });
        });

    
    public override void Configure()
    {
        
        JsConfig.EmitCamelCaseNames = true;
        JsConfig.DateHandler = DateHandler.ISO8601;
        JsConfig.AssumeUtc   = true;
        TypeScriptGenerator.InsertTsNoCheck = true;

        SetConfig(new HostConfig {
            AllowSessionIdsInHttpParams = true, 
            UseSameSiteCookies = true,
            DebugMode = true
        });

        Plugins.Add(new CorsFeature(
            allowOriginWhitelist: new[] { 
                "https://localhost:5173"
            },
            allowCredentials: true,
            allowedHeaders: "Content-Type, Allow, Authorization",
            allowedMethods: "GET, POST, PUT, DELETE, OPTIONS"
        ));
        
        

        Plugins.Add(new ServerEventsFeature());
        
        var jwtKeyBase64 = AppSettings.GetString("jwt:authKey");
        var jwtKeyBytes = Convert.FromBase64String(jwtKeyBase64);

        Plugins.Add(new AuthFeature(() => new AuthUserSession(), new IAuthProvider[]
        {
            new CredentialsAuthProvider(),
            new GoogleAuthProvider(AppSettings),
            new FacebookAuthProvider(AppSettings),
            new JwtAuthProvider
            {
                AuthKey = jwtKeyBytes,
                RequireSecureConnection = false,
                ExpireTokensIn = TimeSpan.FromDays(7),
            }
        }));
        if (!Container.Exists<IDbConnectionFactory>())
        {
            var dbFactory = new OrmLiteConnectionFactory(
                AppSettings.GetString("ConnectionStrings:DefaultConnection"),
                MySqlDialect.Provider);
            Container.Register<IDbConnectionFactory>(dbFactory);
        }

        if (!Container.Exists<IUserAuthRepository>())
        {
            var authRepo = new OrmLiteAuthRepository<CustomUser, UserAuthDetails>(
                Container.Resolve<IDbConnectionFactory>())
            {
                UseDistinctRoleTables = false
            };
            authRepo.InitSchema();
            Container.Register<IAuthRepository>(authRepo);
            Container.Register<IUserAuthRepository>(authRepo);
        }
        // Load SMTP config from appsettings
        var smtpConfig = AppSettings.Get<SmtpConfig>("smtp");


        VirtualFiles = new FileSystemVirtualFiles("wwwroot");

        
    }
    
    
    // TODO: Replace with your own License Key. FREE Individual or OSS License available from: https://servicestack.net/free
    public static void RegisterKey() =>
        Licensing.RegisterLicense("OSS BSD-3-Clause 2025 https://github.com/NetCoreTemplates/react-spa l43m13Wnf0ykDL2mbWR+Hbd9/KefnQrxo7Bo70P0kav0AynSYrweHG9a0W0AUas9XDxRJSo6M5wur/s9YMh4ShB1KnxRQZ5oKKhfcmoiEHXVRXT2qTnNsn27nd627hujDlgLvAea+IYbSGML9txdH59Y1cNbl5AjaQ8oSj+qt28=");
}