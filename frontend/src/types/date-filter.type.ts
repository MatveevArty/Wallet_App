import {PeriodEnum} from "../enums/period.enum";

export type DateFilterType = {
    period: PeriodEnum,
    dateFrom: string | null,
    dateTo: string | null
}