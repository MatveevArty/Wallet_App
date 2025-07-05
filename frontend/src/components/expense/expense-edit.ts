import {UrlUtils} from "../../utils/url-utils";
import {ExpenseService} from "../../services/expense-service";
import {ValidationUtils} from "../../utils/validation-utils";

export class ExpenseEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            return this.openNewRoute('/');
        }

        document.getElementById('expenseEditBtn').addEventListener('click', this.updateExpense.bind(this));
        this.expenseEditInputElement = document.getElementById('categoryNameInput');

        this.validations = [{element: this.expenseEditInputElement}]
        this.init(id).then();
    }

    async init(id) {
        const expenseData = await this.getExpense(id);
        if (expenseData) {
            this.showExpense(expenseData);
        }
    }

    async getExpense(id) {
        const response = await ExpenseService.getExpense(id);

        if (response.error) {
            alert(response.error);
            console.log(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        this.expenseOriginalData = response.expense;
        return response.expense;
    }

    showExpense(expense) {
        this.expenseEditInputElement.value = expense.title;
    }

    async updateExpense(e) {
        e.preventDefault();

        if (ValidationUtils.validateForm(this.validations)) {
            const changedData = {};

            if (this.expenseEditInputElement.value !== this.expenseOriginalData.title) {
                changedData.title = this.expenseEditInputElement.value;
            }

            if (Object.keys(changedData).length > 0) {
                const response = await ExpenseService.updateExpense(this.expenseOriginalData.id, changedData);

                if (response.error) {
                    alert(response.error);
                    console.log(response.error);
                    return response.redirect ? this.openNewRoute(response.redirect) : null;
                }

                return this.openNewRoute('/expense');
            }
        }
    }

}