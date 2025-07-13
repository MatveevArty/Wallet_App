import {IncomeService} from "../../services/income-service";
import {RenderElementUtils} from "../../utils/render-element-utils";
import {IdTitleDefaultType} from "../../types/id-title-default.type";
import {ItemsReturnObjType} from "../../types/items-return-obj.type";

export class IncomeList {
    readonly openNewRoute: (url: string) => Promise<void>;
    readonly incomeListContainer: HTMLElement | null = null;

    constructor(openNewRoute: (url: string) => Promise<void>) {
        this.openNewRoute = openNewRoute;
        this.incomeListContainer = document.getElementById("incomes-container");
        this.getIncomesList().then();
    }

    private async getIncomesList(): Promise<void | null> {
        const response: ItemsReturnObjType = await IncomeService.getIncomes();

        if (response.error && response.message) {
            alert(response.message);
            console.log(response.message);
        }

        if (response.items) {
            return this.showIncomesList(response.items);
        }
    }

    private showIncomesList(incomes: IdTitleDefaultType[]): void {
        if (this.incomeListContainer) {
            for (let i = 0; i < incomes.length; i++) {
                this.incomeListContainer.appendChild(RenderElementUtils.renderElementList(incomes[i], '/income'));
            }
            this.incomeListContainer.appendChild(RenderElementUtils.renderElementAddBtn('/income/create'));

            // Добавляем обработчик для кнопок удаления
            const deleteBtnElements = document.querySelectorAll('[data-bs-target="#deleteModal"]');
            deleteBtnElements.forEach(button => {
                button.addEventListener('click', () => {
                    const incomeId = button.getAttribute('data-id');
                    const confirmBtn = document.getElementById('confirmDeleteBtn');
                    if (confirmBtn && incomeId) {
                        confirmBtn.setAttribute('data-id', incomeId);
                    }
                });
            });

            // Обработчик подтверждения удаления
            const confirmDeleteBtnElement = document.getElementById('confirmDeleteBtn');
            if (confirmDeleteBtnElement) {
                confirmDeleteBtnElement.addEventListener('click', async () => {
                    const confirmBtn = document.getElementById('confirmDeleteBtn')
                    if (confirmBtn) {
                        const incomeId = confirmBtn.getAttribute('data-id');
                        if (incomeId) {
                            const parsedIncomeId = parseInt(incomeId);
                            const response = await IncomeService.deleteIncome(parsedIncomeId);

                            if (response.error && response.message) {
                                alert(response.message);
                                console.log(response.message);
                            }

                            // Обновляем список после удаления
                            if (this.incomeListContainer) {
                                this.incomeListContainer.innerHTML = '';
                                this.openNewRoute('/income').then();
                            }
                        }
                    }
                });
            }
        }
    }
}