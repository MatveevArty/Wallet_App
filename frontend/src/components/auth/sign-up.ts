import {AuthUtils} from "../../utils/auth-utils";
import {ValidationUtils} from "../../utils/validation-utils";
import {AuthService} from "../../services/auth-service";
import {TokenEnum} from "../../enums/token.enum";
import {ValidationsType} from "../../types/validations.type";
import {SignupSuccessType} from "../../types/signup-success.type";
import {LoginSuccessType} from "../../types/login-success.type";

export class SignUp {
    readonly openNewRoute: (url: string) => Promise<void>;
    readonly nameElement: HTMLInputElement | HTMLElement | null;
    readonly lastnameElement: HTMLInputElement | HTMLElement | null;
    readonly emailElement: HTMLInputElement | HTMLElement | null;
    readonly passwordElement: HTMLInputElement | HTMLElement | null;
    readonly passwordRepeatElement: HTMLInputElement | HTMLElement | null;
    readonly commonErrorElement: HTMLElement | null;
    readonly processButton: HTMLButtonElement | HTMLElement | null;
    readonly validations: ValidationsType[] | null;

    constructor(openNewRoute: (url: string) => Promise<void>) {
        this.openNewRoute = openNewRoute;
        this.nameElement = document.getElementById('name');
        this.lastnameElement = document.getElementById('lastname');
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.passwordRepeatElement = document.getElementById('password-repeat');
        this.commonErrorElement = document.getElementById('common-error');
        this.processButton = document.getElementById('process-button');

        this.validations = [
            {element: this.nameElement as HTMLInputElement},
            {element: this.lastnameElement as HTMLInputElement},
            {element: this.emailElement as HTMLInputElement,
                options: {pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/}},
            {element: this.passwordElement as HTMLInputElement,
                options: {pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/}},
            {element: this.passwordRepeatElement as HTMLInputElement,
                options: {compareTo: (this.passwordElement as HTMLInputElement).value}},
        ];

        // Запрет на регистрацию, если авторизован
        if (AuthUtils.getAuthInfo(TokenEnum.accessTokenKey)) {
            this.openNewRoute('/').then();
            return;
        }

        if (this.processButton) {
            this.processButton.addEventListener('click', this.signUp.bind(this));
        }
    }

    async signUp() {

        if (this.commonErrorElement) {
            this.commonErrorElement.style.display = 'none';
        }

        if (this.validations) {
            let passwordInput = this.validations.find(item => item.element === this.passwordRepeatElement);

            if (passwordInput && passwordInput.options && this.passwordElement) {
                passwordInput.options.compareTo = (this.passwordElement as HTMLInputElement).value;

                if (this.validations && this.nameElement && this.lastnameElement
                    && this.emailElement && this.passwordElement && this.passwordRepeatElement) {
                    if (ValidationUtils.validateForm(this.validations)) {
                        const signUpResult = await AuthService.signUp({
                            name: (this.nameElement as HTMLInputElement).value,
                            lastName: (this.lastnameElement as HTMLInputElement).value,
                            email: (this.emailElement as HTMLInputElement).value,
                            password: (this.passwordElement as HTMLInputElement).value,
                            passwordRepeat: (this.passwordRepeatElement as HTMLInputElement).value
                        });

                        // Сразу логиним нового пользователя
                        if (signUpResult) {
                            const loginResult = await AuthService.logIn({
                                email: (signUpResult as SignupSuccessType).user.email,
                                password: (this.passwordElement as HTMLInputElement).value,
                                rememberMe: false
                            });
                            if (loginResult) {
                                AuthUtils.setAuthInfo((loginResult as LoginSuccessType).tokens.accessToken, (loginResult as LoginSuccessType).tokens.refreshToken, {
                                    id: (loginResult as LoginSuccessType).user.id,
                                    name: (loginResult as LoginSuccessType).user.name + ' ' + (loginResult as LoginSuccessType).user.lastName,
                                });
                                return this.openNewRoute('/');
                            }
                        }

                        if (this.commonErrorElement) {
                            this.commonErrorElement.style.display = 'block';
                        }
                    }
                }
            }
        }
    }
}