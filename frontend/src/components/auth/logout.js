import {AuthUtils} from "../../utils/auth-utils";
import {AuthService} from "../../services/auth-service";

export class Logout {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        // Запрет на логаут, если не авторизован
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            return this.openNewRoute('/auth/login');
        }

        this.logout().then();
    }

    async logout() {
        await AuthService.logout({
            refreshToken: AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)
        });

        AuthUtils.removeAuthInfo();
        this.openNewRoute('/auth/login');
    }
}