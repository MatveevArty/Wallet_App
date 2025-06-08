// Обработка выбора периода
const intervalBtnElements = document.querySelectorAll('.period-selector .btn');
const intervalChooseLabels = document.querySelectorAll('#interval-settings label');
const intervalChooseInputs = document.querySelectorAll('#interval-settings input');
intervalBtnElements.forEach(btn => {
    btn.addEventListener('click', function() {
        intervalBtnElements.forEach(b => {
            b.classList.remove('active');
        });
        this.classList.add('active');
        if (btn.id === 'interval-btn') {
            intervalChooseLabels.forEach(label => {
                label.classList.remove('d-inline');
                label.classList.add('d-none')
            })
            intervalChooseInputs.forEach(input => {
                input.classList.remove('d-none');
                input.classList.add('d-inline')
            })
        } else {
            intervalChooseLabels.forEach(label => {
                label.classList.add('d-inline');
                label.classList.remove('d-none')
            })
            intervalChooseInputs.forEach(input => {
                input.classList.add('d-none');
                input.classList.remove('d-inline')
                input.value = ''; // Очищаем при выборе других кнопок интервала, которые не кнопка "Интервал"
            })
        }
    });
});