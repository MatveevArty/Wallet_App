import {UrlUtils} from "../../utils/url-utils";
import {IncomeService} from "../../services/income-service";
import {ValidationUtils} from "../../utils/validation-utils";
import {ValidationsType} from "../../types/validations.type";
import {IdTitleDefaultType} from "../../types/id-title-default.type";
import {ItemCreateType} from "../../types/item-create.type";
import {ItemReturnObjType} from "../../types/item-return-obj.type";

export class IncomeEdit {
    readonly openNewRoute: (url: string) => Promise<void>;
    readonly incomeEditInputElement: HTMLElement | null = null;
    readonly validations: ValidationsType[] | null;
    private incomeOriginalData: IdTitleDefaultType | null = null;

    constructor(openNewRoute: (url: string) => Promise<void>) {
        this.openNewRoute = openNewRoute;
        const idString = UrlUtils.getUrlParam('id');

        if (!idString) {
            this.openNewRoute('/').then();
        }

        const id = parseInt(idString!);

        document.getElementById('incomeEditBtn')?.addEventListener('click', this.updateIncome.bind(this));

        this.incomeEditInputElement = document.getElementById('categoryNameInput');

        this.validations = [{element: this.incomeEditInputElement as HTMLInputElement}]
        this.init(id).then();
    }

    private async init(id: number): Promise<void> {
        const incomeData: IdTitleDefaultType = await this.getIncome(id);
        if (incomeData) {
            this.showIncome(incomeData);
        }
    }

    private async getIncome(id: number) {
        const response: ItemReturnObjType = await IncomeService.getIncome(id);

        if (response.error && response.message) {
            alert(response.message);
            console.log(response.message);
        }

        this.incomeOriginalData = response.item;
        return response.item;
    }

    private showIncome(income: IdTitleDefaultType) {
        if (this.incomeEditInputElement) {
            (this.incomeEditInputElement as HTMLInputElement).value = income.title;
        }
    }

    private async updateIncome(e: Event) {
        e.preventDefault();

        if (this.validations) {
            if (ValidationUtils.validateForm(this.validations)) {
                const changedData: ItemCreateType = {
                    title: ''
                };

                if (this.incomeEditInputElement && this.incomeOriginalData) {
                    if ((this.incomeEditInputElement as HTMLInputElement).value !== this.incomeOriginalData.title) {
                        changedData.title = (this.incomeEditInputElement as HTMLInputElement).value;
                    }

                    if (Object.keys(changedData).length > 0) {
                        const response = await IncomeService.updateIncome(this.incomeOriginalData.id, changedData);

                        if (response.error && response.message) {
                            alert(response.message);
                            console.log(response.message);
                        }
                    }
                    return this.openNewRoute('/income');
                }
            }
        }
    }
}