using ScrumPokerOnline.API.Enums;
using ScrumPokerOnline.API.Models;

namespace ScrumPokerOnline.API.DTOs
{
    public class RoomDTO
    {
        public string Id { get; }
        public string Name { get; }
        public RoomStatesEnum State { get; set; }

        public RoomDTO(Room room)
        {
            Id = room.Id.ToString();
            Name = room.Name;
            State = room.State;
        }
    }
}
