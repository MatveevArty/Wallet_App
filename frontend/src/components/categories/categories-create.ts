import {UrlUtils} from "../../utils/url-utils";
import {IncomeService} from "../../services/income-service";
import {ExpenseService} from "../../services/expense-service";
import {ValidationUtils} from "../../utils/validation-utils";
import {OperationService} from "../../services/operation-service";
import {ItemsReturnObjType} from "../../types/items-return-obj.type";
import {NewRouteCallbackType} from "../../types/new-route-callback.type";
import {ValidationsType} from "../../types/validations.type";

export class CategoriesCreate {
    readonly openNewRoute: NewRouteCallbackType;
    private categorySelect: HTMLSelectElement | HTMLElement | null;
    private categoryItemSelectElement: HTMLInputElement | HTMLElement | null;
    private amountElement: HTMLInputElement | HTMLElement | null;
    private dateElement: HTMLInputElement | HTMLElement | null;
    private commentElement: HTMLInputElement | HTMLElement | null;
    private createBtn: HTMLButtonElement | HTMLElement | null;
    readonly validations: ValidationsType[] | null;

    constructor(openNewRoute: NewRouteCallbackType) {
        this.openNewRoute = openNewRoute;
        const path = UrlUtils.getUrlParam('category');

        if (!path) {
            this.openNewRoute('/categories').then();
        }

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

        this.createBtn?.addEventListener('click', this.saveOperation.bind(this));

        this.init(path as string);

    }

    private init(path: string): void {
        // Дизейбл первого селекта
        ['click', 'mousedown', 'keydown', 'focus'].forEach(event => {
            this.categorySelect?.addEventListener(event, e => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        // Подсасываем типы категорий и расходов из БД
        for (let i = 0; i < (this.categorySelect as HTMLSelectElement).options.length; i++) {
            if ((this.categorySelect as HTMLSelectElement).options[i].value === path) {
                (this.categorySelect as HTMLSelectElement).selectedIndex = i;
            }
        }
        if (path.includes('income')) {
            this.getIncomes().then();
        } else if (path.includes('expense'))  {
            this.getExpenses().then();
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

    private async saveOperation(e: Event) {
        e.preventDefault();

        if (this.validations) {
            if (ValidationUtils.validateForm(this.validations)) {
                const createData = {
                    type: (this.categorySelect as HTMLSelectElement).value,
                    amount: parseInt((this.amountElement as HTMLInputElement).value),
                    date: (this.dateElement as HTMLInputElement).value,
                    comment: (this.commentElement as HTMLInputElement).value,
                    category_id: parseInt((this.categoryItemSelectElement as HTMLInputElement).value)
                };

                const response = await OperationService.createOperation(createData);

                if (response.error && response.message) {
                    alert(response.message);
                    console.log(response.message);
                }

                return this.openNewRoute('/categories');

            }
        }
    }
}