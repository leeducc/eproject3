using backend.Models;
using MongoDB.Driver;

namespace backend.Data
{
    public class MongoDbContext
    {
        private readonly IMongoDatabase _database;
        public MongoDbContext(IConfiguration configuration)
        {
            var client = new MongoClient(configuration.GetConnectionString("MongoDB"));
            _database = client.GetDatabase("eproject3");
        }
        public IMongoCollection<User> Products => _database.GetCollection<User>("Users");
    }
}