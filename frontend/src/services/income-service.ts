import {HttpUtils} from '../utils/http-utils'

export class IncomeService {

    static async getIncomes() {
        const returnObject = {
            error: false,
            redirect: null,
            incomes: null,
        }

        const result = await HttpUtils.request('/categories/income');

        if (!result.response || result.error || result.redirect) {
            returnObject.error = 'Возникла ошибка при запросе доходов';
            if (result.redirect) {
                // Перенаправление пользователя в случае редиректа в ответе запроса
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }
        returnObject.incomes = result.response;
        return returnObject;
    }

    static async getIncome(id) {
        const returnObject = {
            error: false,
            redirect: null,
            income: null,
        }

        const result = await HttpUtils.request('/categories/income/' + id);

        if (!result.response || result.error || result.redirect) {
            returnObject.error = 'Возникла ошибка при запросе данного дохода';
            if (result.redirect) {
                // Перенаправление пользователя в случае редиректа в ответе запроса
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }
        returnObject.income = result.response;
        return returnObject;
    }

    static async createIncome(data) {
        const returnObject = {
            error: false,
            redirect: null,
            id: null
        }

        const result = await HttpUtils.request('/categories/income', "POST", true, data);

        if (!result.response || result.error || result.redirect) {
            returnObject.error = 'Возникла ошибка при создании данного дохода';
            // Перенаправление пользователя в случае редиректа в ответе запроса
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }
        returnObject.id = result.response.id;
        return returnObject;
    }

    static async updateIncome(id, data) {
        const returnObject = {
            error: false,
            redirect: null,
        }

        const result = await HttpUtils.request('/categories/income/' + id, "PUT", true, data);

        if (!result.response || result.error || result.redirect) {
            returnObject.error = 'Возникла ошибка при редактировании данного дохода';
            // Перенаправление пользователя в случае редиректа в ответе запроса
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }
        return returnObject;
    }

    static async deleteIncome(id) {
        const returnObject = {
            error: false,
            redirect: null,
        }

        const result = await HttpUtils.request('/categories/income/' + id, "DELETE");

        if (!result.response || result.error || result.redirect) {
            returnObject.error = 'Возникла ошибка при удалении данного дохода';
            // Перенаправление пользователя в случае редиректа в ответе запроса
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }
        return returnObject;
    }
}