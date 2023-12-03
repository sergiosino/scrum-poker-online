using Microsoft.AspNetCore.SignalR;
using ScrumPokerOnline.API.DTOs;
using ScrumPokerOnline.API.Enums;
using System.Text.RegularExpressions;

namespace ScrumPokerOnline.API.Hubs
{
    public class ScrumPokerOnlineHub : Hub
    {
        private readonly List<RoomDTO> _rooms;
        private const int HOURS_LIFE_ROOM = 4;

        public ScrumPokerOnlineHub(List<RoomDTO> rooms)
        {
            _rooms = rooms;
        }

        public async Task<RoomDTO> CreateUserAndRoom(string roomName, string userName)
        {
            if(string.IsNullOrWhiteSpace(roomName) || string.IsNullOrWhiteSpace(userName))
            {
                throw new HubException("Room and user name cannot be empty");
            }

            DeleteOldRooms();

            RoomDTO room = new RoomDTO(roomName);

            UserDTO user = new UserDTO(Context.ConnectionId, userName, true);
            room.Users.Add(user);
            _rooms.Add(room);

            await Groups.AddToGroupAsync(Context.ConnectionId, room.Id);
            await Clients.Client(Context.ConnectionId).SendAsync(HubInvokeMethodsEnum.ReceiveMyUserId.ToString(), user.Id);

            return room;
        }

        public async Task<RoomDTO> CreateUserAndJoinRoom(string roomId, string userName)
        {
            if (string.IsNullOrWhiteSpace(userName))
            {
                throw new HubException("User name cannot be empty");
            }

            RoomDTO? room = _rooms.FirstOrDefault(x => x.Id == roomId);
            if (room == null)
            {
                throw new HubException("This room does not exists");
            }

            bool userNameAlreadyExists = room.Users.Any(x => x.Name == userName);
            if (userNameAlreadyExists)
            {
                throw new HubException("User name already exists in the room");
            }

            UserDTO user = new UserDTO(Context.ConnectionId, userName);
            room.Users.Add(user);

            await Groups.AddToGroupAsync(Context.ConnectionId, room.Id);
            await Clients.Client(Context.ConnectionId).SendAsync(HubInvokeMethodsEnum.ReceiveMyUserId.ToString(), user.Id);
            await SendRoomUsersUpdatedInfo(room.Id);

            return room;
        }

        public async Task<RoomDTO> RetrieveUserRoom(string userId)
        {
            RoomDTO? room = _rooms.FirstOrDefault(x => x.Users.Any(u => u.Id == userId));

            if (room == null)
            {
                throw new HubException("The room could not be recovered");
            }

            UserDTO user = room.Users.First(x => x.Id == userId);
            await Groups.RemoveFromGroupAsync(user.ConnectionId, room.Id);

            await Groups.AddToGroupAsync(Context.ConnectionId, room.Id);
            user.ConnectionId = Context.ConnectionId;

            return room;
        }

        public async Task SelectCardValue(string value)
        {
            RoomDTO room = CheckIfConnectionIdInRoom();
            
            if(room.State == RoomStatesEnum.WatchingFinalAverage)
            {
                throw new HubException("Reset the game before selecting a new card");
            }

            UserDTO user = room.Users.First(x => x.ConnectionId == Context.ConnectionId);
            user.CardValue = value;

            room.State = RoomStatesEnum.WithSomeSelectedCards;

            await SendRoomUsersUpdatedInfo(room.Id);
        }

        public async Task CalculateAverageRoomValue()
        {
            RoomDTO room = CheckIfConnectionIdInRoom();

            List<int> usersCardValues = room.Users
                .Where(x => x.CardValue != null && int.TryParse(x.CardValue, out int temp))
                .Select(x => Convert.ToInt32(x.CardValue))
                .ToList();

            string average = "0";
            if (usersCardValues.Any())
            {
                average = usersCardValues.Average().ToString("0.00");
            }
            room.Average = average;
            room.State = RoomStatesEnum.WatchingFinalAverage;

            await SendRoomUsersUpdatedInfo(room.Id);
        }

        public async Task RestartRoomVote()
        {
            RoomDTO room = CheckIfConnectionIdInRoom();

            room.State = RoomStatesEnum.NoCardsSelected;
            room.Average = null;
            room.Users.ForEach(x =>
            {
                x.CardValue = null;
            });

            await SendRoomUsersUpdatedInfo(room.Id);
        }

        public async Task KickOutUserFromRoom(string userId)
        {
            RoomDTO room = CheckIfConnectionIdInRoom(true);

            UserDTO userToRemove = room.Users.First(x => x.Id == userId);
            room.Users.Remove(userToRemove);
            await Groups.RemoveFromGroupAsync(userToRemove.ConnectionId, room.Id);

            await Clients.Client(userToRemove.ConnectionId).SendAsync(HubInvokeMethodsEnum.ReceiveKickOut.ToString());
            await SendRoomUsersUpdatedInfo(room.Id, userToRemove.Id);
        }

        public async Task LeaveRoom()
        {
            RoomDTO room = CheckIfConnectionIdInRoom();
            room.Users.RemoveAll(x => x.ConnectionId == Context.ConnectionId);

            if (room.Users.Any())
            {
                await SendRoomUsersUpdatedInfo(room.Id);
            }
            else
            {
                _rooms.Remove(room);
            }
        }

        private RoomDTO CheckIfConnectionIdInRoom(bool hasToBeAdmin = false)
        {
            RoomDTO? room = _rooms.FirstOrDefault(x => x.Users.Any(u => u.ConnectionId == Context.ConnectionId 
                && ((hasToBeAdmin && u.IsAdmin) || !hasToBeAdmin)));

            if (room == null)
            {
                throw new HubException("User does not exist or does not have permissions");
            }
            else
            {
                return room;
            }
        }

        private async Task SendRoomUsersUpdatedInfo(string roomId)
        {
            RoomDTO room = _rooms.First(x => x.Id == roomId);
            await Clients.Group(roomId).SendAsync(HubInvokeMethodsEnum.ReceiveRoomUpdate.ToString(), room);
        }

        private async Task SendRoomUsersUpdatedInfo(string roomId, object arg1)
        {
            RoomDTO room = _rooms.First(x => x.Id == roomId);
            await Clients.Group(roomId).SendAsync(HubInvokeMethodsEnum.ReceiveRoomUpdate.ToString(), room, arg1);
        }

        private void DeleteOldRooms()
        {
            _rooms.RemoveAll(x => x.CreationDate.AddHours(HOURS_LIFE_ROOM) < DateTime.Now);
        }
    }
}
