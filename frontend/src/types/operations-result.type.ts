import {OperationType} from "./operation.type";

export type OperationsResultType = {
    response: OperationType[],
    error?: boolean,
}