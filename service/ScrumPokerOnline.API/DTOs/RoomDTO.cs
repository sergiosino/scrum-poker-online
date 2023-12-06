using ScrumPokerOnline.API.Enums;
using ScrumPokerOnline.API.Models;

namespace ScrumPokerOnline.API.DTOs
{
    public class RoomDTO
    {
        public string Id { get; }
        public string Name { get; }
        public RoomStatesEnum State { get; set; }
        public List<UserDTO> Users { get; set; }
        public List<IssueDTO> Issues { get; set; }

        public RoomDTO(Room room)
        {
            Id = room.Id.ToString();
            Name = room.Name;
            State = room.State;
            Users = room.Users.Select(x => new UserDTO(x)).ToList();
            Issues = room.Issues.Select(x => new IssueDTO(x)).ToList();
        }
    }
}
