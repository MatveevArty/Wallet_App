import {HttpUtils} from "../utils/http-utils";
import {BalanceType} from "../types/balance.type";
import {DefaultErrorType} from "../types/default-error.type";

export class BalanceService {

    public static async getBalance(): Promise<BalanceType> {
        const returnObject = {
            error: false,
            message: '',
            balance: 0,
        };

        const result: BalanceType | DefaultErrorType = await HttpUtils.request('/balance');

        if (result && ((result as DefaultErrorType).error || (result as DefaultErrorType).message)) {
            returnObject.message = 'Возникла ошибка при запросе баланса';
            returnObject.error = true;
            return returnObject;
        }
        returnObject.balance = (result as BalanceType).balance;
        return returnObject;
    }
}