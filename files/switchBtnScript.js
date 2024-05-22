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

    clearFlightCache('flightCache_');
    
});


function switchTextContent (){
    // Получить элементы select
    const fromSelect = $('#flightsearchform-locationfrom');
    const toSelect = $('#flightsearchform-locationto');

    // Получить текущие значения
    const fromValue = fromSelect.val();
    const toValue = toSelect.val();

    // Получить отображаемый текст
    const fromOptionText = fromSelect.find('option:selected').text();
    const toOptionText = toSelect.find('option:selected').text();

    // Поменять местами значения
    fromSelect.val(toValue).trigger('change');
    toSelect.val(fromValue).trigger('change');

    // Обновить текстовое содержимое select2 контейнеров
    const fromContainer = document.querySelector('#select2-flightsearchform-locationfrom-container');
    const toContainer = document.querySelector('#select2-flightsearchform-locationto-container');
    fromContainer.textContent = toOptionText;
    toContainer.textContent = fromOptionText;
}

function switchOptionsToRequest (){
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