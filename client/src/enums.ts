export enum RoomStatesEnum {
    NoIssueSelected = 0,
    VotingIssue = 1,
    WatchingFinalIssueAverage = 2
}

export enum HubInvokeMethodsEnum
{
    CreateUserAndRoom = 'CreateUserAndRoom',
    CreateUserAndJoinRoom = 'CreateUserAndJoinRoom',
    CreateNewIssue = 'CreateNewIssue',
    SelectIssueToVote = 'SelectIssueToVote',
    SelectCardValue = 'SelectCardValue',
    CalculateAverageRoomValue = 'CalculateAverageRoomValue',
    RestartRoomVote = 'RestartRoomVote',
    KickOutUserFromRoom = 'KickOutUserFromRoom',
    RetrieveUserRoom = 'RetrieveUserRoom',
    LeaveRoom = 'LeaveRoom',
}

export enum HubReceiveMethodsEnum
{
    ReceiveRoomUpdate = 'ReceiveRoomUpdate',
    ReceiveIssuesUpdate = 'ReceiveIssuesUpdate',
    ReceiveUsersUpdate = 'ReceiveUsersUpdate',
    ReceiveMyUserId = 'ReceiveMyUserId',
    ReceiveKickOut = 'ReceiveKickOut',
}