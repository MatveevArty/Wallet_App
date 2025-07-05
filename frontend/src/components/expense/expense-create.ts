import {ValidationUtils} from "../../utils/validation-utils";
import {ExpenseService} from "../../services/expense-service";

export class ExpenseCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        document.getElementById('expenseCreateBtn').addEventListener('click', this.createExpense.bind(this));
        this.expenseCreateInputElement = document.getElementById('categoryNameInput');
        this.validations = [{element: this.expenseCreateInputElement}]
    }

    async createExpense(e) {
        e.preventDefault();

        if (ValidationUtils.validateForm(this.validations)) {
            const createData = {
                title: this.expenseCreateInputElement.value,
            }

            const response = await ExpenseService.createExpense(createData);

            if (response.error) {
                alert(response.error);
                console.log(response.error);
                return response.redirect ? this.openNewRoute(response.redirect) : null;
            }

            return this.openNewRoute('/expense');
        }
    }
}