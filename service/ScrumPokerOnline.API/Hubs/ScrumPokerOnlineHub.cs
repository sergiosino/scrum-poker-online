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
        /// Select a card value for the connection id user, saves the value and updates the other players in the game
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public async Task SelectCardValue(string value)
        {
            if(_users.TryGetValue(Context.ConnectionId, out UserDTO? user))
            {
                user.Value = value;
                _users[Context.ConnectionId] = user;
                await Clients.Group(user.Game).SendAsync("ReceiveCardValue", user.Name, user.Value);
            }
        }

        /// <summary>
        /// Adds a user to a scrum poke game
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public async Task JoinScrumPoker(UserDTO user)
        {
            _users[Context.ConnectionId] = user;

            await Groups.AddToGroupAsync(Context.ConnectionId, user.Game);

            await SendConnectedUsers(user.Game);
        }

        /// <summary>
        /// Sends an update to all the players with the current users in the game
        /// </summary>
        /// <param name="game"></param>
        /// <returns></returns>
        public Task SendConnectedUsers(string game)
        {
            List<UserDTO> users = _users.Values.Where(x => x.Game == game).ToList();
            return Clients.Group(game).SendAsync("UpdateUsers", users);
        }
    }
}
