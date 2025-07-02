import {IncomeService} from "../../services/income-service";
import {RenderElementUtils} from "../../utils/render-element-utils";

export class IncomeList {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.incomeListContainer = document.getElementById("incomes-container");
        this.getIncomesList().then();
    }

    async getIncomesList() {
        const response = await IncomeService.getIncomes();

        if (response.error) {
            console.log(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        return this.showIncomesList(response.incomes);
    }

    showIncomesList(incomes) {
        for (let i = 0; i < incomes.length; i++) {
            this.incomeListContainer.appendChild(RenderElementUtils.renderElementList(incomes[i], '/income'));
        }
        this.incomeListContainer.appendChild(RenderElementUtils.renderElementAddBtn('/income/create'));

        // Добавляем обработчик для кнопок удаления
        const deleteBtnElements = document.querySelectorAll('[data-bs-target="#deleteModal"]');
        deleteBtnElements.forEach(button => {
            button.addEventListener('click', () => {
                const incomeId = button.getAttribute('data-id');
                document.getElementById('confirmDeleteBtn').setAttribute('data-id', incomeId);
            });
        });

        // Обработчик подтверждения удаления
        const confirmDeleteBtnElement = document.getElementById('confirmDeleteBtn');
        confirmDeleteBtnElement.addEventListener('click', async () => {
            const incomeId = document.getElementById('confirmDeleteBtn').getAttribute('data-id');
            const response = await IncomeService.deleteIncome(incomeId);

            if (response.error) {
                alert(response.error);
                return response.redirect ? this.openNewRoute(response.redirect) : null;
            }

            // Обновляем список после удаления
            this.incomeListContainer.innerHTML = '';
            this.openNewRoute('/income');
        });
    }
}