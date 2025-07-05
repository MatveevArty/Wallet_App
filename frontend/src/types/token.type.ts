export type TokenType = {
    accessToken: string | null,
    refreshToken: string | null,
    userInfo: UserInfoType | null
}

export type UserInfoType = {
    name: string,
    id: number
}