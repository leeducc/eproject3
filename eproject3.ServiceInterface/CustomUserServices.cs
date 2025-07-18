using System;
using System.Linq;
using ServiceStack;
using ServiceStack.OrmLite;
using ServiceStack.Auth;              // ← for RoleNames
using eproject3.ServiceModel.Types;
using eproject3.ServiceModel;

namespace eproject3.ServiceInterface
{
    public class CustomUserServices : Service
    {
        public IAutoQueryDb AutoQuery { get; set; }

        // GET /customusers
        public object Any(QueryCustomUsers req)
        {
            // Build the SQL expression for CustomUser
            var q = AutoQuery.CreateQuery(req, Request);
            // Execute with the expr overload, not the IRequest overload
            return AutoQuery.Execute(req, q);
        }

        // POST /customusers
        public object Post(CreateCustomUser req)
        {
            var user = req.ConvertTo<CustomUser>();
            user.CreatedDate          = user.ModifiedDate = DateTime.UtcNow;
            user.InvalidLoginAttempts = 0;
            Db.Save(user);
            return user;
        }

        // PUT /customusers/{Id}
        public object Put(UpdateCustomUser req)
        {
            var user = Db.SingleById<CustomUser>(req.Id)
                       ?? throw HttpError.NotFound($"User {req.Id} not found");

            // Load roles from the userauthrole table
            var roleExpr = Db.From<UserAuthRole>()
                             .Where(x => x.UserAuthId == req.Id)
                             .Select(x => x.Role);
            var roles = Db.Column<string>(roleExpr);

         
            if (roles.Count == 0 || (roles.Count == 1 && roles[0] == "User"))
            {
                throw HttpError.Forbidden("Cannot edit basic User account");
            }

            // Only copy non-default fields
            req.PopulateWithNonDefaultValues(user);
            user.ModifiedDate = DateTime.UtcNow;
            Db.Update(user);
            return user;
        }

        // POST /customuserroles
        public object Post(SaveUserAuthRole req)
        {
            var role = req.ConvertTo<UserAuthRole>();
            role.CreatedDate  = role.ModifiedDate = DateTime.UtcNow;
            Db.Save(role);
            return new SaveUserAuthRoleResponse { Id = role.Id };
        }
    }
}
