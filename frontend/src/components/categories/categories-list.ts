import {OperationService} from "../../services/operation-service";
import {DateFilterType} from "../../types/date-filter.type";
import {NewRouteCallbackType} from "../../types/new-route-callback.type";
import {OperationType} from "../../types/operation.type";
import {PeriodEnum, PeriodKey, PeriodMap} from "../../enums/period.enum";
import {DateUtils} from "../../utils/date-utils";

export class CategoriesList {
    readonly openNewRoute: NewRouteCallbackType;
    private intervalButtons: NodeListOf<HTMLButtonElement> | HTMLButtonElement | null = null;
    private intervalStartDate: HTMLButtonElement | HTMLElement | null = null;
    private intervalEndDate: HTMLButtonElement| HTMLElement | null = null;
    private intervalBtn: HTMLButtonElement | HTMLElement | null = null;
    readonly filter: DateFilterType | null = null;

    constructor(openNewRoute: NewRouteCallbackType) {
        this.openNewRoute = openNewRoute;
        this.intervalButtons = document.querySelectorAll('#interval-settings button');
        this.intervalStartDate = document.getElementById('interval-start-date');
        this.intervalEndDate = document.getElementById('interval-end-date');
        this.intervalBtn = document.getElementById('interval-btn');

        this.filter = {
            period: PeriodEnum.ALL,
            dateFrom: null,
            dateTo: null
        };

        this.init().then();
    }

    private async init(): Promise<void> {
        // Изначально скрываем инпуты дат
        this.hideDateInputs();

        if (this.intervalButtons) {
            (this.intervalButtons as NodeListOf<HTMLButtonElement>).forEach((button: HTMLButtonElement) => {
                button.addEventListener('click', (e) => this.intervalButtonHandler(e));
            });
        }

        if (this.intervalStartDate) {
            this.intervalStartDate.addEventListener('change', () => this.dateChangeHandler());
        }

        if (this.intervalEndDate) {
            this.intervalEndDate.addEventListener('change', () => this.dateChangeHandler());
        }

        await this.loadOperations();
    }

    private hideDateInputs(): void {
        if (this.intervalStartDate && this.intervalStartDate.previousElementSibling &&
            this.intervalEndDate && this.intervalEndDate.previousElementSibling) {

            const startDateLabel = this.intervalStartDate.previousElementSibling;
            const endDateLabel = this.intervalEndDate.previousElementSibling;

            this.intervalStartDate.classList.add('d-none');
            this.intervalEndDate.classList.add('d-none');
            startDateLabel.classList.remove('d-none');
            endDateLabel.classList.remove('d-none');
        }
    }

    private showDateInputs(): void {
        if (this.intervalStartDate && this.intervalStartDate.previousElementSibling &&
            this.intervalEndDate && this.intervalEndDate.previousElementSibling) {

            const startDateLabel = this.intervalStartDate.previousElementSibling;
            const endDateLabel = this.intervalEndDate.previousElementSibling;

            this.intervalStartDate.classList.remove('d-none');
            this.intervalEndDate.classList.remove('d-none');
            startDateLabel.classList.add('d-none');
            endDateLabel.classList.add('d-none');
        }
    }

    private async loadOperations(): Promise<void> {
        if (this.filter) {
            const response = await OperationService.getOperations(this.filter);

            if (response.error && response.message) {
                alert(response.message);
                console.log(response.message);
            }

            this.renderOperations(response.operations);
        }
    }

    private renderOperations(operations: OperationType[]): void {
        const tbody = document.querySelector('table tbody');

        if (tbody) {
            (tbody as HTMLElement).innerHTML = '';

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
                    if (incomeId) {
                        confirmDeleteBtnElement?.setAttribute('data-id', incomeId);
                    }
                });
            });

            // Обработчик подтверждения удаления
            confirmDeleteBtnElement?.addEventListener('click', async () => {
                const operationId = document.getElementById('confirmDeleteBtn')?.getAttribute('data-id');
                if (operationId) {
                    const response = await OperationService.deleteOperation(parseInt(operationId));

                    if (response.error && response.message) {
                        alert(response.message);
                        console.log(response.message);
                    }

                    // Обновляем список после удаления
                    this.openNewRoute('/categories').then();
                }
            });
        }
    }

    private intervalButtonHandler(e: Event): void {
        if (this.intervalButtons) {
            (this.intervalButtons as NodeListOf<HTMLButtonElement>).forEach(button => {
                button.classList.remove('active');
            });

            if (e && e.target) {
                (e.target as HTMLButtonElement).classList.add('active');

                const period = (e.target as HTMLButtonElement).textContent?.toLowerCase();

                if (this.filter && this.filter.period && period) {
                    this.filter.period = this.getPeriodValue(period);

                    // Сбрасываем даты интервала
                    this.filter.dateFrom = null;
                    this.filter.dateTo = null;

                    if (this.intervalStartDate && this.intervalEndDate) {
                        (this.intervalStartDate as HTMLInputElement).value = '';
                        (this.intervalEndDate as HTMLInputElement).value = '';

                        // Показываем инпуты только для интервала, для остальных скрываем
                        if (period === 'интервал') {
                            this.showDateInputs();
                        } else {
                            this.hideDateInputs();
                        }

                        this.loadOperations().then();
                    }
                }
            }
        }
    }

    private getPeriodValue(period: string): PeriodEnum {
        const periods: PeriodMap = {
            'сегодня': PeriodEnum.TODAY,
            'неделя': PeriodEnum.WEEK,
            'месяц': PeriodEnum.MONTH,
            'год': PeriodEnum.YEAR,
            'все': PeriodEnum.ALL,
            'интервал': PeriodEnum.INTERVAL
        };

        return periods[period as PeriodKey] || PeriodEnum.ALL;
    }

    private dateChangeHandler() {
        if (this.filter && this.intervalStartDate && this.intervalEndDate) {
            if ((this.intervalStartDate as HTMLInputElement).value && (this.intervalEndDate as HTMLInputElement).value) {
                this.filter.period = PeriodEnum.INTERVAL;
                this.filter.dateFrom = (this.intervalStartDate as HTMLInputElement).value;
                this.filter.dateTo = (this.intervalEndDate as HTMLInputElement).value;
                this.loadOperations().then();
            }
        }
    }
}