export class Interval {
    constructor() {
        this.init();
    }

    private init(): void {
        // Обработка выбора периода
        const intervalBtnElements = document.querySelectorAll('.period-selector .btn');
        const intervalChooseLabels = document.querySelectorAll('#interval-settings label');
        const intervalChooseInputs = document.querySelectorAll('#interval-settings input');

        intervalBtnElements.forEach(btn => {
            btn.addEventListener('click', function(this: HTMLButtonElement) {
                intervalBtnElements.forEach(b => {
                    b.classList.remove('active');
                });
                this.classList.add('active');

                if (this.id === 'interval-btn') {
                    intervalChooseLabels.forEach(label => {
                        label.classList.remove('d-inline');
                        label.classList.add('d-none');
                    });
                    intervalChooseInputs.forEach(input => {
                        input.classList.remove('d-none');
                        input.classList.add('d-inline');
                    });
                } else {
                    intervalChooseLabels.forEach(label => {
                        label.classList.add('d-inline');
                        label.classList.remove('d-none');
                    });
                    intervalChooseInputs.forEach(input => {
                        input.classList.add('d-none');
                        input.classList.remove('d-inline');
                        (input as HTMLInputElement).value = ''; // Очищаем при выборе других кнопок интервала
                    });
                }
            });
        });
    }
}