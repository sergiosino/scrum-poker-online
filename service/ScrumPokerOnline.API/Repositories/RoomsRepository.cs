using MongoDB.Driver;
using ScrumPokerOnline.API.Models;

namespace ScrumPokerOnline.API.Repositories
{
    public class RoomsRepository
    {
        private readonly int _hoursToRemoveNotUpdatedRoom;

        private readonly IMongoCollection<Room> _roomsCollection;

        public RoomsRepository(IConfiguration config, IMongoDatabase mongoDb)
        {
            string mongoCollectionName = config.GetSection("MongoDbCollectionName").Get<string>() ?? string.Empty;
            _roomsCollection = mongoDb.GetCollection<Room>(mongoCollectionName);
            _hoursToRemoveNotUpdatedRoom = config.GetSection("HoursToRemoveNotUpdatedRoom").Get<int>();
        }

        public Room GetByRoomId(string roomId)
        {
            return _roomsCollection.Find(x => x.Id.ToString() == roomId).FirstOrDefault();
        }

        public Room GetByUserId(string userId)
        {
            return _roomsCollection.Find(room => room.Users.Any(user => user.Id == userId)).FirstOrDefault();
        }

        public Room GetByConnectionId(string connectionId)
        {
            return _roomsCollection.Find(room => room.Users.Any(user => user.ConnectionId == connectionId)).FirstOrDefault();
        }

        public Room Add(Room room)
        {
            room.Created = DateTime.Now;
            _roomsCollection.InsertOne(room);
            return room;
        }

        public void Update(Room room)
        {
            UpdateDefinition<Room> update = Builders<Room>.Update
                .Set(x => x.State, room.State)
                .Set(x => x.Users, room.Users)
                .Set(x => x.Issues, room.Issues)
                .Set(x => x.Updated, DateTime.Now);

            _roomsCollection.UpdateOne(
                x => x.Id == room.Id, 
                update);
        }

        public void DeleteUsers(string connectionId)
        {
            var filter = Builders<Room>.Filter.ElemMatch(r => r.Users, u => u.ConnectionId == connectionId);
            var update = Builders<Room>.Update.PullFilter(r => r.Users, u => u.ConnectionId == connectionId);

            _roomsCollection.UpdateMany(filter, update);
        }

        public void Delete(string roomId)
        {
            _roomsCollection.DeleteOne(x => x.Id.ToString() == roomId);
        }

        public void DeleteAbandoned()
        {
            _roomsCollection.DeleteOne(x => x.Updated.AddHours(_hoursToRemoveNotUpdatedRoom) < DateTime.Now);
        }
    }
}
