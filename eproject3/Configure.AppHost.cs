using eproject3.ServiceInterface;
using ServiceStack.NativeTypes.TypeScript;

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
            });
        });

    // Configure your AppHost with the necessary configuration and dependencies your App needs
    public override void Configure()
    {
        TypeScriptGenerator.InsertTsNoCheck = true;

        SetConfig(new HostConfig {
        });
        
        Plugins.Add(new CorsFeature(
            allowOriginWhitelist: new[] {
                "https://localhost:5173" // <-- allow your React dev server origin
            },
            allowCredentials: true,
            allowedHeaders: "Content-Type,Authorization",
            allowedMethods: "GET, POST, PUT, DELETE, OPTIONS"
        ));
        
      
        
    }
    
    // TODO: Replace with your own License Key. FREE Individual or OSS License available from: https://servicestack.net/free
    public static void RegisterKey() =>
        Licensing.RegisterLicense("OSS BSD-3-Clause 2025 https://github.com/NetCoreTemplates/react-spa l43m13Wnf0ykDL2mbWR+Hbd9/KefnQrxo7Bo70P0kav0AynSYrweHG9a0W0AUas9XDxRJSo6M5wur/s9YMh4ShB1KnxRQZ5oKKhfcmoiEHXVRXT2qTnNsn27nd627hujDlgLvAea+IYbSGML9txdH59Y1cNbl5AjaQ8oSj+qt28=");
}
