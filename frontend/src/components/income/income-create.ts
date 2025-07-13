import {ValidationUtils} from "../../utils/validation-utils";
import {IncomeService} from "../../services/income-service";
import {ValidationsType} from "../../types/validations.type";
import {ItemCreateType} from "../../types/item-create.type";
import {ItemReturnObjType} from "../../types/item-return-obj.type";
import {NewRouteCallbackType} from "../../types/new-route-callback.type";

export class IncomeCreate {
    readonly openNewRoute: NewRouteCallbackType;
    readonly incomeCreateInputElement: HTMLElement | null = null;
    readonly validations: ValidationsType[] | null;

    constructor(openNewRoute: NewRouteCallbackType) {
        this.openNewRoute = openNewRoute;

        document.getElementById('incomeCreateBtn')?.addEventListener('click', this.createIncome.bind(this));
        this.incomeCreateInputElement = document.getElementById('categoryNameInput');
        this.validations = [{element: this.incomeCreateInputElement as HTMLInputElement}]
    }

    private async createIncome(e: Event): Promise<void> {
        e.preventDefault();

        if (this.validations) {
            if (ValidationUtils.validateForm(this.validations)) {
                const createData = {
                    title: (this.incomeCreateInputElement as HTMLInputElement).value,
                }

                const response: ItemReturnObjType = await IncomeService.createIncome(createData);

                if (response.error && response.message) {
                    alert(response.message);
                    console.log(response.message);
                }

                return this.openNewRoute('/income');
            }
        }
    }
}