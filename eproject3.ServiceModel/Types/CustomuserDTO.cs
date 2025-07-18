using ServiceStack;
using ServiceStack.Auth;

namespace eproject3.ServiceModel.Types;
// --------- AutoQuery CRUD DTOs ----------
[Route("/customusers", "GET")]
public class QueryCustomUsers 
    : QueryDb<CustomUser>, IReturn<QueryResponse<CustomUser>> 
{ }

[Route("/customusers", "POST")]
public class CreateCustomUser 
    : ICreateDb<CustomUser>, IReturn<CustomUser> 
{ }

[Route("/customusers/{Id}", "PUT")]
public class UpdateCustomUser 
    : IPatchDb<CustomUser>, IReturn<CustomUser> 
{
    public int Id { get; set; }
    // Only include fields you want to allow updating:
    public bool?   BanStatus     { get; set; }
    public string? DisplayName   { get; set; }
    public string? Email         { get; set; }
    // …etc…
}

// --------- Assign a Role ----------
[Route("/customuserroles", "POST")]
public class SaveUserAuthRole 
    : ICreateDb<UserAuthRole>, IReturn<SaveUserAuthRoleResponse>
{
    public int    UserAuthId { get; set; }
    public string Role       { get; set; }
}

public class SaveUserAuthRoleResponse
{
    public int? Id { get; set; }
}