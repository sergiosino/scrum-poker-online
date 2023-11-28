﻿using ScrumPokerOnline.API.Enums;
using System.Text.Json.Serialization;

namespace ScrumPokerOnline.API.DTOs
{
    public class RoomDTO
    {
        public string Id { get; }
        public string Name { get; }
        public string? Average { get; set; }
        public RoomStatesEnum State { get; set; }
        public List<UserDTO> Users { get; set; }
        public List<IssueDTO> Issues { get; set; }

        [JsonIgnore]
        public DateTime CreationDate { get; }

        public RoomDTO(string roomName)
        {
            Id = Guid.NewGuid().ToString();
            Name = roomName;
            Average = null;
            State = RoomStatesEnum.NoCardsSelected;
            Users = new List<UserDTO>();
            Issues = new List<IssueDTO>();
            CreationDate = DateTime.Now;
        }
    }
}
