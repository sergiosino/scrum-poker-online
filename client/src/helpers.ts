import { URL_PARAM_ROOM } from "./constants"

export const getUrlWithRoomId = (roomId: string): URL => {
    const inviteUrl = new URL(window.location.origin)
    inviteUrl.searchParams.append(URL_PARAM_ROOM, roomId)
    return inviteUrl
}

export const updateUrlWithoutRefresh = (roomId: string): void => {
    const url = getUrlWithRoomId(roomId)
    window.history.pushState({}, '', url);
}

export const updateUrlToOriginWithRefresh = () => {
    window.location.href = window.location.origin
}