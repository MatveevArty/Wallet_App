import {OperationType} from "./operation.type";

export type OperationReturnObjType = {
    operation: OperationType;
    error: boolean,
    message: string,
}