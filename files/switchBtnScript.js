const switchBtnAvia = document.getElementById('switch-btn-wrapper');
switchBtnAvia.addEventListener('click', function (params) {

    switchOptionsToRequest();

    switchTextContent();

    // Получаем элементы input для чартеров
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
    }

    datepicker.clear(true)

    clearFlightCache('flightCache_');

});


function switchTextContent() {
    // Получить элементы select
    let fromSelect = $('#flightsearchform-locationfrom');
    let toSelect = $('#flightsearchform-locationto');

    // Получить текущие значения
    let fromValue = fromSelect.val();
    let toValue = toSelect.val();

    // Получить отображаемый текст
    let fromOptionText = $('#select2-flightsearchform-locationfrom-container').text();
    let toOptionText = $('#select2-flightsearchform-locationto-container').text();

    // Поменять местами значения
    let optionFrom = new Option(fromOptionText, fromValue, true, true);
    let optionTo = new Option(toOptionText, toValue, true, true);
    fromSelect.append(optionTo).trigger('change');
    toSelect.append(optionFrom).trigger('change');

    
}

function switchOptionsToRequest() {
    let optionFromArr = document.getElementById('flightsearchform-locationfrom').options;
    let optionToArr = document.getElementById('flightsearchform-locationto').options;

    let optionFrom = optionFromArr[optionFromArr.length - 1];
    let optionTo = optionToArr[optionToArr.length - 1];

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
}