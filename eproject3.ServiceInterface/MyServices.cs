using ServiceStack;
using eproject3.ServiceModel;
using ServiceStack.OrmLite;

namespace eproject3.ServiceInterface;

public class MyServices : Service
{
    public object Any(Hello request)
    {
        return new HelloResponse { Result = $"Hello, {request.Name}!" };
    }
    
   
    
}
