import {UrlUtils} from "../../utils/url-utils";
import {ExpenseService} from "../../services/expense-service";
import {ValidationUtils} from "../../utils/validation-utils";
import {ValidationsType} from "../../types/validations.type";
import {IdTitleDefaultType} from "../../types/id-title-default.type";
import {ItemCreateType} from "../../types/item-create.type";
import {ItemReturnObjType} from "../../types/item-return-obj.type";

export class ExpenseEdit {
    readonly openNewRoute: (url: string) => Promise<void>;
    readonly expenseEditInputElement: HTMLElement | null = null;
    readonly validations: ValidationsType[] | null;
    private expenseOriginalData: IdTitleDefaultType | null = null;

    constructor(openNewRoute: (url: string) => Promise<void>) {
        this.openNewRoute = openNewRoute;
        const idString = UrlUtils.getUrlParam('id');

        if (!idString) {
            this.openNewRoute('/').then();
        }

        const id = parseInt(idString!);

        document.getElementById('expenseEditBtn')?.addEventListener('click', this.updateExpense.bind(this));

        this.expenseEditInputElement = document.getElementById('categoryNameInput');

        this.validations = [{element: this.expenseEditInputElement as HTMLInputElement}]
        this.init(id).then();
    }

    private async init(id: number): Promise<void> {
        const expenseData: IdTitleDefaultType = await this.getExpense(id);
        if (expenseData) {
            this.showExpense(expenseData);
        }
    }

    private async getExpense(id: number) {
        const response: ItemReturnObjType = await ExpenseService.getExpense(id);

        if (response.error && response.message) {
            alert(response.message);
            console.log(response.message);
        }

        this.expenseOriginalData = response.item;
        return response.item;
    }

    private showExpense(expense: IdTitleDefaultType) {
        if (this.expenseEditInputElement) {
            (this.expenseEditInputElement as HTMLInputElement).value = expense.title;
        }
    }

    private async updateExpense(e: Event) {
        e.preventDefault();

        if (this.validations) {
            if (ValidationUtils.validateForm(this.validations)) {
                const changedData: ItemCreateType = {
                    title: ''
                };

                if (this.expenseEditInputElement && this.expenseOriginalData) {
                    if ((this.expenseEditInputElement as HTMLInputElement).value !== this.expenseOriginalData.title) {
                        changedData.title = (this.expenseEditInputElement as HTMLInputElement).value;
                    }

                    if (Object.keys(changedData).length > 0) {
                        const response: ItemReturnObjType =
                            await ExpenseService.updateExpense(this.expenseOriginalData.id, changedData);

                        if (response.error && response.message) {
                            alert(response.message);
                            console.log(response.message);
                        }
                    }
                    return this.openNewRoute('/expense');
                }
            }
        }
    }
}