import {ValidationUtils} from "../../utils/validation-utils";
import {ExpenseService} from "../../services/expense-service";
import {ValidationsType} from "../../types/validations.type";
import {ItemCreateType} from "../../types/item-create.type";
import {ItemReturnObjType} from "../../types/item-return-obj.type";

export class ExpenseCreate {
    readonly openNewRoute: (url: string) => Promise<void>;
    readonly expenseCreateInputElement: HTMLElement | null = null;
    readonly validations: ValidationsType[] | null;

    constructor(openNewRoute: (url: string) => Promise<void>) {
        this.openNewRoute = openNewRoute;

        document.getElementById('expenseCreateBtn')?.addEventListener('click', this.createExpense.bind(this));
        this.expenseCreateInputElement = document.getElementById('categoryNameInput');
        this.validations = [{element: this.expenseCreateInputElement as HTMLInputElement}]
    }

    private async createExpense(e: Event): Promise<void> {
        e.preventDefault();

        if (this.validations) {
            if (ValidationUtils.validateForm(this.validations)) {
                const createData: ItemCreateType = {
                    title: (this.expenseCreateInputElement as HTMLInputElement).value,
                }

                const response: ItemReturnObjType = await ExpenseService.createExpense(createData);

                if (response.error && response.message) {
                    alert(response.message);
                    console.log(response.message);
                }

                return this.openNewRoute('/expense');
            }
        }
    }
}