export enum PeriodEnum {
    TODAY = 'today',
    WEEK = 'week',
    MONTH = 'month',
    YEAR = 'year',
    ALL = 'all',
    INTERVAL = 'interval'
}

export type PeriodKey = 'сегодня' | 'неделя' | 'месяц' | 'год' | 'все' | 'интервал';

export type PeriodMap = {
    [key in PeriodKey]: PeriodEnum;
};