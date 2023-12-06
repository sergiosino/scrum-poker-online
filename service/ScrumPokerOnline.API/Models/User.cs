namespace ScrumPokerOnline.API.Models
{
    public class User
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string? CardValue { get; set; }
        public bool IsAdmin { get; set; }
        public string ConnectionId { get; set; }

        public User(string connectionId, string userName, bool isAdmin = false)
        {
            Id = Guid.NewGuid().ToString();
            Name = userName;
            CardValue = null;
            IsAdmin = isAdmin;
            ConnectionId = connectionId;
        }
    }
}
