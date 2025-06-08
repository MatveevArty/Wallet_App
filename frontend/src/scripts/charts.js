document.addEventListener('DOMContentLoaded', function() {
    // Данные для графиков
    const incomeData = {
        labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
        datasets: [{
            data: [30, 20, 15, 25, 10],
            backgroundColor: [
                '#dc3545', // Red
                '#fd7e14', // Orange
                '#ffc107', // Yellow
                '#198754', // Green
                '#0d6efd'  // Blue
            ],
            borderWidth: 1
        }]
    };

    const expenseData = {
        labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
        datasets: [{
            data: [25, 15, 30, 10, 20],
            backgroundColor: [
                '#dc3545', // Red
                '#fd7e14', // Orange
                '#ffc107', // Yellow
                '#198754', // Green
                '#0d6efd'  // Blue
            ],
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
});