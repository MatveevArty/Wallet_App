import {HttpUtils} from '../utils/http-utils'
import {HttpMethodEnum} from "../enums/http-method.enum";
import {DeleteResultType} from "../types/delete-result.type";
import {DefaultErrorType} from "../types/default-error.type";
import {ItemCreateType} from "../types/item-create.type";
import {ItemResultType} from "../types/item-result.type";
import {ItemReturnObjType} from "../types/item-return-obj.type";
import {ItemsResultType} from "../types/items-result.type";
import {ItemsReturnObjType} from "../types/items-return-obj.type";

export class IncomeService {

    public static async getIncomes(): Promise<ItemsReturnObjType> {
        const returnObject: ItemsReturnObjType = {
            items: [],
            error: false,
            message: '',
        }

        const result: ItemsResultType = await HttpUtils.request('/categories/income');

        if (result.error || !result.response) {
            returnObject.message = 'Возникла ошибка при запросе доходов';
            returnObject.error = true;
            return returnObject;
        }
        returnObject.items = result.response;
        return returnObject;
    }

    public static async getIncome(id: number): Promise<ItemReturnObjType> {
        const returnObject: ItemReturnObjType = {
            item: {
                id: -1,
                title: ""
            },
            error: false,
            message: '',
        }

        const result: ItemResultType = await HttpUtils.request('/categories/income/' + id);

        if (result.error || !result.response) {
            returnObject.message = 'Возникла ошибка при запросе данного дохода';
            returnObject.error = true;
            return returnObject;
        }
        returnObject.item = result.response;
        return returnObject;
    }

    static async createIncome(data: ItemCreateType): Promise<ItemReturnObjType> {
        const returnObject: ItemReturnObjType = {
            item: {
                id: -1,
                title: ""
            },
            error: false,
            message: '',
        }

        const result: ItemResultType = await HttpUtils.request('/categories/income', HttpMethodEnum.post, true, data);

        if (result.error || !result.response) {
            returnObject.message = 'Возникла ошибка при создании данного дохода';
            returnObject.error = true;
            return returnObject;
        }
        returnObject.item = result.response;
        return returnObject;
    }

    static async updateIncome(id: number, data: ItemCreateType): Promise<ItemReturnObjType> {
        const returnObject: ItemReturnObjType = {
            item: {
                id: -1,
                title: ""
            },
            error: false,
            message: '',
        }

        const result: ItemResultType = await HttpUtils.request('/categories/income/' + id, HttpMethodEnum.put, true, data);

        if (result.error || !result.response) {
            returnObject.message = 'Возникла ошибка при редактировании данного дохода';
            returnObject.error = true;
            return returnObject;
        }
        return returnObject;
    }

    static async deleteIncome(id: number): Promise<DefaultErrorType> {
        const returnObject: DefaultErrorType = {
            error: false,
            message: '',
        }

        const result: DeleteResultType = await HttpUtils.request('/categories/income/' + id, HttpMethodEnum.delete);

        if (result.error || !result.response) {
            returnObject.message = 'Возникла ошибка при удалении данного дохода';
            returnObject.error = true;
            return returnObject;
        }
        return returnObject;
    }
}