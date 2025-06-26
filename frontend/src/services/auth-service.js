import {HttpUtils} from "../utils/http-utils";

export class AuthService {
    static async logIn(data) {
        const result = await HttpUtils.request('/login', 'POST', false, data);

        // Ключи ответа при логине: tokens {accessToken, refreshToken}, user {id, name, lastName}
        if (result.error || !result.response || (result.response.tokens && (!result.response.tokens.accessToken || !result.response.tokens.refreshToken)) ||
            (result.response.user && (!result.response.user.id || !result.response.user.name || !result.response.user.lastName))) {
            return false;
        }

        return result.response;
    }

    static async signUp(data) {
        const result = await HttpUtils.request('/signup', 'POST', false, data);

        // Ключи ответа при логине: user {id, email, name, lastname}
        if (result.error || !result.response || (result.response.user && (!result.response.user.id ||
            !result.response.user.email || !result.response.user.name || !result.response.user.lastName))) {
            return false;
        }

        return result.response;
    }


    static async logout(data) {
        // Ключи ответа при логине: error, message
        await HttpUtils.request('/logout', 'POST', false, data);
    }
}