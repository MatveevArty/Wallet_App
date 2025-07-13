import {HttpUtils} from "../utils/http-utils";
import {LoginType} from "../types/login.type";
import {HttpMethodEnum} from "../enums/http-method.enum";
import {SignupType} from "../types/signup.type";
import {LogoutType} from "../types/logout.type";
import {LoginResultType} from "../types/login-result.type";
import {LoginSuccessType} from "../types/login-success.type";
import {SignupResultType} from "../types/signup-result.type";
import {SignupSuccessType} from "../types/signup-success.type";

export class AuthService {
    public static async logIn(data: LoginType): Promise<LoginSuccessType | boolean> {
        const result: LoginResultType = await HttpUtils.request('/login', HttpMethodEnum.post, false, data);

        // Ключи ответа при логине: tokens {accessToken, refreshToken}, user {id, name, lastName}
        if (result.error || !result.response || (result.response.tokens && (!result.response.tokens.accessToken || !result.response.tokens.refreshToken)) ||
            (result.response.user && (!result.response.user.id || !result.response.user.name || !result.response.user.lastName))) {
            return false;
        }

        return result.response;
    }

    public static async signUp(data: SignupType): Promise<SignupSuccessType | boolean> {
        const result: SignupResultType = await HttpUtils.request('/signup', HttpMethodEnum.post, false, data);

        // Ключи ответа при логине: user {id, email, name, lastname}
        if (result.error || !result.response || (result.response.user && (!result.response.user.id ||
            !result.response.user.email || !result.response.user.name || !result.response.user.lastName))) {
            return false;
        }

        return result.response;
    }


    public static async logout(data: LogoutType): Promise<void> {
        // Ключи ответа при логине: error, message
        await HttpUtils.request('/logout', HttpMethodEnum.post, false, data);
    }
}