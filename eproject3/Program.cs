using Microsoft.AspNetCore.Authentication;
using ServiceStack.Auth;
using ServiceStack.OrmLite;
using ServiceStack.Data;
using eproject3.Data;
using eproject3.ServiceInterface;
using eproject3.ServiceModel;
using System.IO;

AppHost.RegisterKey();

var builder = WebApplication.CreateBuilder(args);
var services = builder.Services;

// Use your MySQL connection string here
var dbConnectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Setup OrmLite connection factory for MySQL
var dbFactory = new OrmLiteConnectionFactory(
    dbConnectionString,
    MySqlDialect.Provider);

// Setup OrmLite Auth repository with your CustomUser and UserAuthDetails
var authRepo = new OrmLiteAuthRepository<CustomUser, UserAuthDetails>(dbFactory)
{
    UseDistinctRoleTables = true
};
authRepo.InitSchema();

// Register OrmLite connection factory and Auth repository in DI container
services.AddSingleton<IDbConnectionFactory>(dbFactory);
services.AddSingleton<IAuthRepository>(authRepo);
services.AddSingleton<IUserAuthRepository>(authRepo);


// Configure CORS if needed
services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("https://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Register ServiceStack services
services.AddServiceStack(typeof(MyServices).Assembly);


var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();

    // Serve static img files from client during dev
    app.MapGet("/img/{**path}", async (string path, HttpContext ctx) =>
    {
        var file = Path.GetFullPath($"{app.Environment.ContentRootPath}/../eproject3.Client/public/img/{path}");
        if (File.Exists(file))
        {
            ctx.Response.ContentType = MimeTypes.GetMimeType(path);
            await ctx.Response.SendFileAsync(file);
        }
        else
        {
            ctx.Response.StatusCode = 404;
        }
    });
}
else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");



app.UseServiceStack(new AppHost());


app.MapFallbackToFile("/index.html");

app.Run();
