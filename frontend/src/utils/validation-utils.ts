import {ValidationsType} from "../types/validations.type";

export class ValidationUtils {
    public static validateForm(validations: ValidationsType[]): boolean {
        let isValid: boolean = true;

        for (let i = 0; i < validations.length; i++) {
            if (!ValidationUtils.validateField(validations[i])) {
                isValid = false;
            }
        }

        return isValid;
    }

    public static validateField(field: ValidationsType): boolean | undefined {
        if (field.element) {
            let condition: boolean = false;

            if (field.options) {
                if (field.element.value && field.options.pattern) {
                    if (field.element.value.match(field.options.pattern)) {
                        condition = true;
                    }
                } else if (field.options.compareTo) {
                    if (field.element.value && field.element.value === field.options.compareTo) {
                        condition = true;
                    }
                }
            }

            if (condition) {
                field.element.classList.remove('is-invalid');
                return true;
            } else {
                field.element.classList.add('is-invalid');
                return false;
            }
        }
    }
}