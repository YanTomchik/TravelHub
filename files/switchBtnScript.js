const switchBtnAvia = document.getElementById('switch-btn-wrapper');
switchBtnAvia.addEventListener('click', function (params) {

    let optionFrom = document.getElementById('flightsearchform-locationfrom').options[1];
let optionTo = document.getElementById('flightsearchform-locationto').options[1];


    // Сохраняем текущие значения
    let tempValue = optionFrom.value;
    let tempText = optionFrom.textContent;

    // Меняем значения местами
    optionFrom.value = optionTo.value;
    optionFrom.textContent = optionTo.textContent;

    optionTo.value = tempValue;
    optionTo.textContent = tempText;

    let inputsArrAvia = document.querySelectorAll('.select2-selection__rendered');

    let firstInputAvia = inputsArrAvia[0].title
    let secondInputAvia = inputsArrAvia[1].title

    // Сохраняем текущее значение первого инпута
    let temp = firstInputAvia;

    // Заменяем значения местами
    inputsArrAvia[0].title = secondInputAvia;
    inputsArrAvia[1].title = temp;

    // Обновляем отображение значений (если нужно)
    inputsArrAvia[0].textContent = secondInputAvia;
    inputsArrAvia[1].textContent = temp;


})
