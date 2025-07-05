import {config} from "../config/config";
import {AuthUtils} from "./auth-utils";
import {HttpMethodEnum} from "../enums/http-method.enum";
import {TokenEnum} from "../enums/token.enum";

export class HttpUtils {
    public static async request(url: string, method: HttpMethodEnum = HttpMethodEnum.get, useAuth: boolean = true, body: string | null = null): Promise<any> {
        const result = {
            error: false,
            response: null,
            redirect: '',
        };

        const params = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-auth-token' : 'no-token',
            },
            body: '',
        };

        let accessToken: string | undefined | null;

        if (useAuth) {
            accessToken = AuthUtils.getAuthInfo(TokenEnum.accessTokenKey) as string | undefined | null;
            if (accessToken) {
                params.headers['x-auth-token'] = accessToken;
            }
        }

        if (body) {
            params.body = JSON.stringify(body);
        }

        let response = null;
        try {
            response = await fetch(config.api + url, params);
            result.response = await response.json();
        } catch(e) {
            result.error = true;
            return result;
        }

        if (response.status < 200 || response.status >= 300) {
            result.error = true;

            if (useAuth && response.status === 401) {
                if (!accessToken) {
                    result.redirect = '/auth/login';
                } else {
                    const updateTokenResult = await AuthUtils.updateRefreshToken();
                    if (updateTokenResult) {
                        return this.request(url, method, useAuth, body);
                    } else {
                        result.redirect = '/auth/login';
                    }
                }
            }
        }

        return result;
    }
}