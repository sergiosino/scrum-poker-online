﻿using Microsoft.AspNetCore.SignalR;
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

        public async Task<RoomDTO> CreateUserAndRoom(string roomName, string userName)
        {
            Room room = new Room(roomName);
            User user = new User(_connectionId, userName, true);
            room.Users.Add(user);

            _roomsRepository.Add(room);
            _roomsRepository.DeleteAbandoned();

            await _scrumPokerOnlineHub.Groups.AddToGroupAsync(_connectionId, room.IdString);
            await _scrumPokerOnlineHub.Clients.Client(_connectionId).SendAsync(HubInvokeMethodsEnum.ReceiveMyUserId.ToString(), user.Id);

            return new RoomDTO(room);
        }

        public async Task<RoomDTO> CreateUserAndJoinRoom(string roomId, string userName)
        {
            Room room = _roomsRepository.GetByRoomId(roomId);
            if (room == null)
            {
                throw new HubException("This room does not exists");
            }
            if (room.Users.Count == _limitUsersInRoom)
            {
                throw new HubException("User limit reached in the room");
            }

            bool userNameAlreadyExists = room.Users.Any(x => x.Name == userName);
            if (userNameAlreadyExists)
            {
                throw new HubException("User name already exists in the room");
            }

            User user = new User(_connectionId, userName);
            room.Users.Add(user);

            _roomsRepository.Update(room);

            await _scrumPokerOnlineHub.Groups.AddToGroupAsync(_connectionId, room.IdString);
            await _scrumPokerOnlineHub.Clients.Client(_connectionId).SendAsync(HubInvokeMethodsEnum.ReceiveMyUserId.ToString(), user.Id);

            await SendRoomUsersUpdatedInfo(room);

            return new RoomDTO(room);
        }

        public async Task<RoomDTO> RetrieveUserRoom(string userId)
        {
            Room room = _roomsRepository.GetByUserId(userId);
            if (room == null)
            {
                throw new HubException("The room could not be recovered");
            }

            User user = room.Users.First(x => x.Id == userId);
            await _scrumPokerOnlineHub.Groups.RemoveFromGroupAsync(user.ConnectionId, room.IdString);

            await _scrumPokerOnlineHub.Groups.AddToGroupAsync(_connectionId, room.IdString);
            user.ConnectionId = _connectionId;

            _roomsRepository.Update(room);

            return new RoomDTO(room);
        }

        public async Task CreateNewIssue(string issueName)
        {
            Room room = CheckIfConnectionIdInRoom(true);

            Issue issue = new Issue(issueName);
            room.Issues.Add(issue);

            _roomsRepository.Update(room);

            await SendRoomUsersUpdatedInfo(room);
        }

        public async Task SelectIssueToVote(string issueId)
        {
            Room room = CheckIfConnectionIdInRoom(true);
            Issue? issue = room.Issues.FirstOrDefault(x => x.Id == issueId);
            if (issue == null)
            {
                throw new HubException("Error when trying to start voting the issue");
            }

            room.State = RoomStatesEnum.VotingIssue;
            room.Users.ForEach(x => x.CardValue = null);
            room.Issues.ForEach(x => x.IsVoting = false);
            issue.IsVoting = true;

            _roomsRepository.Update(room);

            await SendRoomUsersUpdatedInfo(room);
        }

        public async Task SelectCardValue(string value)
        {
            Room room = CheckIfConnectionIdInRoom();
            if (room.State == RoomStatesEnum.WatchingFinalIssueAverage)
            {
                throw new HubException("Reset the game before selecting a new card");
            }

            Issue? issue = room.Issues.FirstOrDefault(x => x.IsVoting);
            if (issue == null)
            {
                throw new HubException("You need to choose an issue first");
            }

            User user = room.Users.First(x => x.ConnectionId == _connectionId);
            user.CardValue = value;

            _roomsRepository.Update(room);

            await SendRoomUsersUpdatedInfo(room);
        }

        public async Task CalculateAverageRoomValue()
        {
            Room room = CheckIfConnectionIdInRoom();
            Issue? issue = room.Issues.FirstOrDefault(x => x.IsVoting);
            if (issue == null)
            {
                throw new HubException("You need to choose an issue first");
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

            await SendRoomUsersUpdatedInfo(room);
        }

        public async Task RestartRoomVote()
        {
            Room room = CheckIfConnectionIdInRoom();

            room.State = RoomStatesEnum.NoIssueSelected;
            room.Issues.ForEach(x => x.IsVoting = false);
            room.Users.ForEach(x =>
            {
                x.CardValue = null;
            });

            _roomsRepository.Update(room);

            await SendRoomUsersUpdatedInfo(room);
        }

        public async Task KickOutUserFromRoom(string userId)
        {
            Room room = CheckIfConnectionIdInRoom(true);

            User userToRemove = room.Users.First(x => x.Id == userId);
            room.Users.Remove(userToRemove);

            _roomsRepository.Update(room);

            await _scrumPokerOnlineHub.Groups.RemoveFromGroupAsync(userToRemove.ConnectionId, room.IdString);
            await _scrumPokerOnlineHub.Clients.Client(userToRemove.ConnectionId).SendAsync(HubInvokeMethodsEnum.ReceiveKickOut.ToString());

            await SendRoomUsersUpdatedInfo(room, userToRemove.Id);
        }

        public async Task LeaveRoom()
        {
            Room room = CheckIfConnectionIdInRoom();
            
            User userToLeave = room.Users.First(x => x.ConnectionId == _connectionId);
            room.Users.Remove(userToLeave);

            if (room.Users.Any())
            {
                if (userToLeave.IsAdmin)
                {
                    room.Users.First().IsAdmin = true;
                }

                _roomsRepository.Update(room);
                await SendRoomUsersUpdatedInfo(room);
            }
            else
            {
                _roomsRepository.Delete(room.IdString);
            }
        }

        #region Private methods

        private async Task SendRoomUsersUpdatedInfo(Room room)
        {
            RoomDTO roomDTO = new RoomDTO(room);
            await _scrumPokerOnlineHub.Clients.Group(roomDTO.Id).SendAsync(HubInvokeMethodsEnum.ReceiveRoomUpdate.ToString(), roomDTO);
        }

        private async Task SendRoomUsersUpdatedInfo(Room room, object arg1)
        {
            RoomDTO roomDTO = new RoomDTO(room);
            await _scrumPokerOnlineHub.Clients.Group(roomDTO.Id).SendAsync(HubInvokeMethodsEnum.ReceiveRoomUpdate.ToString(), roomDTO, arg1);
        }

        private Room CheckIfConnectionIdInRoom(bool hasToBeAdmin = false)
        {
            Room room = _roomsRepository.GetByConnectionId(_connectionId);
            if (room == null)
            {
                throw new HubException("User does not exist");
            }

            User? user = room.Users.FirstOrDefault(x => x.ConnectionId == _connectionId && ((hasToBeAdmin && x.IsAdmin) || !hasToBeAdmin));
            if (user == null)
            {
                throw new HubException("User does not have permissions");
            }

            return room;
        }

        #endregion
    }
}
