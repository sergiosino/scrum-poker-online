using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using ScrumPokerOnline.API.Enums;

namespace ScrumPokerOnline.API.Models
{
    public class Room
    {
        public ObjectId Id { get; set; }
        public string Name { get; set; }
        public RoomStatesEnum State { get; set; }
        public List<User> Users { get; set; }
        public List<Issue> Issues { get; set; }
        public DateTime Created { get; set; }
        public DateTime Updated { get; set; }

        [BsonIgnore]
        public string IdString { get { return Id.ToString(); } }

        public Room(string name)
        {
            Name = name;
            State = RoomStatesEnum.NoIssueSelected;
            Users = new List<User>();
            Issues = new List<Issue>();
            Created = DateTime.Now;
            Updated = DateTime.Now;
        }
    }
}
