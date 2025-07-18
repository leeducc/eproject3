using ServiceStack;

namespace eproject3.ServiceModel.Types;


[Route("/api/channels", "GET")]
public class GetChannels : IReturn<GetChannelsResponse> {}

public class GetChannelsResponse
{
    public List<Channel> Channels { get; set; }
}

[Route("/api/channels/{Id}", "GET")]
public class GetChannel : IReturn<Channel>
{
    public int Id { get; set; }
}

[Route("/api/channels", "POST")]
public class CreateChannel : IReturn<Channel>
{
    public string Name { get; set; }
    public string Description { get; set; }
}

[Route("/api/channels/{Id}", "PUT")]
public class UpdateChannel : IReturn<Channel>
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
}

[Route("/api/channels/{Id}", "DELETE")]
public class DeleteChannel : IReturnVoid
{
    public int Id { get; set; }
}