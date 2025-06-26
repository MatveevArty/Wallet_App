import {AuthUtils} from "../../utils/auth-utils";
import {ValidationUtils} from "../../utils/validation-utils";
import {AuthService} from "../../services/auth-service";

export class SignUp {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        // Запрет на регистрацию, если авторизован
        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/');
        }

        this.findElements();

        this.validations = [
            {element: this.nameElement},
            {element: this.lastnameElement},
            {element: this.emailElement, options: {pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/}},
            {element: this.passwordElement, options: {pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/}},
            {element: this.passwordRepeatElement, options: {compareTo: this.passwordElement.value}},
        ];

        this.formElement.addEventListener('submit', this.signUp.bind(this));
    }

    findElements() {
        this.formElement = document.getElementById('signup-form');
        this.nameElement = document.getElementById('name');
        this.lastnameElement = document.getElementById('lastname');
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.passwordRepeatElement = document.getElementById('password-repeat');
        this.commonErrorElement = document.getElementById('common-error');
    }

    async signUp() {

        this.commonErrorElement.style.display = 'none';

        let passwordInput = this.validations.find(item => item.element === this.passwordRepeatElement);
        passwordInput.options.compareTo = this.passwordElement.value;

        if (ValidationUtils.validateForm(this.validations)) {
            const signUpResult = await AuthService.signUp({
                name: this.nameElement.value,
                lastName: this.lastnameElement.value,
                email: this.emailElement.value,
                password: this.passwordElement.value,
                passwordRepeat: this.passwordRepeatElement.value
            });

            if (signUpResult) {
                const loginResult = await AuthService.logIn({
                    email: signUpResult.user.email,
                    password: this.passwordElement.value,
                    rememberMe: false
                });
                if (loginResult) {
                    AuthUtils.setAuthInfo(loginResult.tokens.accessToken, loginResult.tokens.refreshToken, {
                        id: loginResult.user.id,
                        name: loginResult.user.name + ' ' + loginResult.user.lastName,
                    });
                    return this.openNewRoute('/');
                }
            }

            this.commonErrorElement.style.display = 'block';
        }
    }
}