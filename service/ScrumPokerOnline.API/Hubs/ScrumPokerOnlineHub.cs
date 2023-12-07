using Microsoft.AspNetCore.SignalR;
using ScrumPokerOnline.API.DTOs;
using ScrumPokerOnline.API.Models;
using ScrumPokerOnline.API.Services;

namespace ScrumPokerOnline.API.Hubs
{
    public class ScrumPokerOnlineHub : Hub
    {
        private readonly RoomsService _roomsService;

        public ScrumPokerOnlineHub(RoomsService roomService)
        {
            _roomsService = roomService;
        }

        public async Task CreateUserAndRoom(string roomName, string userName)
        {
            ParamsValidationAndSetConnectionId(new Dictionary<string, string> { 
                { "room name", roomName },
                { "username", userName }
            });
            await _roomsService.CreateUserAndRoom(roomName, userName);
        }

        public async Task CreateUserAndJoinRoom(string roomId, string userName)
        {
            ParamsValidationAndSetConnectionId(new Dictionary<string, string> {
                { "room id", roomId },
                { "username", userName }
            });
            await _roomsService.CreateUserAndJoinRoom(roomId, userName);
        }

        public async Task RetrieveUserRoom(string userId)
        {
            ParamsValidationAndSetConnectionId(new Dictionary<string, string> { 
                { "user id", userId } 
            });
            await _roomsService.RetrieveUserRoom(userId);
        }

        public async Task CreateNewIssue(string issueName)
        {
            ParamsValidationAndSetConnectionId(new Dictionary<string, string> { 
                { "issue name", issueName } 
            });
            await _roomsService.CreateNewIssue(issueName);
        }

        public async Task SelectIssueToVote(string issueId)
        {
            ParamsValidationAndSetConnectionId(new Dictionary<string, string> { 
                { "issue id", issueId } 
            });
            await _roomsService.SelectIssueToVote(issueId);
        }

        public async Task SelectCardValue(string value)
        {
            ParamsValidationAndSetConnectionId(new Dictionary<string, string> { 
                { "selected card value", value } 
            });
            await _roomsService.SelectCardValue(value);
        }

        public async Task CalculateAverageRoomValue()
        {
            ParamsValidationAndSetConnectionId();
            await _roomsService.CalculateAverageRoomValue();
        }

        public async Task RestartRoomVote()
        {
            ParamsValidationAndSetConnectionId();
            await _roomsService.RestartRoomVote();
        }

        public async Task KickOutUserFromRoom(string userId)
        {
            ParamsValidationAndSetConnectionId(new Dictionary<string, string> { 
                { "user id", userId } 
            });
            await _roomsService.KickOutUserFromRoom(userId);
        }

        public async Task LeaveRoom()
        {
            ParamsValidationAndSetConnectionId();
            await _roomsService.LeaveRoom();
        }

        private void ParamsValidationAndSetConnectionId(Dictionary<string, string>? parameters = null)
        {
            if (parameters != null)
            {
                foreach (KeyValuePair<string, string> parameter in parameters)
                {
                    if (string.IsNullOrWhiteSpace(parameter.Value))
                    {
                        throw new HubException($"The {parameter.Key} cannot be empty");
                    }
                }
            }

            _roomsService.SetConnectionId(Context.ConnectionId);
        }
    }
}
