import {ExpenseService} from "../../services/expense-service";
import {RenderElementUtils} from "../../utils/render-element-utils";
import {IdTitleDefaultType} from "../../types/id-title-default.type";
import {ItemsReturnObjType} from "../../types/items-return-obj.type";
import {DefaultErrorType} from "../../types/default-error.type";

export class ExpenseList {
    readonly openNewRoute: (url: string) => Promise<void>;
    readonly expenseListContainer: HTMLElement | null = null;

    constructor(openNewRoute: (url: string) => Promise<void>) {
        this.openNewRoute = openNewRoute;
        this.expenseListContainer = document.getElementById("expenses-container");
        this.getExpensesList().then();
    }

    private async getExpensesList(): Promise<void | null> {
        const response: ItemsReturnObjType = await ExpenseService.getExpenses();

        if (response.error && response.message) {
            alert(response.message);
            console.log(response.message);
        }

        if (response.items) {
            return this.showExpensesList(response.items);
        }
    }

    private showExpensesList(expenses: IdTitleDefaultType[]): void {
        if (this.expenseListContainer) {
            for (let i = 0; i < expenses.length; i++) {
                this.expenseListContainer.appendChild(RenderElementUtils.renderElementList(expenses[i], '/expense'));
            }
            this.expenseListContainer.appendChild(RenderElementUtils.renderElementAddBtn('/expense/create'));

            // Добавляем обработчик для кнопок удаления
            const deleteBtnElements: NodeListOf<Element> = document.querySelectorAll('[data-bs-target="#deleteModal"]');
            deleteBtnElements.forEach(button => {
                button.addEventListener('click', () => {
                    const expenseId = button.getAttribute('data-id');
                    const confirmBtn = document.getElementById('confirmDeleteBtn');
                    if (confirmBtn && expenseId) {
                        confirmBtn.setAttribute('data-id', expenseId);
                    }
                });
            });

            // Обработчик подтверждения удаления
            const confirmDeleteBtnElement = document.getElementById('confirmDeleteBtn');
            if (confirmDeleteBtnElement) {
                confirmDeleteBtnElement.addEventListener('click', async () => {
                    const confirmBtn = document.getElementById('confirmDeleteBtn');
                    if (confirmBtn) {
                        const expenseId = confirmBtn.getAttribute('data-id');
                        if (expenseId) {
                            const parsedExpenseId = parseInt(expenseId);
                            const response: DefaultErrorType = await ExpenseService.deleteExpense(parsedExpenseId);

                            if (response.error && response.message) {
                                alert(response.message);
                                console.log(response.message);
                            }
                            // Обновляем список после удаления
                            if (this.expenseListContainer) {
                                this.expenseListContainer.innerHTML = '';
                                this.openNewRoute('/expense').then();
                            }
                        }
                    }
                });
            }
        }
    }
}