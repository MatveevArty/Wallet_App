export type LoginSuccessType = {
    tokens: LoginTokensType,
    user: LoginUserInfoType,
}

export type LoginTokensType = {
    accessToken: string,
    refreshToken: string,
}

export type LoginUserInfoType = {
    name: string,
    lastName: string,
    id: number,
}