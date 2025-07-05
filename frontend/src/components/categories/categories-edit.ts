import {UrlUtils} from "../../utils/url-utils";
import {IncomeService} from "../../services/income-service";
import {OperationService} from "../../services/operation-service";
import {ValidationUtils} from "../../utils/validation-utils";
import {ExpenseService} from "../../services/expense-service";

export class CategoriesEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            return this.openNewRoute('/category');
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

        this.init(id).then();
        this.createBtn.addEventListener('click', this.updateOperation.bind(this));

    }

    async init(id) {
        // Дизейбл первого селекта
        ['click', 'mousedown', 'keydown', 'focus'].forEach(evt => {
            this.categorySelect.addEventListener(evt, e => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        this.operation = await this.getOperation(id);

        // Подсасываем всю инфу данной операции по очерёдности инпутов в форме
        // Доход/расход
        for (let i = 0; i < this.categorySelect.options.length; i++) {
            if (this.categorySelect.options[i].value === this.operation.type) {
                this.categorySelect.selectedIndex = i;
            }
        }

        // Сумма
        this.amountElement.value = this.operation.amount;

        if (this.operation.type.includes('income')) {
            await this.getIncomes().then();
        } else if (this.operation.type.includes('expense')) {
            await this.getExpenses().then();
        }

        // Категория доходов/расходов
        for (let i = 0; i < this.categoryItemSelectElement.options.length; i++) {
            if (this.categoryItemSelectElement.options[i].innerText === this.operation.category) {
                this.categoryItemSelectElement.selectedIndex = i;
            }
        }

        // Дата
        this.dateElement.value = this.operation.date;

        // Комментарий
        this.commentElement.value = this.operation.comment;
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

    async getOperation(id) {
        const response = await OperationService.getOperation(id);

        if (response.error) {
            alert(response.error);
            console.log(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }
        return response.operation;
    }

    async updateOperation(e) {
        e.preventDefault();

        if (ValidationUtils.validateForm(this.validations)) {
            const changedData = {
                type: this.operation.type,
                amount: parseInt(this.operation.amount),
                date: this.operation.date,
                comment: this.operation.comment,
                category_id: parseInt(this.categoryItemSelectElement.value)
            };

            // select
            if (this.categorySelect.value !== this.operation.type) {
                changedData.type = this.categoryItemSelectElement.value;
            }
            if (this.categoryItemSelectElement.options[this.categoryItemSelectElement.selectedIndex].innerText !== this.operation.category) {
                changedData.category_id = parseInt(this.categorySelect.value);
            }
            // amount
            if (parseInt(this.amountElement.value) !== parseInt(this.operation.amount)) {
                changedData.amount = parseInt(this.amountElement.value);
            }
            // calendar  new Date(this.operation.date)
            if (this.dateElement.value !== this.operation.date) {
                changedData.date = this.dateElement.value;
            }
            // comment
            if (this.commentElement.value !== this.operation.comment) {
                changedData.comment = this.commentElement.value;
            }

            if (Object.keys(changedData).length > 0) {
                const response = await OperationService.updateOperation(this.operation.id, changedData);

                if (response.error) {
                    // alert(response.error);
                    // console.log(response.error);
                    return response.redirect ? this.openNewRoute(response.redirect) : this.openNewRoute('/categories');
                }
            }
            return this.openNewRoute('/categories');
        }
    }
}