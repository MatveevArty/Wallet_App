import {OperationType} from "./operation.type";

export type OperationsReturnObjType = {
    operations: OperationType[];
    error: boolean,
    message: string,
}