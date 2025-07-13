import {IdTitleDefaultType} from "./id-title-default.type";

export type IncomesListType = {
    incomes: IdTitleDefaultType[] | [];
    error?: boolean,
    message?: string,
}