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
        this.incomeListContainer.appendChild(RenderElementUtils.renderElementAddBtn('/income/create'))
    }
}