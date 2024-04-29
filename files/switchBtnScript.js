const switchBtnAvia = document.getElementById('switch-btn-wrapper');
switchBtnAvia.addEventListener('click',function (params) {
    const inputsArrAvia = document.querySelectorAll('.select2-selection__rendered');

    const firstInputAvia = inputsArrAvia[0].title
    const secondInputAvia = inputsArrAvia[1].title

    // Сохраняем текущее значение первого инпута
    const temp = firstInputAvia;

    // Заменяем значения местами
    inputsArrAvia[0].title = secondInputAvia;
    inputsArrAvia[1].title = temp;

    // Обновляем отображение значений (если нужно)
    inputsArrAvia[0].textContent = secondInputAvia;
    inputsArrAvia[1].textContent = temp;
})


