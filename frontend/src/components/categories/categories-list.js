import {OperationService} from "../../services/operation-service.js";
import {DateUtils} from "../../utils/date-utils.js";

export class CategoriesList {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.intervalButtons = null;
        this.intervalStartDate = null;
        this.intervalEndDate = null;
        this.intervalBtn = null;

        this.filter = {
            period: 'all',
            dateFrom: null,
            dateTo: null
        };

        this.init().then();
    }

    async init() {
        this.intervalButtons = document.querySelectorAll('#interval-settings button');
        this.intervalStartDate = document.getElementById('interval-start-date');
        this.intervalEndDate = document.getElementById('interval-end-date');
        this.intervalBtn = document.getElementById('interval-btn');

        // Изначально скрываем инпуты дат
        this.hideDateInputs();

        this.intervalButtons.forEach(button => {
            button.addEventListener('click', (e) => this.intervalButtonHandler(e));
        });

        this.intervalStartDate.addEventListener('change', () => this.dateChangeHandler());
        this.intervalEndDate.addEventListener('change', () => this.dateChangeHandler());

        await this.loadOperations();
    }

    hideDateInputs() {
        const startDateLabel = this.intervalStartDate.previousElementSibling;
        const endDateLabel = this.intervalEndDate.previousElementSibling;

        this.intervalStartDate.classList.add('d-none');
        this.intervalEndDate.classList.add('d-none');
        startDateLabel.classList.remove('d-none');
        endDateLabel.classList.remove('d-none');
    }

    showDateInputs() {
        const startDateLabel = this.intervalStartDate.previousElementSibling;
        const endDateLabel = this.intervalEndDate.previousElementSibling;

        this.intervalStartDate.classList.remove('d-none');
        this.intervalEndDate.classList.remove('d-none');
        startDateLabel.classList.add('d-none');
        endDateLabel.classList.add('d-none');
    }

    async loadOperations() {
        const response = await OperationService.getOperations(this.filter);

        if (response.error) {
            alert(response.error);
            return;
        }

        if (response.redirect) {
            return this.openNewRoute(response.redirect);
        }

        this.renderOperations(response.operations);
    }

    renderOperations(operations) {
        const tbody = document.querySelector('table tbody');
        tbody.innerHTML = '';

        if (!operations || operations.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = '<td colspan="7">Нет операций</td>';
            tbody.appendChild(tr);
            return;
        }

        operations.forEach((operation, index) => {
            const tr = document.createElement('tr');

            const date = new Date(operation.date);
            const formattedDate = DateUtils.formatDateToString(date);

            const type = operation.type === 'income' ?
                '<span class="text-success">доход</span>' :
                '<span class="text-danger">расход</span>';

            tr.innerHTML = `
                <td class="fw-bold">${index + 1}</td>
                <td>${type}</td>
                <td>${operation.category}</td>
                <td>${operation.amount}$</td>
                <td>${formattedDate}</td>
                <td>${operation.comment || ''}</td>
                <td class="text-end">
                    <button class="btn btn-sm text-dark" data-id="${operation.id}" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                    <a href="/categories/edit?id=${operation.id}" class="btn btn-sm text-dark me-1">
                        <i class="fa-solid fa-pencil"></i>
                    </a>
                </td>
            `;

            tbody.appendChild(tr);
        });

        // Добавляем обработчик для кнопок удаления
        const deleteBtnElements = document.querySelectorAll('[data-bs-toggle="modal"]');
        const confirmDeleteBtnElement = document.getElementById('confirmDeleteBtn');
        deleteBtnElements.forEach(button => {
            button.addEventListener('click', () => {
                const incomeId = button.getAttribute('data-id');
                confirmDeleteBtnElement.setAttribute('data-id', incomeId);
            });
        });

        // Обработчик подтверждения удаления
        confirmDeleteBtnElement.addEventListener('click', async () => {
            const operationId = document.getElementById('confirmDeleteBtn').getAttribute('data-id');
            const response = await OperationService.deleteOperation(operationId);

            if (response.error) {
                // alert(response.error);
                return response.redirect ? this.openNewRoute(response.redirect) : null;
            }

            // Обновляем список после удаления
            this.openNewRoute('/categories');
        });
    }

    intervalButtonHandler(e) {
        this.intervalButtons.forEach(button => {
            button.classList.remove('active');
        });

        e.target.classList.add('active');

        const period = e.target.textContent.toLowerCase();
        this.filter.period = this.getPeriodValue(period);

        // Сбрасываем даты интервала
        this.filter.dateFrom = null;
        this.filter.dateTo = null;
        this.intervalStartDate.value = '';
        this.intervalEndDate.value = '';

        // Показываем инпуты только для интервала, для остальных скрываем
        if (period === 'интервал') {
            this.showDateInputs();
        } else {
            this.hideDateInputs();
        }

        this.loadOperations().then();
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

        return periods[period] || 'all';
    }

    dateChangeHandler() {
        if (this.intervalStartDate.value && this.intervalEndDate.value) {
            this.filter.period = 'interval';
            this.filter.dateFrom = this.intervalStartDate.value;
            this.filter.dateTo = this.intervalEndDate.value;
            this.loadOperations().then();
        }
    }

    prepareDeleteOperation(id) {
        const confirmButton = document.querySelector('#staticBackdrop .btn-danger');
        const newConfirmButton = confirmButton.cloneNode(true);
        confirmButton.parentNode.replaceChild(newConfirmButton, confirmButton);

        newConfirmButton.addEventListener('click', async () => {
            const response = await OperationService.deleteOperation(id);

            if (response.error) {
                alert(response.error);
                return;
            }

            if (response.redirect) {
                return this.openNewRoute(response.redirect);
            }

            const modal = bootstrap.Modal.getInstance(document.getElementById('staticBackdrop'));
            modal.hide();

            await this.loadOperations();
        });
    }
}