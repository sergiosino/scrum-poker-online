export enum RoomStatesEnum {
    NoCardsSelected = 0,
    WithSomeSelectedCards = 1,
    WatchingFinalAverage = 2,
}

export enum HubInvokeMethodsEnum
{
    CreateUserAndRoom = 'CreateUserAndRoom',
    CreateUserAndJoinRoom = 'CreateUserAndJoinRoom',
    SelectCardValue = 'SelectCardValue',
    CalculateAverageRoomValue = 'CalculateAverageRoomValue',
    RestartRoomVote = 'RestartRoomVote',
    KickOutUserFromRoom = 'KickOutUserFromRoom',
    RetrieveUserRoom = 'RetrieveUserRoom',
    LeaveRoom = 'LeaveRoom',
}

export enum HubReceiveMethodsEnum
{
    ReceiveMyUserId = 'ReceiveMyUserId',
    ReceiveRoomUpdate = 'ReceiveRoomUpdate',
    ReceiveKickOut = 'ReceiveKickOut',
}