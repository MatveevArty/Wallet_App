import {AuthUtils} from "../utils/auth-utils";

export class ChartBuild {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        // Запрет просмотр главной странице, если нет accessToken в localStorage
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/login');
        }

        this.activateChartsPseudo();
    }


    activateChartsPseudo() {
        // Данные для графиков
        const incomeData = {
            labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
            datasets: [{
                data: [30, 20, 15, 25, 10],
                backgroundColor: [ '#dc3545', '#fd7e14', '#ffc107', '#198754', '#0d6efd'],
                borderWidth: 1
            }]
        };

        const expenseData = {
            labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
            datasets: [{
                data: [25, 15, 30, 10, 20],
                backgroundColor: ['#dc3545', '#fd7e14', '#ffc107', '#198754', '#0d6efd'],
                borderWidth: 1
            }]
        };

        // Настройки графиков
        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        };

        // Инициализация графиков
        new Chart(
            document.getElementById('incomeChart'),
            {
                type: 'pie',
                data: incomeData,
                options: chartOptions
            }
        );
        new Chart(
            document.getElementById('expenseChart'),
            {
                type: 'pie',
                data: expenseData,
                options: chartOptions
            }
        );
    }
}
