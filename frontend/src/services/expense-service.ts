import {HttpUtils} from '../utils/http-utils'

export class ExpenseService {

    static async getExpenses() {
        const returnObject = {
            error: false,
            redirect: null,
            expenses: null,
        }

        const result = await HttpUtils.request('/categories/expense');

        if (!result.response || result.error || result.redirect) {
            returnObject.error = 'Возникла ошибка при запросе расходов';
            if (result.redirect) {
                // Перенаправление пользователя в случае редиректа в ответе запроса
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }
        returnObject.expenses = result.response;
        return returnObject;
    }

    static async getExpense(id) {
        const returnObject = {
            error: false,
            redirect: null,
            expense: null,
        }

        const result = await HttpUtils.request('/categories/expense/' + id);

        if (!result.response || result.error || result.redirect) {
            returnObject.error = 'Возникла ошибка при запросе данного расхода';
            if (result.redirect) {
                // Перенаправление пользователя в случае редиректа в ответе запроса
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }
        returnObject.expense = result.response;
        return returnObject;
    }

    static async createExpense(data) {
        const returnObject = {
            error: false,
            redirect: null,
            id: null
        }

        const result = await HttpUtils.request('/categories/expense', "POST", true, data);

        if (!result.response || result.error || result.redirect) {
            returnObject.error = 'Возникла ошибка при создании данного расхода';
            // Перенаправление пользователя в случае редиректа в ответе запроса
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }
        returnObject.id = result.response.id;
        return returnObject;
    }

    static async updateExpense(id, data) {
        const returnObject = {
            error: false,
            redirect: null,
        }

        const result = await HttpUtils.request('/categories/expense/' + id, "PUT", true, data);

        if (!result.response || result.error || result.redirect) {
            returnObject.error = 'Возникла ошибка при редактировании данного расхода';
            // Перенаправление пользователя в случае редиректа в ответе запроса
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }
        return returnObject;
    }

    static async deleteExpense(id) {
        const returnObject = {
            error: false,
            redirect: null,
        }

        const result = await HttpUtils.request('/categories/expense/' + id, "DELETE");

        if (!result.response || result.error || result.redirect) {
            returnObject.error = 'Возникла ошибка при удалении данного расхода';
            // Перенаправление пользователя в случае редиректа в ответе запроса
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }
        return returnObject;
    }
}