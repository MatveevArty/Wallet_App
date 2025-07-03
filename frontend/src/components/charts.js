import {AuthUtils} from "../utils/auth-utils";
import {OperationService} from "../services/operation-service";
import {IncomeService} from "../services/income-service";
import {ExpenseService} from "../services/expense-service";

export class ChartBuild {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.incomeChart = null;
        this.expenseChart = null;
        this.filter = {
            period: 'today',
            dateFrom: null,
            dateTo: null
        };
        this.categories = {
            income: [],
            expense: []
        };

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/login');
        }

        this.initElements();
        this.initCharts();
        this.setupEventListeners();
        this.loadCategories().then(() => this.loadChartData());
    }

    async loadCategories() {
        // Загрузка категорий доходов
        const incomeResponse = await IncomeService.getIncomes();
        if (!incomeResponse.error && incomeResponse.incomes) {
            this.categories.income = incomeResponse.incomes;
        }

        // Загрузка категорий расходов
        const expenseResponse = await ExpenseService.getExpenses();
        if (!expenseResponse.error && expenseResponse.expenses) {
            this.categories.expense = expenseResponse.expenses;
        }
    }

    initElements() {
        this.intervalButtons = document.querySelectorAll('#interval-settings button');
        this.intervalStartDate = document.getElementById('interval-start-date');
        this.intervalEndDate = document.getElementById('interval-end-date');
        this.intervalBtn = document.getElementById('interval-btn');
    }

    initCharts() {
        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}$`;
                        }
                    }
                }
            }
        };

        // Инициализация пустых графиков
        this.incomeChart = new Chart(
            document.getElementById('incomeChart'),
            {
                type: 'pie',
                data: { labels: [], datasets: [{ data: [], backgroundColor: [] }] },
                options: chartOptions
            }
        );

        this.expenseChart = new Chart(
            document.getElementById('expenseChart'),
            {
                type: 'pie',
                data: { labels: [], datasets: [{ data: [], backgroundColor: [] }] },
                options: chartOptions
            }
        );
    }

    setupEventListeners() {
        // Обработчики для кнопок периода
        this.intervalButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.intervalButtons.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');

                const period = e.target.textContent.toLowerCase();
                this.filter.period = this.getPeriodValue(period);
                this.filter.dateFrom = null;
                this.filter.dateTo = null;

                if (period === 'интервал') {
                    this.showDateInputs();
                } else {
                    this.hideDateInputs();
                    this.loadChartData().then();
                }
            });
        });

        // Обработчики для полей дат
        this.intervalStartDate.addEventListener('change', () => {
            if (this.intervalStartDate.value && this.intervalEndDate.value) {
                this.filter.dateFrom = this.intervalStartDate.value;
                this.filter.dateTo = this.intervalEndDate.value;
                this.loadChartData().then();
            }
        });

        this.intervalEndDate.addEventListener('change', () => {
            if (this.intervalStartDate.value && this.intervalEndDate.value) {
                this.filter.dateFrom = this.intervalStartDate.value;
                this.filter.dateTo = this.intervalEndDate.value;
                this.loadChartData().then();
            }
        });
    }

    showDateInputs() {
        const startDateLabel = this.intervalStartDate.previousElementSibling;
        const endDateLabel = this.intervalEndDate.previousElementSibling;

        this.intervalStartDate.classList.remove('d-none');
        this.intervalEndDate.classList.remove('d-none');
        startDateLabel.classList.add('d-none');
        endDateLabel.classList.add('d-none');
    }

    hideDateInputs() {
        const startDateLabel = this.intervalStartDate.previousElementSibling;
        const endDateLabel = this.intervalEndDate.previousElementSibling;

        this.intervalStartDate.classList.add('d-none');
        this.intervalEndDate.classList.add('d-none');
        startDateLabel.classList.remove('d-none');
        endDateLabel.classList.remove('d-none');
    }

    getPeriodValue(period) {
        const periods = {
            'сегодня': 'today',
            'неделя': 'week',
            'месяц': 'month',
            'год': 'year',
            'все': 'all',
            'интервал': 'interval'
        };
        return periods[period] || 'today';
    }

    async loadChartData() {
        const response = await OperationService.getOperations(this.filter);

        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        this.processChartData(response.operations);
    }

    processChartData(operations) {
        if (!operations || operations.length === 0) {
            this.updateChart(this.incomeChart, [], [], []);
            this.updateChart(this.expenseChart, [], [], []);
            this.updateLegend('income', []);
            this.updateLegend('expense', []);
            return;
        }

        const incomeData = {};
        const expenseData = {};
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

    updateLegend(type, categories) {
        const legendContainer = document.querySelector(`#${type}Chart`).closest('.card-body').querySelector('.d-flex');
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
            colorBox.style = `width: 35px; height: 10px; background-color: ${colors[index % colors.length]}`;

            const categoryName = document.createElement('span');
            categoryName.className = 'fw-medium small';
            categoryName.textContent = categoryInfo?.title || category;

            legendItem.appendChild(colorBox);
            legendItem.appendChild(categoryName);
            legendContainer.appendChild(legendItem);
        });
    }

    updateChart(chart, labels, data, colors) {
        chart.data.labels = labels;
        chart.data.datasets[0].data = data;
        chart.data.datasets[0].backgroundColor = colors;
        chart.update();
    }
}