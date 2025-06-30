import {HttpUtils} from "../utils/http-utils";

export class BalanceService {

    static async getBalance() {
        const returnObject = {
            error: false,
            redirect: null,
            balance: null,
        };

        const result = await HttpUtils.request('/balance')

        if (!result.response || result.error || result.redirect) {
            returnObject.error = 'Возникла ошибка при запросе баланса';
            // Перенаправление пользователя в случае редиректа в ответе запроса
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }
        returnObject.balance = result.response.balance;
        return returnObject;
    }
}