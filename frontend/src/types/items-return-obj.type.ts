import {IdTitleDefaultType} from "./id-title-default.type";

export type ItemsReturnObjType = {
    items: IdTitleDefaultType[],
    error: boolean,
    message: string,
}