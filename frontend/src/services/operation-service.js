import {HttpUtils} from "../utils/http-utils";

export class OperationService {

    static async getOperations(filter) {
        const returnObject = {
            error: false,
            redirect: null,
            operations: null
        };

        const { period, dateFrom, dateTo } = filter;
        const result = await HttpUtils.request(dateFrom && dateTo ?
            '/operations?period=' + period + '&dateFrom=' + dateFrom + '&dateTo=' + dateTo :
            '/operations?period=' + period);

        if (!result.response || result.error || result.redirect) {
            returnObject.error = 'Возникла ошибка при запросе операций';
            if (result.redirect) {
                // Перенаправление пользователя в случае редиректа в ответе запроса
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }
        returnObject.operations = result.response;
        return returnObject;
    }

    static async getOperation(id) {
        const returnObject = {
            error: false,
            redirect: null,
            operation: null
        }

        const result = await HttpUtils.request('/operations/' + id);

        if (!result.response || result.error || result.redirect) {
            returnObject.error = 'Возникла ошибка при запросе данной операции';
            if (result.redirect) {
                // Перенаправление пользователя в случае редиректа в ответе запроса
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }
        returnObject.operation = result.response;
        return returnObject;
    }

    static async createOperation(data) {
        const returnObject = {
            error: false,
            redirect: null,
            id: null
        }

        const result = await HttpUtils.request('/operations', "POST", true, data);

        if (!result.response || result.error || result.redirect) {
            returnObject.error = 'Возникла ошибка при создании данной операции';
            if (result.redirect) {
                // Перенаправление пользователя в случае редиректа в ответе запроса
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }
        returnObject.id = result.response.id;
        return returnObject;
    }

    static async updateOperation(id, data) {
        const returnObject = {
            error: false,
            redirect: null,
        }

        const result = HttpUtils.request('/operations/' + id, "PUT", true, data);

        if (!result.response || result.error || result.redirect) {
            returnObject.error = 'Возникла ошибка при редактировании данной операции';
            // Перенаправление пользователя в случае редиректа в ответе запроса
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }
        return returnObject;
    }

    static async deleteOperation(id) {
        const returnObject = {
            error: false,
            redirect: null,
        }

        const result = await HttpUtils.request('/operations/' + id, "DELETE");

        if (!result.response || result.error || result.redirect) {
            returnObject.error = 'Возникла ошибка при удалении данной операции';
            // Перенаправление пользователя в случае редиректа в ответе запроса
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }
        return returnObject;
    }
}