export const getUrlWithRoomId = (paramName: string, paramValue: string): URL => {
    const inviteUrl = new URL(window.location.origin)
    inviteUrl.searchParams.append(paramName, paramValue)
    return inviteUrl
}

export const updateUrlWithoutRefresh = (paramName: string, paramValue: string): void => {
    const actualParamValue = getUrlParam(paramName)
    if (actualParamValue) { return }

    const url = getUrlWithRoomId(paramName, paramValue)
    window.history.pushState({}, '', url);
}

export const updateUrlToOriginWithRefresh = () => {
    const originUrl = window.location.origin
    window.location.href = originUrl
}

export const updateUrlToOriginWithoutRefresh = () => {
    const originUrl = window.location.origin
    window.history.pushState({}, '', originUrl);
}

export const getUrlParam = (paramName: string): string | null => {
    const urlParaValue = new URL(location.href).searchParams?.get(paramName)
    return urlParaValue
}