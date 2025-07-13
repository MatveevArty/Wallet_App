import {HttpUtils} from '../utils/http-utils'
import {HttpMethodEnum} from "../enums/http-method.enum";
import {DeleteResultType} from "../types/delete-result.type";
import {DefaultErrorType} from "../types/default-error.type";
import {ItemCreateType} from "../types/item-create.type";
import {ItemResultType} from "../types/item-result.type";
import {ItemReturnObjType} from "../types/item-return-obj.type";
import {ItemsResultType} from "../types/items-result.type";
import {ItemsReturnObjType} from "../types/items-return-obj.type";

export class ExpenseService {

    public static async getExpenses(): Promise<ItemsReturnObjType> {
        const returnObject: ItemsReturnObjType = {
            items: [],
            error: false,
            message: '',
        }

        const result: ItemsResultType = await HttpUtils.request('/categories/expense');

        if (result.error || !result.response) {
            returnObject.message = 'Возникла ошибка при запросе расходов';
            returnObject.error = true;
            return returnObject;
        }
        returnObject.items = result.response;
        return returnObject;
    }

    public static async getExpense(id: number): Promise<ItemReturnObjType> {
        const returnObject: ItemReturnObjType = {
            item: {
                id: -1,
                title: ""
            },
            error: false,
            message: '',
        }

        const result: ItemResultType = await HttpUtils.request('/categories/expense/' + id);

        if (result.error || !result.response) {
            returnObject.message = 'Возникла ошибка при запросе данного расхода';
            returnObject.error = true;
            return returnObject;
        }
        returnObject.item = result.response;
        return returnObject;
    }

    public static async createExpense(data: ItemCreateType): Promise<ItemReturnObjType> {
        const returnObject: ItemReturnObjType = {
            item: {
                id: -1,
                title: ""
            },
            error: false,
            message: '',
        }

        const result: ItemResultType= await HttpUtils.request('/categories/expense', HttpMethodEnum.post, true, data);

        if (result.error || !result.response) {
            returnObject.message = 'Возникла ошибка при создании данного расхода';
            returnObject.error = true;
            return returnObject;
        }

        returnObject.item = result.response;
        return returnObject;
    }

    public static async updateExpense(id: number, data: ItemCreateType): Promise<ItemReturnObjType> {
        const returnObject: ItemReturnObjType = {
            item: {
                id: -1,
                title: ""
            },
            error: false,
            message: '',
        }

        const result: ItemResultType = await HttpUtils.request('/categories/expense/' + id, HttpMethodEnum.put, true, data);

        if (result.error || !result.response) {
            returnObject.message = 'Возникла ошибка при редактировании данного расхода';
            returnObject.error = true;
            return returnObject;
        }
        return returnObject;
    }

    public static async deleteExpense(id: number): Promise<DefaultErrorType> {
        const returnObject: DefaultErrorType = {
            error: false,
            message: '',
        }

        const result: DeleteResultType = await HttpUtils.request('/categories/expense/' + id, HttpMethodEnum.delete);

        if (result.error || !result.response) {
            returnObject.message = 'Возникла ошибка при удалении данного расхода';
            returnObject.error = true;
            return returnObject;
        }
        return returnObject;
    }
}