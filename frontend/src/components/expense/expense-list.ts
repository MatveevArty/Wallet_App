import {ExpenseService} from "../../services/expense-service";
import {RenderElementUtils} from "../../utils/render-element-utils";

export class ExpenseList {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.expenseListContainer = document.getElementById("expenses-container");
        this.getExpensesList().then();
    }

    async getExpensesList() {
        const response = await ExpenseService.getExpenses();

        if (response.error) {
            console.log(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        return this.showExpensesList(response.expenses);
    }

    showExpensesList(expenses) {
        for (let i = 0; i < expenses.length; i++) {
            this.expenseListContainer.appendChild(RenderElementUtils.renderElementList(expenses[i], '/expense'));
        }
        this.expenseListContainer.appendChild(RenderElementUtils.renderElementAddBtn('/expense/create'));

        // Добавляем обработчик для кнопок удаления
        const deleteBtnElements = document.querySelectorAll('[data-bs-target="#deleteModal"]');
        deleteBtnElements.forEach(button => {
            button.addEventListener('click', () => {
                const expenseId = button.getAttribute('data-id');
                document.getElementById('confirmDeleteBtn').setAttribute('data-id', expenseId);
            });
        });

        // Обработчик подтверждения удаления
        const confirmDeleteBtnElement = document.getElementById('confirmDeleteBtn');
        confirmDeleteBtnElement.addEventListener('click', async () => {
            const expenseId = document.getElementById('confirmDeleteBtn').getAttribute('data-id');
            const response = await ExpenseService.deleteExpense(expenseId);

            if (response.error) {
                alert(response.error);
                return response.redirect ? this.openNewRoute(response.redirect) : null;
            }

            // Обновляем список после удаления
            this.expenseListContainer.innerHTML = '';
            this.openNewRoute('/expense');
        });
    }


}