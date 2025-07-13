import {AuthUtils} from "../../utils/auth-utils";
import {ValidationUtils} from "../../utils/validation-utils";
import {AuthService} from "../../services/auth-service";
import {ValidationsType} from "../../types/validations.type";
import {TokenEnum} from "../../enums/token.enum";
import {LoginSuccessType} from "../../types/login-success.type";

export class Login {
    readonly openNewRoute: (url: string) => Promise<void>;
    readonly emailElement: HTMLInputElement | HTMLElement | null;
    readonly passwordElement: HTMLInputElement | HTMLElement | null;
    readonly rememberElement: HTMLInputElement | HTMLElement | null;
    readonly commonErrorElement: HTMLElement | null;
    readonly loginBtn: HTMLButtonElement | HTMLElement | null;
    readonly validations: ValidationsType[] | null;

    constructor(openNewRoute: (url: string) => Promise<void>) {
        this.openNewRoute = openNewRoute;
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.rememberElement = document.getElementById('remember');
        this.commonErrorElement = document.getElementById('common-error');
        this.loginBtn = document.getElementById('process-button');
        this.validations = [
            {element: this.passwordElement as HTMLInputElement},
            {element: this.emailElement as HTMLInputElement,
                options: {pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/}},
        ];

        // Запрет на логин, если уже авторизован
        if (AuthUtils.getAuthInfo(TokenEnum.accessTokenKey)) {
            this.openNewRoute('/').then();
            return;
        }

        if (this.loginBtn) {
            this.loginBtn.addEventListener('click', this.login.bind(this));
        }
    }


    private async login(): Promise<void> {

        if (this.commonErrorElement) {
            this.commonErrorElement.style.display = 'none';
        }

        if (this.validations && this.emailElement && this.passwordElement && this.rememberElement) {
            if (ValidationUtils.validateForm(this.validations)) {
                const loginResult = await AuthService.logIn({
                    email: (this.emailElement as HTMLInputElement).value,
                    password: (this.passwordElement as HTMLInputElement).value,
                    rememberMe: (this.rememberElement as HTMLInputElement).checked
                });

                if (loginResult) {
                    AuthUtils.setAuthInfo((loginResult as LoginSuccessType).tokens.accessToken, (loginResult as LoginSuccessType).tokens.refreshToken, {
                        id: (loginResult as LoginSuccessType).user.id,
                        name: (loginResult as LoginSuccessType).user.name + ' ' + (loginResult as LoginSuccessType).user.lastName
                    });

                    return this.openNewRoute('/');
                }
                if (this.commonErrorElement) {
                    this.commonErrorElement.style.display = 'block';
                }
            }
        }
    }
}