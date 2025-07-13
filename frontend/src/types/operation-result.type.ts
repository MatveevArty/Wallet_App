import {OperationType} from "./operation.type";

export type OperationResultType = {
    response: OperationType,
    error?: boolean,
}