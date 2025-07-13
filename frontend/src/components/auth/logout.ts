import {AuthUtils} from "../../utils/auth-utils";
import {AuthService} from "../../services/auth-service";
import {TokenEnum} from "../../enums/token.enum";

export class Logout {
    readonly openNewRoute: (url: string) => Promise<void>;

    constructor(openNewRoute: (url: string) => Promise<void>) {
        this.openNewRoute = openNewRoute;

        // Запрет на логаут, если не авторизован
        if (!AuthUtils.getAuthInfo(TokenEnum.accessTokenKey) || !AuthUtils.getAuthInfo(TokenEnum.refreshTokenKey)) {
            this.openNewRoute('/login').then();
            return;
        }

        this.logout().then();
    }

    async logout() {
        await AuthService.logout({refreshToken: AuthUtils.getAuthInfo(TokenEnum.refreshTokenKey) as string});
        AuthUtils.removeAuthInfo();
        this.openNewRoute('/login').then();
    }
}