using Microsoft.AspNetCore.SignalR;
using ScrumPokerOnline.API.DTOs;
using ScrumPokerOnline.API.Enums;
using ScrumPokerOnline.API.Hubs;
using ScrumPokerOnline.API.Models;
using ScrumPokerOnline.API.Repositories;

namespace ScrumPokerOnline.API.Services
{
    public class RoomsService
    {
        private readonly int _limitUsersInRoom;
        private string _connectionId = string.Empty;

        private readonly IHubContext<ScrumPokerOnlineHub> _scrumPokerOnlineHub;
        private readonly RoomsRepository _roomsRepository;

        public RoomsService(IConfiguration config, IHubContext<ScrumPokerOnlineHub> scrumPokerOnlineHub, RoomsRepository roomsRepository)
        {
            _scrumPokerOnlineHub = scrumPokerOnlineHub;
            _roomsRepository = roomsRepository;
            _limitUsersInRoom = config.GetSection("LimitUsersInRoom").Get<int>();
        }

        public void SetConnectionId(string connectionId)
        {
            _connectionId = connectionId;
        }

        public async Task CreateUserAndRoom(string roomName, string userName)
        {
            Room room = new Room(roomName);
            User user = new User(_connectionId, userName, true);
            room.Users.Add(user);

            _roomsRepository.DeleteUsers(_connectionId);
            _roomsRepository.Add(room);
            _roomsRepository.DeleteAbandoned();

            await _scrumPokerOnlineHub.Groups.AddToGroupAsync(_connectionId, room.IdString);

            await SendUserIdToCurrentconnection(user.Id);
            await SendRoomToCurrentConnection(room);
            await SendUsersToCurrentConnection(room.Users);
            await SendIssuesToCurrentConnection(room.Issues);
        }

        public async Task CreateUserAndJoinRoom(string roomId, string userName)
        {
            Room room = _roomsRepository.GetByRoomId(roomId);
            if (room == null)
            {
                throw new HubException("Connection attempt failed, the room appears to no longer exist");
            }
            if (room.Users.Count == _limitUsersInRoom)
            {
                throw new HubException($"The room has reached the limit of {_limitUsersInRoom} users");
            }

            bool userNameAlreadyExists = room.Users.Any(x => x.Name == userName);
            if (userNameAlreadyExists)
            {
                throw new HubException("The username already exists in the room, try another one!");
            }

            User user = new User(_connectionId, userName);
            room.Users.Add(user);

            _roomsRepository.DeleteUsers(_connectionId);
            _roomsRepository.Update(room);

            await _scrumPokerOnlineHub.Groups.AddToGroupAsync(_connectionId, room.IdString);

            await SendUserIdToCurrentconnection(user.Id);
            await SendRoomToCurrentConnection(room);
            await SendUsers(room.IdString, room.Users);
            await SendIssuesToCurrentConnection(room.Issues);
        }

        public async Task RetrieveUserRoom(string userId)
        {
            Room room = _roomsRepository.GetByUserId(userId);
            if (room == null)
            {
                throw new HubException("Reconnection attempt failed, the room appears to no longer exist");
            }

            User user = room.Users.First(x => x.Id == userId);
            await _scrumPokerOnlineHub.Groups.RemoveFromGroupAsync(user.ConnectionId, room.IdString);

            await _scrumPokerOnlineHub.Groups.AddToGroupAsync(_connectionId, room.IdString);
            user.ConnectionId = _connectionId;

            _roomsRepository.Update(room);

            await SendRoomToCurrentConnection(room);
            await SendUsersToCurrentConnection(room.Users);
            await SendIssuesToCurrentConnection(room.Issues);
        }

        public async Task CreateNewIssue(string issueName)
        {
            Room room = CheckIfConnectionIdInRoom(true);

            Issue issue = new Issue(issueName);
            room.Issues.Add(issue);

            _roomsRepository.Update(room);

            await SendIssues(room.IdString, room.Issues);
        }

        public async Task SelectIssueToVote(string issueId)
        {
            Room room = CheckIfConnectionIdInRoom(true);
            Issue? issue = room.Issues.FirstOrDefault(x => x.Id == issueId);
            if (issue == null)
            {
                throw new HubException("The problem you are trying to vote on seems to not exist, refresh and try again");
            }

            room.State = RoomStatesEnum.VotingIssue;
            room.Users.ForEach(x => x.CardValue = null);
            room.Issues.ForEach(x => x.IsVoting = false);
            issue.IsVoting = true;

            _roomsRepository.Update(room);

            await SendRoom(room);
            await SendUsers(room.IdString, room.Users);
            await SendIssues(room.IdString, room.Issues);
        }

        public async Task SelectCardValue(string value)
        {
            Room room = CheckIfConnectionIdInRoom();
            if (room.State == RoomStatesEnum.WatchingFinalIssueAverage)
            {
                throw new HubException("Reset the game before selecting a new card");
            }

            User user = room.Users.First(x => x.ConnectionId == _connectionId);
            Issue? issue = room.Issues.FirstOrDefault(x => x.IsVoting);
            if (issue == null)
            {
                if (user.IsAdmin)
                    throw new HubException("You have to choose an issue to vote on first");
                else
                    throw new HubException("The administrator has to choose an issue to vote on first");
            }

            user.CardValue = value;

            _roomsRepository.Update(room);

            await SendUsers(room.IdString, room.Users);
        }

        public async Task CalculateAverageRoomValue()
        {
            Room room = CheckIfConnectionIdInRoom();
            Issue? issue = room.Issues.FirstOrDefault(x => x.IsVoting);
            if (issue == null)
            {
                throw new HubException("No issues are being voted on");
            }

            List<int> usersCardValues = room.Users
                .Where(x => x.CardValue != null && int.TryParse(x.CardValue, out int temp))
                .Select(x => Convert.ToInt32(x.CardValue))
                .ToList();

            string average = "0";
            if (usersCardValues.Any())
            {
                average = usersCardValues.Average().ToString("0.00");
            }

            issue.Average = average;
            room.State = RoomStatesEnum.WatchingFinalIssueAverage;

            _roomsRepository.Update(room);

            await SendRoom(room);
            await SendIssues(room.IdString, room.Issues);
        }

        public async Task RestartRoomVote()
        {
            Room room = CheckIfConnectionIdInRoom();

            room.State = RoomStatesEnum.NoIssueSelected;
            room.Users.ForEach(x => x.CardValue = null);
            room.Issues.ForEach(x => x.IsVoting = false);

            _roomsRepository.Update(room);

            await SendRoom(room);
            await SendUsers(room.IdString, room.Users);
            await SendIssues(room.IdString, room.Issues);
        }

        public async Task KickOutUserFromRoom(string userId)
        {
            Room room = CheckIfConnectionIdInRoom(true);

            User userToRemove = room.Users.First(x => x.Id == userId);
            room.Users.Remove(userToRemove);

            _roomsRepository.Update(room);

            await _scrumPokerOnlineHub.Groups.RemoveFromGroupAsync(userToRemove.ConnectionId, room.IdString);

            await _scrumPokerOnlineHub.Clients.Client(userToRemove.ConnectionId).SendAsync(HubInvokeMethodsEnum.ReceiveKickOut.ToString());
            await SendUsers(room.IdString, room.Users);
        }

        public async Task LeaveRoom()
        {
            Room room = CheckIfConnectionIdInRoom();

            User userToLeave = room.Users.First(x => x.ConnectionId == _connectionId);
            room.Users.Remove(userToLeave);

            await _scrumPokerOnlineHub.Groups.RemoveFromGroupAsync(userToLeave.ConnectionId, room.IdString);

            if (room.Users.Any())
            {
                if (userToLeave.IsAdmin)
                {
                    room.Users.First().IsAdmin = true;
                }

                _roomsRepository.Update(room);

                await SendUsers(room.IdString, room.Users);
            }
            else
            {
                _roomsRepository.Delete(room.IdString);
            }
        }

        #region Private methods

        private async Task SendRoom(Room room)
        {
            RoomDTO roomDTO = new RoomDTO(room);
            await _scrumPokerOnlineHub.Clients.Group(roomDTO.Id).SendAsync(HubInvokeMethodsEnum.ReceiveRoomUpdate.ToString(), roomDTO);
        }

        private async Task SendRoomToCurrentConnection(Room room)
        {
            RoomDTO roomDTO = new RoomDTO(room);
            await _scrumPokerOnlineHub.Clients.Client(_connectionId).SendAsync(HubInvokeMethodsEnum.ReceiveRoomUpdate.ToString(), roomDTO);
        }

        private async Task SendIssues(string roomId, List<Issue> issues)
        {
            List<IssueDTO> issuesDTO = issues.Select(x => new IssueDTO(x)).ToList();
            await _scrumPokerOnlineHub.Clients.Group(roomId).SendAsync(HubInvokeMethodsEnum.ReceiveIssuesUpdate.ToString(), issuesDTO);
        }

        private async Task SendIssuesToCurrentConnection(List<Issue> issues)
        {
            List<IssueDTO> issuesDTO = issues.Select(x => new IssueDTO(x)).ToList();
            await _scrumPokerOnlineHub.Clients.Client(_connectionId).SendAsync(HubInvokeMethodsEnum.ReceiveIssuesUpdate.ToString(), issuesDTO);
        }

        private async Task SendUsers(string roomId, List<User> users)
        {
            List<UserDTO> usersDTO = users.Select(x => new UserDTO(x)).ToList();
            await _scrumPokerOnlineHub.Clients.Group(roomId).SendAsync(HubInvokeMethodsEnum.ReceiveUsersUpdate.ToString(), usersDTO);
        }

        private async Task SendUsersToCurrentConnection(List<User> users)
        {
            List<UserDTO> usersDTO = users.Select(x => new UserDTO(x)).ToList();
            await _scrumPokerOnlineHub.Clients.Client(_connectionId).SendAsync(HubInvokeMethodsEnum.ReceiveUsersUpdate.ToString(), usersDTO);
        }

        private async Task SendUserIdToCurrentconnection(string userId)
        {
            await _scrumPokerOnlineHub.Clients.Client(_connectionId).SendAsync(HubInvokeMethodsEnum.ReceiveMyUserId.ToString(), userId);
        }

        private Room CheckIfConnectionIdInRoom(bool hasToBeAdmin = false)
        {
            Room room = _roomsRepository.GetByConnectionId(_connectionId);
            if (room == null)
            {
                throw new HubException("There was an error with your connection, refresh and try again");
            }

            User? user = room.Users.FirstOrDefault(x => x.ConnectionId == _connectionId && ((hasToBeAdmin && x.IsAdmin) || !hasToBeAdmin));
            if (user == null)
            {
                throw new HubException("You don't have permissions to do that");
            }

            return room;
        }

        #endregion
    }
}
