import {UrlUtils} from "../../utils/url-utils";
import {IncomeService} from "../../services/income-service";
import {ValidationUtils} from "../../utils/validation-utils";

export class IncomeEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            return this.openNewRoute('/');
        }

        document.getElementById('incomeEditBtn').addEventListener('click', this.updateIncome.bind(this));
        this.incomeEditInputElement = document.getElementById('categoryNameInput');

        this.validations = [{element: this.incomeEditInputElement}]
        this.init(id).then();
    }

    async init(id) {
        const incomeData = await this.getIncome(id);
        if (incomeData) {
            this.showIncome(incomeData);
        }
    }

    async getIncome(id) {
        const response = await IncomeService.getIncome(id);

        if (response.error) {
            alert(response.error);
            console.log(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        this.incomeOriginalData = response.income;
        return response.income;
    }

    showIncome(income) {
        this.incomeEditInputElement.value = income.title;
    }

    async updateIncome(e) {
        e.preventDefault();

        if (ValidationUtils.validateForm(this.validations)) {
            const changedData = {};

            if (this.incomeEditInputElement.value !== this.incomeOriginalData.title) {
                changedData.title = this.incomeEditInputElement.value;
            }

            if (Object.keys(changedData).length > 0) {
                const response = await IncomeService.updateIncome(this.incomeOriginalData.id, changedData);

                if (response.error) {
                    alert(response.error);
                    console.log(response.error);
                    return response.redirect ? this.openNewRoute(response.redirect) : null;
                }

                return this.openNewRoute('/income');
            }
        }
    }
}