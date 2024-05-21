const switchBtnAvia = document.getElementById('switch-btn-wrapper');
switchBtnAvia.addEventListener('click', function (params) {
    let optionFromArr = document.getElementById('flightsearchform-locationfrom').options;
    let optionToArr = document.getElementById('flightsearchform-locationto').options;

    let optionFrom = optionFromArr[optionFromArr.length - 1];
    let optionTo = optionToArr[optionToArr.length - 1];

    console.log(optionFrom.value)
    console.log(optionTo.value)

    // Сохраняем текущие значения option элементов
    let tempValue = optionFrom.value;
    let tempText = optionFrom.textContent;

    // Меняем значения option элементов местами
    optionFrom.value = optionTo.value;
    optionFrom.textContent = optionTo.textContent;
    optionFrom.selected = true;

    optionTo.value = tempValue;
    optionTo.textContent = tempText;
    optionTo.selected = true;

    console.log(optionFrom.value)
    console.log(optionTo.value)
    // Получаем и сохраняем отображаемые значения из элементов select2
    let inputsArrAvia = document.querySelectorAll('.select2-selection__rendered');
    let firstInputAvia = inputsArrAvia[0].title;
    let secondInputAvia = inputsArrAvia[1].title;

    // Сохраняем текущее отображаемое значение первого инпута
    let temp = firstInputAvia;

    // Меняем отображаемые значения местами
    inputsArrAvia[0].title = secondInputAvia;
    inputsArrAvia[1].title = temp;

    // Обновляем отображение значений
    inputsArrAvia[0].textContent = secondInputAvia;
    inputsArrAvia[1].textContent = temp;


    // Получаем элементы <input>
    let inputFrom = document.getElementById('input-charter-class-from');
    let inputTo = document.getElementById('input-charter-class-to');

    if (inputFrom != undefined && inputTo != undefined) {
        // Сохраняем текущие значения и отображаемый текст
        let tempValue = inputFrom.value;
        let tempText = inputFrom.getAttribute('placeholder');

        // Меняем значения местами
        inputFrom.value = inputTo.value;
        inputFrom.setAttribute('placeholder', inputTo.getAttribute('placeholder'));

        inputTo.value = tempValue;
        inputTo.setAttribute('placeholder', tempText);
        // clearCharterFlightsCache()
    }

    
    // datepicker.clear()
    // Очищаем кеш полетов (если необходимо)
    clearFlightCache('flightCache_');
});
