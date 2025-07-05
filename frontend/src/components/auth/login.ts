import {AuthUtils} from "../../utils/auth-utils";
import {ValidationUtils} from "../../utils/validation-utils";
import {AuthService} from "../../services/auth-service";
import {ValidationsType} from "../../types/validations.type";

export class Login {
    private readonly openNewRoute: (url: string) => Promise<void>;
    readonly emailElement: HTMLInputElement | HTMLElement | null;
    readonly passwordElement: HTMLInputElement | HTMLElement | null;
    private rememberElement: HTMLInputElement | HTMLElement | null;
    private commonErrorElement: HTMLElement | null;
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
            {element: this.passwordElement},
            {element: this.emailElement, options: {pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/}},
        ];

        // Запрет на логин, если уже авторизован
        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/').then();
            return;
        }

        if (this.loginBtn) {
            this.loginBtn.addEventListener('click', this.login.bind(this));
        }
    }


    async login() {

        if (this.commonErrorElement) {
            this.commonErrorElement.style.display = 'none';
        }

        if (this.validations) {
            if (ValidationUtils.validateForm(this.validations)) {
                const loginResult = await AuthService.logIn({
                    email: this.emailElement.value,
                    password: this.passwordElement.value,
                    rememberMe: this.rememberElement.checked
                });

                if (loginResult) {
                    AuthUtils.setAuthInfo(loginResult.tokens.accessToken, loginResult.tokens.refreshToken, {
                        id: loginResult.id,
                        name: loginResult.user.name + ' ' + loginResult.user.lastName
                    });

                    return this.openNewRoute('/');
                }

                this.commonErrorElement.style.display = 'block';
            }
        }
    }
}