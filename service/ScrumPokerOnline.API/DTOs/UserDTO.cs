using System.Text.Json.Serialization;

namespace ScrumPokerOnline.API.DTOs
{
    public class UserDTO
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string? CardValue { get; set; }
        public bool IsAdmin { get; set; }

        [JsonIgnore]
        public string ConnectionId { get; set; }

        public UserDTO(string connectionId, string userName, bool isAdmin = false)
        {
            Id = Guid.NewGuid().ToString();
            ConnectionId = connectionId;
            Name = userName;
            CardValue = null;
            IsAdmin = isAdmin;
        }
    }
}
