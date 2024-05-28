const switchBtnAvia = document.getElementById('switch-btn-wrapper');
switchBtnAvia.addEventListener('click', function (params) {
    switchOptionsToRequest();

    switchTextContent();
    // Получаем элементы input для чартеров
    const fromInput = document.getElementById('input-charter-class-from');
    const toInput = document.getElementById('input-charter-class-to');

    if (fromInput != undefined && toInput != undefined) {
        
        const fromValue = fromInput.value;
        const fromIATA = fromInput.getAttribute('iata-from');

        const toValue = toInput.value;
        const toIATA = toInput.getAttribute('iata-to');

        // Поменять местами значения
        fromInput.value = toValue;
        fromInput.setAttribute('iata-from', toIATA);

        toInput.value = fromValue;
        toInput.setAttribute('iata-to', fromIATA);
    }
    datepicker.clear(true)

    clearAllCache();
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
    let optionFrom = $('#select2-flightsearchform-locationfrom-container').text();
    let optionTo = $('#select2-flightsearchform-locationto-container').text();

    $('#select2-flightsearchform-locationfrom-container').text(optionTo);
    $('#select2-flightsearchform-locationto-container').text(optionFrom);

}