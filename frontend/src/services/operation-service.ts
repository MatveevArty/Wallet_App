import {HttpUtils} from "../utils/http-utils";
import {DateFilterType} from "../types/date-filter.type";
import {OperationsReturnObjType} from "../types/operations-return-obj.type";
import {OperationsResultType} from "../types/operations-result.type";
import {OperationReturnObjType} from "../types/operation-return-obj.type";
import {OperationResultType} from "../types/operation-result.type";
import {OperationCreateType} from "../types/operation-create.type";
import {HttpMethodEnum} from "../enums/http-method.enum";
import {DefaultErrorType} from "../types/default-error.type";
import {DeleteResultType} from "../types/delete-result.type";

export class OperationService {

    public static async getOperations(filter: DateFilterType): Promise<OperationsReturnObjType> {
        const returnObject: OperationsReturnObjType = {
            operations: [],
            error: false,
            message: '',
        };

        const { period, dateFrom, dateTo } = filter;
        const result: OperationsResultType = await HttpUtils.request(dateFrom && dateTo ?
            '/operations?period=' + period + '&dateFrom=' + dateFrom + '&dateTo=' + dateTo :
            '/operations?period=' + period);

        if (result.error || !result.response) {
            returnObject.message = 'Возникла ошибка при запросе операций';
            returnObject.error = true;
            return returnObject;
        }
        returnObject.operations = result.response;
        return returnObject;
    }

    public static async getOperation(id: number): Promise<OperationReturnObjType> {
        const returnObject: OperationReturnObjType = {
            operation: {
                id: -1,
                type: "",
                amount: 0,
                date: "",
                comment: "",
                category: "",
            },
            error: false,
            message: '',
        }

        const result: OperationResultType = await HttpUtils.request('/operations/' + id);

        if (result.error || !result.response) {
            returnObject.message = 'Возникла ошибка при запросе данной операции';
            returnObject.error = true;
            return returnObject;
        }
        returnObject.operation = result.response;
        return returnObject;
    }

    public static async createOperation(data: OperationCreateType): Promise<DefaultErrorType> {
        const returnObject: DefaultErrorType = {
            error: false,
            message: '',
        }

        const result: OperationResultType = await HttpUtils.request('/operations', HttpMethodEnum.post, true, data);

        if (result.error || !result.response) {
            returnObject.message = 'Возникла ошибка при создании данной операции';
            returnObject.error = true;
            return returnObject;
        }
        return returnObject;
    }

    public static async updateOperation(id: number, data: OperationCreateType): Promise<DefaultErrorType> {
        const returnObject: DefaultErrorType = {
            error: false,
            message: '',
        }

        const result: OperationResultType = await HttpUtils.request('/operations/' + id, HttpMethodEnum.post, true, data);

        if (result.error || !result.response) {
            returnObject.message = 'Возникла ошибка при редактировании данной операции';
            returnObject.error = true;
            return returnObject;
        }
        return returnObject;
    }

    static async deleteOperation(id: number): Promise<DefaultErrorType> {
        const returnObject: DefaultErrorType = {
            error: false,
            message: '',
        }

        const result: DeleteResultType = await HttpUtils.request('/operations/' + id, HttpMethodEnum.delete);

        if (result.error || !result.response) {
            returnObject.message = 'Возникла ошибка при удалении данной операции';
            returnObject.error = true;
            return returnObject;
        }
        return returnObject;
    }
}