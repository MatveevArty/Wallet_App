import {UrlUtils} from "../../utils/url-utils";
import {IncomeService} from "../../services/income-service";
import {OperationService} from "../../services/operation-service";
import {ValidationUtils} from "../../utils/validation-utils";
import {ExpenseService} from "../../services/expense-service";
import {ItemsReturnObjType} from "../../types/items-return-obj.type";
import {NewRouteCallbackType} from "../../types/new-route-callback.type";
import {ValidationsType} from "../../types/validations.type";
import {OperationReturnObjType} from "../../types/operation-return-obj.type";
import {OperationType} from "../../types/operation.type";

export class CategoriesEdit {
    readonly openNewRoute: NewRouteCallbackType;
    private categorySelect: HTMLSelectElement | HTMLElement | null;
    private categoryItemSelectElement: HTMLInputElement | HTMLElement | null;
    private amountElement: HTMLInputElement | HTMLElement | null;
    private dateElement: HTMLInputElement | HTMLElement | null;
    private commentElement: HTMLInputElement | HTMLElement | null;
    private createBtn: HTMLButtonElement | HTMLElement | null;
    private operation: OperationType | undefined;
    readonly validations: ValidationsType[] | null;

    constructor(openNewRoute: NewRouteCallbackType) {
        this.openNewRoute = openNewRoute;
        const idString = UrlUtils.getUrlParam('id');

        if (!idString) {
            this.openNewRoute('/category').then();
        }

        const id = parseInt(idString!);

        this.categorySelect = document.getElementById('category-select');
        this.categoryItemSelectElement = document.getElementById('category-item-select');
        this.amountElement = document.getElementById('category-item-sum-input');
        this.dateElement = document.getElementById('category-item-date-input');
        this.commentElement = document.getElementById('category-item-comment-input');
        this.createBtn = document.getElementById('categoryCreateBtn');

        this.validations = [
            {element: this.categoryItemSelectElement as HTMLSelectElement},
            {element: this.amountElement as HTMLInputElement},
            {element: this.dateElement as HTMLInputElement},
            {element: this.commentElement as HTMLInputElement},
        ]

        this.createBtn?.addEventListener('click', this.updateOperation.bind(this));

        this.init(id).then();

    }

    private async init(id: number): Promise<void> {
        // Дизейбл первого селекта
        ['click', 'mousedown', 'keydown', 'focus'].forEach(evt => {
            this.categorySelect?.addEventListener(evt, e => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        this.operation = await this.getOperation(id);

        // Подсасываем всю инфу данной операции по очерёдности инпутов в форме
        // Доход/расход
        for (let i = 0; i < (this.categorySelect as HTMLSelectElement).options.length; i++) {
            if ((this.categorySelect as HTMLSelectElement).options[i].value === this.operation.type) {
                (this.categorySelect as HTMLSelectElement).selectedIndex = i;
            }
        }

        // Сумма
        (this.amountElement as HTMLInputElement).value = this.operation.amount.toString();


        if (this.operation.type.includes('income')) {
            await this.getIncomes().then();
        } else if (this.operation.type.includes('expense')) {
            await this.getExpenses().then();
        }

        // Категория доходов/расходов
        for (let i = 0; i < (this.categoryItemSelectElement as HTMLSelectElement).options.length; i++) {
            if ((this.categoryItemSelectElement as HTMLSelectElement).options[i].innerText === this.operation.category) {
                (this.categoryItemSelectElement as HTMLSelectElement).selectedIndex = i;
            }
        }

        // Дата
        if (this.dateElement) {
            (this.dateElement as HTMLInputElement).value = this.operation.date;
        }

        // Комментарий
        if (this.commentElement) {
            (this.commentElement as HTMLInputElement).value = this.operation.comment;
        }
    }

    private async getIncomes(): Promise<void> {
        const response: ItemsReturnObjType = await IncomeService.getIncomes();

        if (response.error && response.message) {
            alert(response.message);
            console.log(response.message);
        }

        const option0: HTMLOptionElement = new Option("Категория...", "", true, true);
        option0.hidden = true;
        option0.disabled = true;
        this.categoryItemSelectElement?.insertBefore(option0, this.categoryItemSelectElement.firstChild);

        for (let i = 0; i < response.items.length; i++) {
            const option: HTMLOptionElement = document.createElement("option");
            option.value = response.items[i].id.toString();
            option.innerText = response.items[i].title;
            this.categoryItemSelectElement?.appendChild(option);
        }
    }

    private async getExpenses(): Promise<void> {
        const response = await ExpenseService.getExpenses();

        if (response.error && response.message) {
            alert(response.message);
            console.log(response.message);
        }

        const option0: HTMLOptionElement = new Option("Категория...", "", true, true);
        option0.hidden = true;
        option0.disabled = true;
        this.categoryItemSelectElement?.insertBefore(option0, this.categoryItemSelectElement.firstChild);

        for (let i = 0; i < response.items.length; i++) {
            const option: HTMLOptionElement = document.createElement("option");
            option.value = response.items[i].id.toString();
            option.innerText = response.items[i].title;
            this.categoryItemSelectElement?.appendChild(option);
        }
    }

    private async getOperation(id: number): Promise<OperationType> {
        const response: OperationReturnObjType = await OperationService.getOperation(id);

        if (response.error && response.message) {
            alert(response.message);
            console.log(response.message);
        }
        return response.operation;
    }

    private async updateOperation(e:Event) {
        e.preventDefault();

        if (this.validations) {
            if (ValidationUtils.validateForm(this.validations)) {
                const changedData = {
                    type: this.operation?.type,
                    amount: this.operation?.amount,
                    date: this.operation?.date,
                    comment: this.operation?.comment,
                    category_id: parseInt((this.categoryItemSelectElement as HTMLSelectElement).value)
                };

                // select
                if (this.categorySelect && this.operation) {
                    if ((this.categorySelect as HTMLSelectElement).value !== this.operation.type) {
                        changedData.type = (this.categoryItemSelectElement as HTMLSelectElement).value;
                    }
                }

                if (this.categoryItemSelectElement) {
                    if ((this.categoryItemSelectElement as HTMLSelectElement).options[(this.categoryItemSelectElement as HTMLSelectElement).selectedIndex].innerText !== this.operation?.category) {
                        changedData.category_id = parseInt((this.categorySelect as HTMLSelectElement).value);
                    }
                }


                // amount
                if (this.operation) {
                    if ((this.amountElement as HTMLInputElement).value !== this.operation.amount.toString()) {
                        changedData.amount = parseInt((this.amountElement as HTMLInputElement).value);
                    }
                }

                if (this.dateElement && this.operation) {
                    // calendar  new Date(this.operation.date)
                    if ((this.dateElement as HTMLInputElement).value !== this.operation.date) {
                        changedData.date = (this.dateElement as HTMLInputElement).value;
                    }
                }

                // comment
                if (this.commentElement && this.operation) {
                    if ((this.commentElement as HTMLInputElement).value !== this.operation.comment) {
                        changedData.comment = (this.commentElement as HTMLInputElement).value;
                    }
                }


                if (this.operation) {
                    if (Object.keys(changedData).length > 0) {
                        const response = await OperationService.updateOperation(this.operation.id, changedData);

                        if (response.error && response.message) {
                            alert(response.message);
                            console.log(response.message);
                        }
                    }
                    return this.openNewRoute('/categories');
                }
            }
        }
    }
}