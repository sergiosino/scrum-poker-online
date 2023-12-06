using ScrumPokerOnline.API.Models;

namespace ScrumPokerOnline.API.DTOs
{
    public class UserDTO
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string? CardValue { get; set; }
        public bool IsAdmin { get; set; }

        public UserDTO(User user)
        {
            Id = user.Id;
            Name = user.Name;
            CardValue = user.CardValue;
            IsAdmin = user.IsAdmin;
        }
    }
}
