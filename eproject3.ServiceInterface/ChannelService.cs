using System;
using System.Linq;
using System.Threading.Tasks;
using ServiceStack;
using ServiceStack.OrmLite;
using eproject3.ServiceModel;
using eproject3.ServiceModel.Types; 

namespace eproject3.ServiceInterface
{
    public class ChannelService : Service
    {
        public async Task<GetChannelsResponse> Get(GetChannels request)
        {
            var channels = await Db.SelectAsync<Channel>();
            return new GetChannelsResponse { Channels = channels };
        }

        public Task<Channel> Get(GetChannel request)
            => Db.SingleByIdAsync<Channel>(request.Id);

        public async Task<Channel> Post(CreateChannel request)
        {
            var channel = request.ConvertTo<Channel>();
            channel.CreatedAt = DateTime.UtcNow;
            channel.Id = (int)await Db.InsertAsync(channel, selectIdentity: true);
            return channel;
        }

        public async Task<Channel> Put(UpdateChannel request)
        {
            var channel = await Db.SingleByIdAsync<Channel>(request.Id);
            channel.Name = request.Name;
            channel.Description = request.Description;
            await Db.UpdateAsync(channel);
            return channel;
        }

        public Task Delete(DeleteChannel request)
            => Db.DeleteByIdAsync<Channel>(request.Id);
    }
}
