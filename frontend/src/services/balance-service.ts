import {HttpUtils} from "../utils/http-utils";
import {BalanceType} from "../types/balance.type";
import {BalanceReturnObjType} from "../types/balance-return-obj.type";
import {BalanceResultType} from "../types/balance-result.type";

export class BalanceService {

    public static async getBalance(): Promise<BalanceType> {
        const returnObject: BalanceReturnObjType = {
            balance: 0,
            error: false,
            message: '',
        };

        const result: BalanceResultType = await HttpUtils.request('/balance');

        if (result.error || !result.response) {
            returnObject.message = 'Возникла ошибка при запросе баланса';
            returnObject.error = true;
            return returnObject;
        }
        returnObject.balance = result.response.balance;
        return returnObject;
    }
}