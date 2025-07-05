import {config} from "../config/config";
import {TokenEnum} from "../enums/token.enum";
import {TokenType, UserInfoType} from "../types/token.type";
import {HttpMethodEnum} from "../enums/http-method.enum";

export class AuthUtils {
    public static accessTokenKey: string = 'accessToken';
    public static refreshTokenKey: string = 'refreshToken';
    public static userInfoTokenKey: string = 'userInfo';

    public static setAuthInfo(accessToken: string, refreshToken: string, userInfo: UserInfoType | null = null): void {
        localStorage.setItem(TokenEnum.accessTokenKey, accessToken);
        localStorage.setItem(TokenEnum.refreshTokenKey, refreshToken);
        if (userInfo) {
            localStorage.setItem(TokenEnum.userInfoTokenKey, JSON.stringify(userInfo));
        }
    }

    public static removeAuthInfo(): void {
        localStorage.removeItem(TokenEnum.accessTokenKey);
        localStorage.removeItem(TokenEnum.refreshTokenKey);
        localStorage.removeItem(TokenEnum.userInfoTokenKey);
    }

    public static getAuthInfo(key: string | null = null): string | TokenType | UserInfoType | null | undefined {
        // Возвращаем конкретный элемент при его передачи в вызове метода getAuthInfo, иначе возвращаем все три элемента
        if (key) {
            if (key === TokenEnum.accessTokenKey) {
                return localStorage.getItem(TokenEnum.accessTokenKey);
            } else if (key === TokenEnum.refreshTokenKey) {
                return localStorage.getItem(TokenEnum.refreshTokenKey);
            } else if (key === TokenEnum.userInfoTokenKey) {
                return localStorage.getItem(TokenEnum.userInfoTokenKey);
            }
        } else {
            return {
                [TokenEnum.accessTokenKey]: localStorage.getItem(TokenEnum.accessTokenKey),
                [TokenEnum.refreshTokenKey]: localStorage.getItem(TokenEnum.refreshTokenKey),
                [TokenEnum.userInfoTokenKey]: JSON.parse(localStorage.getItem(TokenEnum.refreshTokenKey) as string) as UserInfoType,
            }
        }
    }

    public static async updateRefreshToken(): Promise<boolean> {
        let result: boolean = false;
        const refreshToken: string | null | undefined = this.getAuthInfo(TokenEnum.refreshTokenKey) as string | null | undefined;
        if (refreshToken) {
            const response: Response = await fetch(config.api + '/refresh', {
                method: HttpMethodEnum.post,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({refreshToken: refreshToken}),
            });

            if (response && response.status === 200) {
                const tokens = await response.json();
                if (tokens && !tokens.error) {
                    this.setAuthInfo(tokens.accessToken, tokens.refreshToken);
                    result = true;
                }
            }
        }

        if (!result) {
            this.removeAuthInfo();
        }

        return result;
    }
}