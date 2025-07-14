import {AuthUtils} from "../utils/auth-utils";
import {OperationService} from "../services/operation-service";
import {IncomeService} from "../services/income-service";
import {ExpenseService} from "../services/expense-service";
import {ItemsReturnObjType} from "../types/items-return-obj.type";
import {DateFilterType} from "../types/date-filter.type";
import {IdTitleDefaultType} from "../types/id-title-default.type";
import {OperationsReturnObjType} from "../types/operations-return-obj.type";
import {OperationType} from "../types/operation.type";
import {NewRouteCallbackType} from "../types/new-route-callback.type";
import {TokenEnum} from "../enums/token.enum";
import {PeriodEnum} from "../enums/period.enum";
import {Chart, registerables} from "chart.js";

export class ChartBuild {
    private readonly openNewRoute: NewRouteCallbackType;
    private incomeChart: Chart | null = null;
    private expenseChart: Chart | null = null;
    private filter: DateFilterType;
    private categories: {
        income: IdTitleDefaultType[];
        expense: IdTitleDefaultType[];
    };
    private intervalButtons: NodeListOf<HTMLButtonElement> | null = null;
    private intervalStartDate: HTMLInputElement | null = null;
    private intervalEndDate: HTMLInputElement | null = null;
    private intervalBtn: HTMLButtonElement | null = null;

    constructor(openNewRoute: NewRouteCallbackType) {
        this.openNewRoute = openNewRoute;
        this.filter = {
            period: PeriodEnum.ALL,
            dateFrom: null,
            dateTo: null
        };
        this.categories = {
            income: [],
            expense: []
        };

        if (!AuthUtils.getAuthInfo(TokenEnum.accessTokenKey)) {
            this.openNewRoute('/login').then();
            return;
        }

        this.initElements();
        this.initCharts();
        this.setupEventListeners();
        this.loadCategories().then(() => this.loadChartData());
    }

    private async loadCategories(): Promise<void> {
        // Загрузка категорий доходов
        const incomeResponse: ItemsReturnObjType = await IncomeService.getIncomes();
        if (!incomeResponse.error && incomeResponse.items) {
            this.categories.income = incomeResponse.items;
        }

        // Загрузка категорий расходов
        const expenseResponse: ItemsReturnObjType = await ExpenseService.getExpenses();
        if (!expenseResponse.error && expenseResponse.items) {
            this.categories.expense = expenseResponse.items;
        }
    }

    private initElements(): void {
        this.intervalButtons = document.querySelectorAll('#interval-settings button');
        this.intervalStartDate = document.getElementById('interval-start-date') as HTMLInputElement;
        this.intervalEndDate = document.getElementById('interval-end-date') as HTMLInputElement;
        this.intervalBtn = document.getElementById('interval-btn') as HTMLButtonElement;
    }

    private initCharts(): void {
        Chart.register(...registerables);

        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context: any) {
                            return `${context.label}: ${context.raw}$`;
                        }
                    }
                }
            }
        };

        // Инициализация пустых графиков
        const incomeCtx = document.getElementById('incomeChart') as HTMLCanvasElement;
        const expenseCtx = document.getElementById('expenseChart') as HTMLCanvasElement;

        this.incomeChart = new Chart(
            incomeCtx,
            {
                type: 'pie',
                data: { labels: [], datasets: [{ data: [], backgroundColor: [] }] },
                options: chartOptions
            }
        );

        this.expenseChart = new Chart(
            expenseCtx,
            {
                type: 'pie',
                data: { labels: [], datasets: [{ data: [], backgroundColor: [] }] },
                options: chartOptions
            }
        );
    }

    private setupEventListeners(): void {
        // Обработчики для кнопок периода
        this.intervalButtons?.forEach(button => {
            button.addEventListener('click', (e: Event) => {
                this.intervalButtons?.forEach(btn => btn.classList.remove('active'));
                (e.target as HTMLButtonElement).classList.add('active');

                const period = (e.target as HTMLButtonElement).textContent?.toLowerCase();
                if (period) {
                    this.filter.period = this.getPeriodValue(period);
                    this.filter.dateFrom = null;
                    this.filter.dateTo = null;

                    if (period === 'интервал') {
                        this.showDateInputs();
                    } else {
                        this.hideDateInputs();
                        this.loadChartData().then();
                    }
                }
            });
        });

        // Обработчики для полей дат
        this.intervalStartDate?.addEventListener('change', () => {
            if (this.intervalStartDate?.value && this.intervalEndDate?.value) {
                this.filter.dateFrom = this.intervalStartDate.value;
                this.filter.dateTo = this.intervalEndDate.value;
                this.loadChartData().then();
            }
        });

        this.intervalEndDate?.addEventListener('change', () => {
            if (this.intervalStartDate?.value && this.intervalEndDate?.value) {
                this.filter.dateFrom = this.intervalStartDate.value;
                this.filter.dateTo = this.intervalEndDate.value;
                this.loadChartData().then();
            }
        });
    }

    private showDateInputs(): void {
        if (!this.intervalStartDate || !this.intervalEndDate) return;

        const startDateLabel = this.intervalStartDate.previousElementSibling;
        const endDateLabel = this.intervalEndDate.previousElementSibling;

        this.intervalStartDate.classList.remove('d-none');
        this.intervalEndDate.classList.remove('d-none');
        startDateLabel?.classList.add('d-none');
        endDateLabel?.classList.add('d-none');
    }

    private hideDateInputs(): void {
        if (!this.intervalStartDate || !this.intervalEndDate) return;

        const startDateLabel = this.intervalStartDate.previousElementSibling;
        const endDateLabel = this.intervalEndDate.previousElementSibling;

        this.intervalStartDate.classList.add('d-none');
        this.intervalEndDate.classList.add('d-none');
        startDateLabel?.classList.remove('d-none');
        endDateLabel?.classList.remove('d-none');
    }

    private getPeriodValue(period: string): PeriodEnum {
        const periods: Record<string, PeriodEnum> = {
            'сегодня': PeriodEnum.TODAY,
            'неделя': PeriodEnum.WEEK,
            'месяц': PeriodEnum.MONTH,
            'год': PeriodEnum.YEAR,
            'все': PeriodEnum.ALL,
            'интервал': PeriodEnum.INTERVAL
        };
        return periods[period] || PeriodEnum.TODAY;
    }

    private async loadChartData(): Promise<void> {
        const response: OperationsReturnObjType = await OperationService.getOperations(this.filter);

        if (response.error && response.message) {
            alert(response.message);
            console.log(response.message);
            return;
        }

        this.processChartData(response.operations);
    }

    private processChartData(operations: OperationType[] | undefined): void {
        if (!operations || operations.length === 0) {
            this.updateChart(this.incomeChart, [], [], []);
            this.updateChart(this.expenseChart, [], [], []);
            this.updateLegend('income', []);
            this.updateLegend('expense', []);
            return;
        }

        const incomeData: Record<string, number> = {};
        const expenseData: Record<string, number> = {};
        const colors = ['#dc3545', '#fd7e14', '#ffc107', '#198754', '#0d6efd', '#6f42c1'];

        operations.forEach(operation => {
            const data = operation.type === 'income' ? incomeData : expenseData;
            if (!data[operation.category]) {
                data[operation.category] = 0;
            }
            data[operation.category] += operation.amount;
        });

        // Получаем названия категорий и цвета
        const incomeCategories = Object.keys(incomeData);
        const expenseCategories = Object.keys(expenseData);

        this.updateChart(
            this.incomeChart,
            incomeCategories,
            Object.values(incomeData),
            colors.slice(0, incomeCategories.length)
        );

        this.updateChart(
            this.expenseChart,
            expenseCategories,
            Object.values(expenseData),
            colors.slice(0, expenseCategories.length)
        );

        // Обновляем легенды
        this.updateLegend('income', incomeCategories);
        this.updateLegend('expense', expenseCategories);
    }

    private updateLegend(type: 'income' | 'expense', categories: string[]): void {
        const chartElement = document.querySelector(`#${type}Chart`);
        if (!chartElement) return;

        const legendContainer = chartElement.closest('.card-body')?.querySelector('.d-flex');
        if (!legendContainer) return;

        legendContainer.innerHTML = '';

        if (categories.length === 0) {
            const noDataElement = document.createElement('div');
            noDataElement.className = 'text-muted small';
            noDataElement.textContent = 'Нет данных';
            legendContainer.appendChild(noDataElement);
            return;
        }

        const colors = ['#dc3545', '#fd7e14', '#ffc107', '#198754', '#0d6efd', '#6f42c1'];

        categories.forEach((category, index) => {
            const categoryInfo = type === 'income'
                ? this.categories.income.find(c => c.title === category)
                : this.categories.expense.find(c => c.title === category);

            const legendItem = document.createElement('div');
            legendItem.className = 'd-flex align-items-center mx-2';

            const colorBox = document.createElement('div');
            colorBox.className = 'me-2';
            colorBox.style.cssText = `width: 35px; height: 10px; background-color: ${colors[index % colors.length]}`;

            const categoryName = document.createElement('span');
            categoryName.className = 'fw-medium small';
            categoryName.textContent = categoryInfo?.title || category;

            legendItem.appendChild(colorBox);
            legendItem.appendChild(categoryName);
            legendContainer.appendChild(legendItem);
        });
    }

    private updateChart(chart: Chart | null, labels: string[], data: number[], colors: string[]): void {
        if (!chart) return;

        chart.data.labels = labels;
        chart.data.datasets[0].data = data;
        chart.data.datasets[0].backgroundColor = colors;
        chart.update();
    }
}