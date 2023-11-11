using Microsoft.AspNetCore.SignalR;
using ScrumPokerOnline.API.DTOs;

namespace ScrumPokerOnline.API.Hubs
{
    public class ScrumPokerOnlineHub : Hub
    {
        private readonly IDictionary<string, UserDTO> _users;

        public ScrumPokerOnlineHub(IDictionary<string, UserDTO> users)
        {
            _users = users;
        }

        /// <summary>
        /// Select a card value for the connection id user, saves the value and updates the other players in the room
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public async Task SelectCardValue(string value)
        {
            if(_users.TryGetValue(Context.ConnectionId, out UserDTO? user))
            {
                user.Value = value;
                _users[Context.ConnectionId] = user;
                await Clients.Group(user.Room).SendAsync("ReceiveCardValue", user.Name, user.Value);
            }
        }

        /// <summary>
        /// Adds a user to a scrum poker room
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public async Task<UserDTO> JoinScrumPoker(UserDTO user)
        {
            bool existsUserName = _users.Values.Any(x => x.Room == user.Room && x.Name == user.Name);
            if(existsUserName) 
            {
                throw new HubException("User name already exists at this room");
            }

            bool hasRoomAnyUser = _users.Values.Any(x => x.Room == user.Room);
            user.IsAdmin = !hasRoomAnyUser;

            _users[Context.ConnectionId] = user;
            await Groups.AddToGroupAsync(Context.ConnectionId, user.Room);
            await SendConnectedUsers(user.Room);

            return user;
        }
        
        /// <summary>
        /// Calculates the average of all users values selected
        /// </summary>
        /// <returns></returns>
        public async Task CalculateAverageRoomValue()
        {
            if (_users.TryGetValue(Context.ConnectionId, out UserDTO? user) && user.IsAdmin)
            {
                List<int> usersValues = _users.Values
                    .Where(x => x.Room == user.Room && x.Value != null && int.TryParse(x.Value, out int temp))
                    .Select(x => Convert.ToInt32(x.Value))
                    .ToList();

                double average = 0;
                if (usersValues.Any())
                {
                    average = usersValues.Average();
                }
                await Clients.Group(user.Room).SendAsync("ReceiveAverageRoomValue", average);
            }
        }

        public async Task ResetRoomValues()
        {
            if (_users.TryGetValue(Context.ConnectionId, out UserDTO? user) && user.IsAdmin)
            {
                List<UserDTO> usersInRoom = _users.Values.Where(x => x.Room == user.Room).ToList();

                usersInRoom.ForEach(x =>
                {
                    x.Value = null;
                });

                await Clients.Group(user.Room).SendAsync("ReceiveUpdatedUsers", usersInRoom);
                await Clients.Group(user.Room).SendAsync("ReceiveAverageRoomValue", null);
            }
        }

        /// <summary>
        /// Sends an update to all the players with the current users in the room
        /// </summary>
        /// <param name="room"></param>
        /// <returns></returns>
        private Task SendConnectedUsers(string room)
        {
            List<UserDTO> usersInRoom = _users.Values.Where(x => x.Room == room).ToList();
            return Clients.Group(room).SendAsync("ReceiveUpdatedUsers", usersInRoom);
        }
    }
}
