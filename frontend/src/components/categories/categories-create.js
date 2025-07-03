import {UrlUtils} from "../../utils/url-utils";
import {IncomeService} from "../../services/income-service";
import {ExpenseService} from "../../services/expense-service";
import {ValidationUtils} from "../../utils/validation-utils";
import {OperationService} from "../../services/operation-service";

export class CategoriesCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        const path = UrlUtils.getUrlParam('category');
        if (!path) {
            return this.openNewRoute('/categories');
        }

        this.categorySelect = document.getElementById('category-select');
        this.categoryItemSelectElement = document.getElementById('category-item-select');
        this.amountElement = document.getElementById('category-item-sum-input');
        this.dateElement = document.getElementById('category-item-date-input');
        this.commentElement = document.getElementById('category-item-comment-input');
        this.createBtn = document.getElementById('categoryCreateBtn');

        this.validations = [
            {element: this.categoryItemSelectElement},
            {element: this.amountElement},
            {element: this.dateElement},
            {element: this.commentElement},
        ]

        this.incomeExpensesNewDate = null;
        this.init(path);
        this.createBtn.addEventListener('click', this.saveOperation.bind(this));

    }

    init(path) {
        // Дизейбл первого селекта
        ['click', 'mousedown', 'keydown', 'focus'].forEach(event => {
            this.categorySelect.addEventListener(event, e => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        // Подсасываем типы категорий и расходов из БД
        for (let i = 0; i < this.categorySelect.options.length; i++) {
            if (this.categorySelect.options[i].value === path) {
                this.categorySelect.selectedIndex = i;
            }
        }
        if (path.includes('income')) {
            this.getIncomes().then();
        } else if (path.includes('expense'))  {
            this.getExpenses().then();
        }
    }

    async getIncomes() {
        const response = await IncomeService.getIncomes();

        if (response.error) {
            alert(response.error);
            console.log(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        const option0 = new Option("Категория...", "", true, true);
        option0.hidden = true;
        option0.disabled = true;
        this.categoryItemSelectElement.insertBefore(option0, this.categoryItemSelectElement.firstChild);

        for (let i = 0; i < response.incomes.length; i++) {
            const option = document.createElement("option");
            option.value = response.incomes[i].id;
            option.innerText = response.incomes[i].title;
            this.categoryItemSelectElement.appendChild(option);
        }
    }

    async getExpenses() {
        const response = await ExpenseService.getExpenses();

        if (response.error) {
            alert(response.error);
            console.log(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        const option0 = new Option("Категория...", "", true, true);
        option0.hidden = true;
        option0.disabled = true;
        this.categoryItemSelectElement.insertBefore(option0, this.categoryItemSelectElement.firstChild);

        for (let i = 0; i < response.expenses.length; i++) {
            const option = document.createElement("option");
            option.value = response.expenses[i].id;
            option.innerText = response.expenses[i].title;
            this.categoryItemSelectElement.appendChild(option);
        }
    }

    async saveOperation(e) {
        e.preventDefault();

        if (ValidationUtils.validateForm(this.validations)) {
            const createData = {
                type: this.categorySelect.value,
                amount: this.amountElement.value,
                date: this.dateElement.value,
                comment: this.commentElement.value,
                category_id: parseInt(this.categoryItemSelectElement.value)
            };

            const response = await OperationService.createOperation(createData);

            if (response.error) {
                alert(response.error);
                console.log(response.error);
                return response.redirect ? this.openNewRoute(response.redirect) : null;
            }

            return this.openNewRoute('/categories');

        }
    }

}