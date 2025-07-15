using ServiceStack.Auth;
using eproject3.Data;
using ServiceStack.Data;
using eproject3.ServiceModel;

[assembly: HostingStartup(typeof(eproject3.ConfigureAuth))]

namespace eproject3;

public class ConfigureAuth : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices(services =>
        {
            
        });
}
