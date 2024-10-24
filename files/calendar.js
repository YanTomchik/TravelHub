const today = new Date();

const localeEn = {
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    today: 'Today',
    clear: 'Clear',
    dateFormat: 'dd.MM.yyyy',
    timeFormat: 'HH:mm',
    firstDay: 0
}

const localeRu = {
    days: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
    daysShort: ["Вос", "Пон", "Вто", "Сре", "Чет", "Пят", "Суб"],
    daysMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
    months: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
    monthsShort: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
    today: 'Сегодня',
    clear: 'Очистить',
    dateFormat: 'dd.MM.yyyy',
    timeFormat: 'HH:mm',
    firstDay: 1
}

let userCurrencyTofetch = USER_CURRENCY;
if (userCurrencyTofetch == 'KZT') {
    userCurrencyTofetch = 'USD'
}

// Переводим даты в строки
let todayString = formatDateToString(today);
let typeRequest = 'start';
let datepicker = null;
let isRange = true;
let selectedDate = null;

let charterFlightCache = null;
let charterDirectionsCache = null;

const dateInputsWrapper = document.querySelector('.date-inputs-wrapper');
const datepickerInputFrom = document.querySelector('.datepicker-avia-from');
datepickerInputFrom.setAttribute('autocomplete', 'off');

const datepickerInputTo = document.querySelector('.datepicker-avia-to');
datepickerInputTo.setAttribute('autocomplete', 'off');

let codeIataFrom = $('#flightsearchform-locationfrom').val();
let codeIataTo = $('#flightsearchform-locationto').val();

let codeIataFromArr = document.getElementById('flightsearchform-locationfrom').options;
let codeIatatoArr = document.getElementById('flightsearchform-locationto').options;

const radioButtons = document.querySelectorAll('.flight-route');
const charterCheckbox = document.querySelector('.charter-checkbox');

const radioButtonsWrappers = document.querySelectorAll('.checkbox-title');

const inputCharterFrom = document.getElementById('input-charter-class-from');
inputCharterFrom.setAttribute('autocomplete', 'off');
const inputCharterTo = document.getElementById('input-charter-class-to');
inputCharterTo.setAttribute('autocomplete', 'off');

const charterInputFrom = document.getElementById('charter-input-from');
const charterInputTo = document.getElementById('charter-input-to');

const defaultInputFrom = document.getElementById('input-default-flights-from');
const defaultInputTo = document.getElementById('input-default-flights-to');


//Change
let isMobileFlag = window.matchMedia("only screen and (max-width: 760px)").matches;
// let isMobileFlag = true;
//Изначальное отображение календаря
if (datepickerInputFrom) {
    // datepicker = mainCreateDatepickers(datepickerInputFrom, radioButtonValue, 'startDatepicker');
    datepicker = mainCreateDatepickers(datepickerInputFrom, 'trip', 'startDatepicker');
}

function mainCreateDatepickers(datepickerInputFrom, radioButtonValue, typeRenderDatepicker, datepickerInputTo) {
    if (!charterCheckbox.checked) {
        if (typeRenderDatepicker != 'startDatepicker') {
            datepicker.destroy()
        }

        codeIataFrom = $('#flightsearchform-locationfrom').val();
        codeIataTo = $('#flightsearchform-locationto').val()

        datepicker = createBothWayCalendar(datepickerInputFrom, codeIataFrom, codeIataTo, datepickerInputTo);
    } if (charterCheckbox.checked) {
        if (typeRenderDatepicker != 'startDatepicker') {
            datepicker.destroy()
        }
        clearCharterFlightsCache('charterData');
        datepicker = createTwoWayCharterCalendar(datepickerInputFrom, 'trip')
    }

    return datepicker;
}

radioButtonsWrappers.forEach(elem => {

    elem.addEventListener('click', () => {

        let eventChange = new Event('change', {
            bubbles: true,
            cancelable: true
        });
        const inputElem = elem.previousElementSibling;

        let flagToDrag = null;
        if (inputElem.classList.contains('charter-checkbox')) {
            flagToDrag = 'checkbox';
        }

        if (flagToDrag == 'checkbox') {
            inputElem.checked = !inputElem.checked;

            inputElem.dispatchEvent(eventChange);
        }

    })
})

charterCheckbox.addEventListener('change', () => {
    clearInputs()
    togglerInputsShowHide()
    datepicker.destroy()
    clearCharterFlightsCache('charterData');
    datepicker = mainCreateDatepickers(datepickerInputFrom, undefined, 'startDatepicker', undefined);

})

//Change
function calculateDaysAfter(date) {
    const lastDayOfNextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const differenceInMilliseconds = lastDayOfNextMonth - date;
    return Math.ceil(differenceInMilliseconds / (1000 * 60 * 60 * 24));
}
function formatDateToString(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

const ONE_HOUR = 3600000; // Один час в миллисекундах


// Функция для получения кэшированных данных из локального хранилища с проверкой срока действия
const getCachedDataCharterFlights = (codeIataFrom, codeIataTo) => {
    const key = `charterData_${codeIataFrom}_${codeIataTo}`;
    const cachedItem = localStorage.getItem(key);
    if (cachedItem) {
        const parsedItem = JSON.parse(cachedItem);
        if (Date.now() > parsedItem.expiry) {
            localStorage.removeItem(key); // Удалить устаревший элемент
            return null;
        }
        return parsedItem.data;
    }
    return null;
};

// Функция для сохранения данных в локальное хранилище с меткой времени
const setLocalStorageCharterFlights = (data, codeIataFrom, codeIataTo) => {
    const item = {
        data,
        expiry: Date.now() + ONE_HOUR, // Срок действия один час
    };
    const key = `charterData_${codeIataFrom}_${codeIataTo}`;
    localStorage.setItem(key, JSON.stringify(item));
};

// Функция для получения кэшированных данных о направлениях из локального хранилища с проверкой срока действия
const getCachedDirectionsData = () => {
    const key = `directionsData${MAIN_LANGUAGE}`;
    const cachedItem = localStorage.getItem(key);
    if (cachedItem) {
        const parsedItem = JSON.parse(cachedItem);
        if (Date.now() > parsedItem.expiry) {
            localStorage.removeItem(key); // Удалить устаревший элемент
            return null;
        }
        return parsedItem.data;
    }
    return null;
};

// Функция для сохранения данных о направлениях в локальное хранилище с меткой времени
const setLocalStorageDirectionsData = (data) => {
    const item = {
        data,
        expiry: Date.now() + ONE_HOUR, // Срок действия один час
    };
    const key = `directionsData${MAIN_LANGUAGE}`;
    localStorage.setItem(key, JSON.stringify(item));
};

// Функция для очистки кэша данных о чартерных рейсах
const clearCharterFlightsCache = (prefix) => {
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith(prefix)) {
            localStorage.removeItem(key);
        }
    });
};

// Функция для очистки кэша данных о направлениях
const clearDirectionsCache = () => {
    localStorage.removeItem(`directionsData${MAIN_LANGUAGE}`);
};

// Функция для очистки кэша данных о рейсах
const clearFlightCache = (prefix) => {
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith(prefix)) {
            localStorage.removeItem(key);
        }
    });
};

async function getFlightCharterCalendar(typeWay, codeIataFrom, codeIataTo) {
    codeIataFrom = inputCharterFrom.getAttribute('iata-from');
    codeIataTo = inputCharterTo.getAttribute('iata-to');
    // console.log(codeIataFrom);
    // console.log(codeIataTo)

    const apiUrl = 'https://api.travelhub.by/flight/charter-dates'

    const queryParams = new URLSearchParams({
        route: `${typeWay}`,
        locationFrom: `${codeIataFrom}`,
        locationTo: `${codeIataTo}`,
    });

    const headers = new Headers();
    headers.append('Authorization', 'Bearer AmaOk_eyJpZCI6MTYsImVtYWlsIjoibWFuYWdlcnNAaW5maW5pdHkuYnkifQ');

    const cachedData = getCachedDataCharterFlights(codeIataFrom, codeIataTo);
    if (cachedData) {
        return cachedData;
    }

    try {
        showLoader();

        const response = await fetch(`${apiUrl}?${queryParams}`, {
            headers: headers
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // console.log(data)
        if (typeWay == 'trip') {
            if (data.from.length != 0 && data.back.length != 0) {
                setLocalStorageCharterFlights(data, codeIataFrom, codeIataTo);
            }
        } else {
            if (data.dates.length != 0) {
                setLocalStorageCharterFlights(data, codeIataFrom, codeIataTo);
            }
        }


        return data;
    } catch (error) {
        hideLoader()
        throw new Error(error);
    }
}

async function getFlightCharterDirectionsCalendar() {
    const apiUrl = 'https://api.travelhub.by/flight/charter-directions?language=' + MAIN_LANGUAGE;

    const headers = new Headers();
    headers.append('Authorization', 'Bearer AmaOk_eyJpZCI6MTYsImVtYWlsIjoibWFuYWdlcnNAaW5maW5pdHkuYnkifQ');

    const cachedData = getCachedDirectionsData();
    if (cachedData) {
        return cachedData;
    }

    try {

        const response = await fetch(`${apiUrl}`, {
            headers: headers
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setLocalStorageDirectionsData(data);

        return data;
    } catch (error) {
        throw new Error('There was a problem with your fetch operation:', error);
    }

}

const getFlightCalendar = async (firstDateToSend, daysAfterToSend, codeIataFrom, codeIataTo, typeRequest) => {
    const apiUrl = 'https://api.travelhub.by/flight/calendar';

    codeIataFrom = $('#flightsearchform-locationfrom').val();
    codeIataTo = $('#flightsearchform-locationto').val();

    let adultCounter = document.getElementById('adult-counter').innerHTML;
    let childrenCounter = document.getElementById('children-counter').innerHTML;
    let infantCounter = document.getElementById('infant-counter').innerHTML;
    let cabinClassContainer;

    const selectedRadioCabinClass = document.querySelector('input[name="cabin-class"]:checked');
    cabinClassContainer = selectedRadioCabinClass.value;
    
    let firstDate = todayString;
    let daysAfter = calculateDaysAfter(today);
    let daysBefore = '0';

    if (firstDateToSend !== undefined) {
        firstDate = firstDateToSend;
    }
    if (daysAfterToSend !== undefined) {
        daysAfter = daysAfterToSend;
    }

    if (typeRequest === 'return') {
        [codeIataFrom, codeIataTo] = [codeIataTo, codeIataFrom];
    }

    // console.log(typeRequest);

    const queryParams = new URLSearchParams({
        route: 'one',
        locationFrom: `${codeIataFrom}`,
        locationTo: `${codeIataTo}`,
        date: `${firstDate}`,
        adults: `${adultCounter}`,
        children: `${childrenCounter}`,
        infants: `${infantCounter}`,
        cabinClass: `${cabinClassContainer}`,
        daysBefore: `${daysBefore}`,
        daysAfter: `${daysAfter}`,
        currency: `${userCurrencyTofetch}`
    });

    const headers = new Headers();
    headers.append('Authorization', 'Bearer AmaOk_eyJpZCI6MTYsImVtYWlsIjoibWFuYWdlcnNAaW5maW5pdHkuYnkifQ');

    try {
        // showLoader();
        const response = await fetch(`${apiUrl}?${queryParams}`, { headers });

        // console.log(`${queryParams}`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        // hideLoader();
        throw new Error(error);
    }
};

const displayPrices = (prices) => {
    const cells = document.querySelectorAll('.air-datepicker-cell');

    const minPrice = Math.min(...prices.map(priceObj => priceObj.price));
    // console.log(minPrice)

    cells.forEach(element => {
        const cellDateDay = element.getAttribute('data-date').padStart(2, '0');
        const cellDateMonth = String(Number(element.getAttribute('data-month')) + 1).padStart(2, '0');
        const cellDateYear = element.getAttribute('data-year');
        const cellDate = `${cellDateDay}.${cellDateMonth}.${cellDateYear}`;

        if (!element.classList.contains('-other-month-')) {
            prices.forEach(elem => {
                if (elem.date === cellDate) {
                    let div = element.querySelector('.day-price');
                    if (!div) {
                        div = document.createElement('div');
                        div.className = 'day-price';
                        element.append(div);
                    }
                    div.innerHTML = `${elem.price}`;

                    // Adding the 'green' class to the element with the minimum price
                    if (elem.price === minPrice) {
                        div.classList.add('green');
                    } else {
                        div.classList.remove('green');
                    }

                    if (elem.price.length > 6) {
                        div.style.fontSize = '9px';
                    }
                }
            });
        }
    });

};

let lastSelectDateCheck = null;
let sameDateSelectFlag = false;
let formatSameDate = null;

function createBothWayCalendar(datepickerInputFrom, codeIataFrom, codeIataTo) {

    // let selectedDate = null; // Переменная для хранения выбранной даты
    let typeRequest = 'start'; // Изначальное значение typeRequest

    const locale = MAIN_LANGUAGE === 'ru' ? localeRu : localeEn;

    const handleTripButtonClick = (dp) => {
        isRange = !isRange;
        dp.update({ range: isRange });

        const daysAfterToSend = calculateDaysAfter(dp.viewDate);

        const button = dp.$datepicker.querySelector('.trip-btn');
        if (button) {
            button.classList.toggle('active', !isRange);
        }

        // console.log(dp.selectedDates.length)
        // console.log(isRange)

        // Проверка на две выбранные даты и фокус на поле обратного билета
        if (!isRange && dp.selectedDates.length === 2) {
            // Сброс только даты возврата
            const firstDate = dp.selectedDates[0]; // Сохраняем первую выбранную дату
            dp.clear();
            dp.selectDate(firstDate); // Снова выбираем первую дату
            datepickerInputTo.value = '';

            // Обновление поля ввода для даты отправления
            datepickerInputFrom.value = formatDateToString(firstDate);

            // Обновление типа запроса
            typeRequest = 'start';

            // Обновление календаря с новой датой
            const viewDate = dp.viewDate;
            const formattedViewDate = formatDateToString(viewDate);
            updateCalendarDates(dp, formattedViewDate, daysAfterToSend, codeIataFrom, codeIataTo);
        } else if (dp.selectedDates.length === 0) {
            const viewDate = dp.viewDate;
            const formattedViewDate = formatDateToString(viewDate);
            updateCalendarDates(dp, formattedViewDate, daysAfterToSend, codeIataFrom, codeIataTo);
        } else if (isRange === false && dp.selectedDates.length === 1) {
            datepickerInputTo.value = ''
            dp.hide();
            
        } else if (isRange === true && dp.selectedDates.length === 1) {
            typeRequest = 'return';
            const viewDate = dp.viewDate;
            const formattedViewDate = formatDateToString(viewDate);
            updateCalendarDates(dp, formattedViewDate, daysAfterToSend, codeIataFrom, codeIataTo);
        } else if (!isRange && selectedDate) {
            datepickerInputTo.value = '';
            typeRequest = 'start';
        }
    };

    const handleSelect = (formattedDate, date, inst) => {
        allDates = [];
        if (formattedDate.date[0] !== undefined) {
            selectedDate = formatDateToString(formattedDate.date[0]);
        }

        if (formattedDate.date[1] !== undefined) {
            handleSecondDateSelect(formattedDate);
        } else if (formattedDate.date[0] !== undefined) {
            handleFirstDateSelect(formattedDate);
        }

        
    };

    const handleSecondDateSelect = (formattedDate) => {
        
        const firstDateToSend = formatDateToString(formattedDate.date[0]);
        const daysAfterToSend = calculateDaysAfter(formattedDate.date[0]);
        updateCalendarDates(datepicker, firstDateToSend, daysAfterToSend, codeIataFrom, codeIataTo);

        datepickerInputFrom.value = formattedDate.formattedDate[0];
        datepickerInputTo.value = formattedDate.formattedDate[1];
    };

    const handleShow = async (inst) => {
        if (inst) {

            if (!isRange) {
                const button = datepicker.$datepicker.querySelector('.trip-btn');
                if (button) {
                    button.classList.toggle('active');
                }
            }
            //Check how it work

            if (document.activeElement == datepickerInputTo) {
                typeRequest = 'return'
            } else {
                typeRequest = 'start'
            }

            document.querySelectorAll('.air-datepicker-cell.-day-').forEach(elem =>{
                elem.addEventListener('click', (cell)=>{
                    if(lastSelectDateCheck == cell.target.dataset ){
                        sameDateSelectFlag = true;
                        formatSameDate = formatDateToString(new Date(`${cell.target.dataset.year}-${Number(cell.target.dataset.month)+1}-${cell.target.dataset.date}`))
                        
                        datepicker.hide()
                        
                    }
                    lastSelectDateCheck = cell.target.dataset;
                })
            })
            
            const viewDate = selectedDate ? new Date(selectedDate.split('.').reverse().join('-')) : today;
            datepicker.setViewDate(viewDate);

            const month = inst.viewDate ? inst.viewDate.getMonth() + 1 : new Date().getMonth() + 1;
            const year = inst.viewDate ? inst.viewDate.getFullYear() : new Date().getFullYear();
            currentWeek = 0; // Сбрасываем текущую неделю при открытии календаря
            await loadNextWeek(month, year, typeRequest, true); // Загрузка данных за первую неделю и очистка предыдущих цен
            startWeeklyLoading(month, year, typeRequest); // Начинаем плавную загрузку данных
        }
    };

    const handleChangeViewDate = async ({ month, year }) => {
        allDates = []
        currentWeek = 0; // Сбрасываем текущую неделю при изменении месяца
        // console.log(month);
        await loadNextWeek(month + 1, year, typeRequest, true); // Загрузка данных за первую неделю и очистка предыдущих цен
        startWeeklyLoading(month + 1, year, typeRequest); // Начинаем плавную загрузку данных
    };

    const handleFirstDateSelect = async (formattedDate) => {
        if (isMobileFlag === false) {
            setActiveInput(datepickerInputTo);
        }
        datepicker.show();
        
        datepickerInputFrom.value = formattedDate.formattedDate[0];

        const firstDateToSend = formatDateToString(formattedDate.date[0]);
        // console.log(formattedDate.date[0].getMonth() + 1);
        const daysAfterToSend = calculateDaysAfter(formattedDate.date[0]);
        typeRequest = 'return';  // Set request type to 'return'

        currentWeek = 0; // Reset the current week
        
        await loadNextWeek(formattedDate.date[0].getMonth() + 1, formattedDate.date[0].getFullYear(), typeRequest, true, firstDateToSend); // Load data for the first week and clear previous prices
        startWeeklyLoading(formattedDate.date[0].getMonth() + 1, formattedDate.date[0].getFullYear(), typeRequest, firstDateToSend); // Start weekly data loading
    };

    const loadNextWeek = async (month, year, typeRequest, clearPreviousPrices = false, firstDateToSend) => {
        // console.log('load next week');
        const startDate = new Date(year, month - 1, 1 + currentWeek * 7); // Start of the current week
        let formattedFirstDate = formatDateToString(startDate);
        if (firstDateToSend !== undefined) {
            formattedFirstDate = firstDateToSend;
        }
        // console.log('firstDateToSend: ' + firstDateToSend);

        // console.log(startDate)
        // console.log('curW' + currentWeek)

        currentWeek++; // Increment the current week
        await updateCalendarDates(datepicker, formattedFirstDate, codeIataFrom, codeIataTo, typeRequest, clearPreviousPrices);
    };

    const startWeeklyLoading = (month, year, typeRequest, firstDateToSend) => {
        // console.log('start weekly loading');
        const intervalId = setInterval(async () => {
            if (currentWeek * 7 >= 31) { // Stop loading if more than 31 days are loaded
                clearInterval(intervalId);
                return;
            }

            let lastDayOfMonth = new Date(year, month, 0).getDate(); // Last day of the current month

            if (firstDateToSend !== undefined) {
                let dateParts = firstDateToSend.split('.');
                let date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
                date.setDate(date.getDate() + 7); // Increment date by 7 days

                // Ensure the date does not exceed the last day of the current month
                if (date.getDate() > lastDayOfMonth) {
                    clearInterval(intervalId);
                    return;
                }

                firstDateToSend = formatDateToString(date);
            }

            await loadNextWeek(month, year, typeRequest, false, firstDateToSend);
        }, 300); // Interval of 1 second between loads
    };

    // Функция для дозаписи уникальных элементов
    const addToAllDates = (newDates, currentMonth, currentYear) => {
        // Преобразуем текущий массив в объект для быстрой проверки уникальности
        const dateMap = allDates.reduce((map, item) => {
            map[item.date] = item;
            return map;
        }, {});

        // Добавляем новые элементы, если их еще нет в объекте и они не превышают текущий месяц
        newDates.forEach(dateItem => {
            const [day, month, year] = dateItem.date.split('.').map(Number);
            if (year === currentYear && month === currentMonth && !dateMap[dateItem.date]) {
                dateMap[dateItem.date] = dateItem;
            }
        });

        // Преобразуем объект обратно в массив
        allDates = Object.values(dateMap);
    };

    let allDates = []
    let currentWeek = 0; // Глобальная переменная для отслеживания текущей недели
    const updateCalendarDates = async (dp, firstDateToSend, codeIataFrom, codeIataTo, typeRequest, clearPreviousPrices = false) => {
        try {
            if (clearPreviousPrices) {
                // Очистка предыдущих цен
                const cells = document.querySelectorAll('.air-datepicker-cell .day-price');
                cells.forEach(cell => cell.remove());
            }

            const daysAfterToSend = 7; // Задаем количество дней для подгрузки (неделя)
            const response = await getFlightCalendar(firstDateToSend, daysAfterToSend, codeIataFrom, codeIataTo, typeRequest);

            if (response.status === 'error') {
                hideLoader();
                return;
            }

            const dates = response.result.map(entry => ({
                date: entry.date,
                price: entry.price
            }));

            addToAllDates(dates, datepicker.viewDate.getMonth() + 1, datepicker.viewDate.getFullYear())
            // console.log(allDates)
            // console.log(dates);


            displayPrices(allDates, 'reRender');

            hideLoader();
        } catch (error) {
            console.error('Error updating calendar dates:', error);
        }
    };

    // Инициализация календаря
    let datepickerBothWay = new AirDatepicker(datepickerInputFrom, {
        locale,
        inline: false,
        minDate: new Date(),
        isMobile: isMobileFlag,
        autoClose: true,
        multipleDatesSeparator: ' - ',
        range: isRange,
        numberOfMonths: 2,
        showOtherMonths: false,
        buttons: [
            {
                content: 'Обратный билет не нужен',
                className: 'trip-btn',
                onClick: function (dp) {
                    handleTripButtonClick(dp);
                }
            }
        ],
        onSelect: function (formattedDate, date, inst) {
            handleSelect(formattedDate, date, inst);
        },
        onShow: function (inst) {
            sameDateSelectFlag = false
            handleShow(inst);            
            
        },
        onChangeViewDate: function ({ month, year }) {
            handleChangeViewDate({ month, year });
        },
        onHide: function (inst) {
            setActiveInput();
            // allDates = []
            if(sameDateSelectFlag == true){
                datepickerInputFrom.value = formatSameDate
                datepickerInputTo.value = formatSameDate
            }            
        }
    });

    return datepickerBothWay;
}

////////////////////////////////

function createTwoWayCharterCalendar(datepickerInputFrom, typeWay) {

    if (isRange === true) {
        typeWay = 'trip';
    } else {
        typeWay = 'one';
    }

    // let selectedDate = null; // Переменная для хранения выбранной даты

    const locale = MAIN_LANGUAGE === 'ru' ? localeRu : localeEn;

    const renderCell = (dates, date, cellType) => {
        
        if(selectedDate && isRange){
            datepickerInputFrom.value = selectedDate;
        }
        if (cellType === 'day') {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            const renderCellDate = `${year}-${month}-${day}`;

            
            if(selectedDate && isRange && !Array.isArray(selectedDate)){

                const [day, month, year] = selectedDate.split('.'); 
                const selectedDateFormatted = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

                if (renderCellDate > selectedDateFormatted && dates.includes(renderCellDate)) {
                    return {
                        html: `<span class="available-date">${date.getDate()}</span>`,
                        classes: 'charter-day'
                    };
                } else {
                    return {
                        disabled: true
                    };
                }
            }else if(isRange && Array.isArray(selectedDate)){


                const [day, month, year] = formatDateToString(selectedDate[0]).split('.'); 
                const selectedDateFormatted = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

                if (renderCellDate > selectedDateFormatted && dates.includes(renderCellDate)) {
                    return {
                        html: `<span class="available-date">${date.getDate()}</span>`,
                        classes: 'charter-day'
                    };
                } else {
                    return {
                        disabled: true
                    };
                }
            }else{
                if (dates.includes(renderCellDate)) {
                    return {
                        html: `<span class="available-date">${date.getDate()}</span>`,
                        classes: 'charter-day'
                    };
                } else {
                    return {
                        disabled: true
                    };
                }
            }

            
        }
    };

    const updateCalendar = (dp, dates) => {
        dates.forEach(dateStr => {
            dp.enableDate(new Date(dateStr));
        });
        
        const earliestDate = new Date(Math.min(...dates.map(dateStr => new Date(dateStr))));
        dp.update({
            onRenderCell: ({ date, cellType }) => renderCell(dates, date, cellType)
        });
        if(dp.selectedDates.length == 0){
            dp.setViewDate(earliestDate);
        }else{
            dp.setViewDate(dp.selectedDates[0]);
        }
        
        hideLoader();
    };

    const onTripButtonClick = (dp) => {

        selectedDate = dp.selectedDates;
        dp.clear();
        isRange = !isRange;
        dp.update({
            range: isRange
        });
        // dp.selectDate(selectedDate[0])

        setTimeout(() => {
            const button = dp.$datepicker.querySelector('.trip-btn');
            if (button) {
                datepickerInputTo.value = ''
                button.classList.toggle('active', !isRange);
            }
            dp.show()

            // dp.selectDate(selectedDate[0])
            setActiveInput()

        }, 0);

        
        // getFlightCharterCalendar(typeWay)
        //     .then(response => updateCalendar(dp, response.from));
    };

    let datepickerTwoWayCharter = new AirDatepicker(datepickerInputFrom, {

        locale,
        inline: false,
        minDate: new Date(),
        isMobile: isMobileFlag,
        autoClose: true,
        range: isRange,
        numberOfMonths: 2,
        multipleDatesSeparator: ' - ',
        showOtherMonths: false,
        buttons: [
            {
                content: 'Обратный билет не нужен',
                className: 'trip-btn',
                onClick: (dp) => onTripButtonClick(dp)
            }
        ],
        onSelect: function (formattedDate, date, inst) {
            // console.log(isRange)
            if (formattedDate.date[0] !== undefined) {
                selectedDate = formatDateToString(formattedDate.date[0]);
                if (formattedDate.date[1] == undefined) {
                    if (isMobileFlag == false) {
                        // datepickerInputTo.focus()
                        setActiveInput(datepickerInputTo)
                    }
                    datepicker.show();
                    // console.log(formattedDate.formattedDate[0])
                    datepickerInputFrom.value = formattedDate.formattedDate[0];
                } else if (formattedDate.date[1] !== undefined) {
                    // console.log(formattedDate.formattedDate[0])
                    datepickerInputFrom.value = formattedDate.formattedDate[0];
                    datepickerInputTo.value = formattedDate.formattedDate[1];
                    setActiveInput()
                }

                getFlightCharterCalendar(typeWay)
                    .then(response => {
                        const dates = response.back;
                        updateCalendar(datepickerTwoWayCharter, dates);
                    });
            }

            if (formattedDate.date[1] !== undefined) {
                setTimeout(() => {
                    // console.log(formattedDate.formattedDate[0])
                    datepickerInputFrom.value = formattedDate.formattedDate[0];
                    datepickerInputTo.value = formattedDate.formattedDate[1];
                }, 0);
            }
        },
        onShow: function (inst) {
            if (inst) {
                if(selectedDate){
                    // console.log(selectedDate)
                }
                if (!isRange) {
                    setTimeout(() => {
                        const button = datepicker.$datepicker.querySelector('.trip-btn');
                        if (button) {
                            button.classList.add('active');
                        }
                    }, 0);
                }        

                getFlightCharterCalendar(typeWay)
                    .then(response => updateCalendar(datepickerTwoWayCharter, response.from));
            }
        }
    });

    return datepickerTwoWayCharter;
}

//Change
function clearInputs() {
    datepickerInputFrom.innerHTML = '';
    datepickerInputFrom.value = '';
    datepickerInputTo.innerHTML = '';
    datepickerInputTo.value = '';
    inputCharterFrom.value = ''
    inputCharterFrom.innerHTML = ''
    inputCharterTo.value = ''
    inputCharterTo.innerHTML = '';
}
//Change
function togglerInputsShowHide() {
    // console.log('open')
    charterInputFrom.classList.toggle('active');
    charterInputTo.classList.toggle('active');

    defaultInputFrom.classList.toggle('hide');
    defaultInputTo.classList.toggle('hide');
}

let selectedCityCode = null;
let selectedCityName = null;

if (inputCharterFrom != undefined) {
    const dropdownCharter = document.getElementById('dropdown-charter-from');
    const dropDownCharterList = document.getElementById('dropdown-charter-list-country-from');
    const dropDownCharterListCity = document.getElementById('dropdown-charter-list-city-from');

    let activeCountryDiv = null;

    inputCharterFrom.addEventListener('click', function (event) {
        showLoaderCharter('from');
        dropdownCharter.style.display = 'grid';

        getFlightCharterDirectionsCalendar()
            .then(response => {
                dropDownCharterList.innerHTML = '';
                dropDownCharterListCity.innerHTML = '';

                const countries = Object.keys(response);
                const countryCityMap = {};
                const cityCodeMap = {};

                countries.forEach(countryName => {
                    const cities = Object.entries(response[countryName]);
                    countryCityMap[countryName] = [];

                    cities.forEach(([cityCode, cityData]) => {
                        const cityName = cityData.title;
                        countryCityMap[countryName].push(cityName);
                        cityCodeMap[cityName] = cityCode;
                    });

                    const countryDivElement = document.createElement('div');
                    countryDivElement.classList.add('dropdown-charter-item');
                    countryDivElement.textContent = countryName;
                    dropDownCharterList.appendChild(countryDivElement);

                    countryDivElement.addEventListener('click', (event) => {
                        inputCharterFrom.value = countryDivElement.textContent;

                        if (activeCountryDiv) {
                            activeCountryDiv.classList.remove('active');
                        }
                        countryDivElement.classList.add('active');
                        activeCountryDiv = countryDivElement;

                        dropDownCharterListCity.innerHTML = '';

                        countryCityMap[countryName].forEach(cityName => {
                            const cityDivElement = document.createElement('div');
                            cityDivElement.classList.add('dropdown-charter-item');
                            cityDivElement.textContent = cityName;
                            dropDownCharterListCity.appendChild(cityDivElement);

                            cityDivElement.addEventListener('click', (event) => {
                                clearDatepickerValue()
                                selectedCityCode = cityCodeMap[cityName];
                                selectedCityName = cityName;
                                inputCharterFrom.setAttribute('iata-from', selectedCityCode);
                                inputCharterFrom.value = selectedCityName;
                                dropdownCharter.style.display = 'none';

                                let option = new Option(cityName, selectedCityCode, true, true);
                                $("#flightsearchform-locationfrom").append(option).trigger('change');

                                inputCharterTo.click();
                            });
                        });
                    });
                });

                hideLoaderCharter('from');
            });

        function handleOutsideClick(event) {
            if (!dropdownCharter.contains(event.target) && !inputCharterFrom.contains(event.target)) {
                dropdownCharter.style.display = 'none';
                document.removeEventListener('click', handleOutsideClick);
            }
        }

        setTimeout(() => {
            document.addEventListener('click', handleOutsideClick);
        }, 0);
    });
}

if (inputCharterTo != undefined) {
    const dropdownCharterTo = document.getElementById('dropdown-charter-to');
    const dropDownCharterListTo = document.getElementById('dropdown-charter-list-country-to');
    const dropDownCharterListCityTo = document.getElementById('dropdown-charter-list-city-to');

    let activeCountryDivTo = null;

    inputCharterTo.addEventListener('click', function (event) {
        showLoaderCharter('to');
        dropdownCharterTo.style.display = 'grid';

        getFlightCharterDirectionsCalendar()
            .then(response => {
                dropDownCharterListTo.innerHTML = '';
                dropDownCharterListCityTo.innerHTML = '';

                const countryCityMapTo = {};
                const cityCodeMapTo = {};

                if (selectedCityCode) {
                    const selectedCountry = Object.keys(response).find(country =>
                        Object.keys(response[country]).includes(selectedCityCode)
                    );

                    const directions = response[selectedCountry][selectedCityCode].directions;

                    Object.entries(directions).forEach(([countryName, cities]) => {
                        countryCityMapTo[countryName] = [];

                        Object.entries(cities).forEach(([cityCode, cityName]) => {
                            countryCityMapTo[countryName].push(cityName);
                            cityCodeMapTo[cityName] = cityCode;
                        });

                        const countryDivElementTo = document.createElement('div');
                        countryDivElementTo.classList.add('dropdown-charter-item');
                        countryDivElementTo.textContent = countryName;
                        dropDownCharterListTo.appendChild(countryDivElementTo);

                        countryDivElementTo.addEventListener('click', (event) => {

                            inputCharterTo.value = countryDivElementTo.textContent;

                            if (activeCountryDivTo) {
                                activeCountryDivTo.classList.remove('active');
                            }
                            countryDivElementTo.classList.add('active');
                            activeCountryDivTo = countryDivElementTo;

                            dropDownCharterListCityTo.innerHTML = '';

                            countryCityMapTo[countryName].forEach(cityName => {
                                const cityDivElementTo = document.createElement('div');
                                cityDivElementTo.classList.add('dropdown-charter-item');
                                cityDivElementTo.textContent = cityName;
                                dropDownCharterListCityTo.appendChild(cityDivElementTo);

                                cityDivElementTo.addEventListener('click', (event) => {
                                    clearDatepickerValue()
                                    
                                    const cityCode = cityCodeMapTo[cityName];
                                    inputCharterTo.setAttribute('iata-to', cityCode);
                                    inputCharterTo.value = cityName;
                                    dropdownCharterTo.style.display = 'none';

                                    let option = new Option(cityName, cityCode, true, true);
                                    $("#flightsearchform-locationto").append(option).trigger('change');
                                });
                            });
                        });
                    });
                }

                hideLoaderCharter('to');
            });

        function handleOutsideClick(event) {
            if (!dropdownCharterTo.contains(event.target) && !inputCharterTo.contains(event.target)) {
                dropdownCharterTo.style.display = 'none';
                document.removeEventListener('click', handleOutsideClick);
            }
        }

        setTimeout(() => {
            document.addEventListener('click', handleOutsideClick);
        }, 0);
    });
}

function showLoaderCharter(typeS) {
    const loader = document.querySelector(`.loader-calendar-wrapper.${typeS}`);
    loader.style.display = 'block'
}

function hideLoaderCharter(typeH) {
    const loader = document.querySelector(`.loader-calendar-wrapper.${typeH}`);
    if (loader) {
        loader.style.display = 'none';
    }
}

function showLoader() {
    const loader = document.querySelector('.loader-calendar-wrapper.calendar');
    if (loader) {
        loader.remove()
    }
    const airDatepickerContent = document.querySelector('.air-datepicker');
    //airDatepickerContent.style.position = 'relative';
    const div = document.createElement('div');
    div.classList.add('loader-calendar-wrapper');
    div.classList.add('calendar')
    div.innerHTML = `<div class="loader-calendar" id="loader-calendar"></div>`
    airDatepickerContent.appendChild(div)

}

function hideLoader() {
    const loader = document.querySelector('.loader-calendar-wrapper.calendar');
    if (loader) {
        loader.style.display = 'none';
    }
}

document.getElementById('input-charter-class-from').addEventListener('input', function () {
    let filter = this.value.toUpperCase();
    let items = document.querySelectorAll('#dropdown-charter-list-country-from .dropdown-charter-item');

    items.forEach(function (item) {
        if (item.textContent.toUpperCase().indexOf(filter) > -1) {
            item.style.display = ''; // Показать элемент
        } else {
            item.style.display = 'none'; // Скрыть элемент
        }
    });
});

document.getElementById('input-charter-class-to').addEventListener('input', function () {
    let filter = this.value.toUpperCase();
    let items = document.querySelectorAll('#dropdown-charter-list-country-to .dropdown-charter-item');

    items.forEach(function (item) {
        if (item.textContent.toUpperCase().indexOf(filter) > -1) {
            item.style.display = ''; // Показать элемент
        } else {
            item.style.display = 'none'; // Скрыть элемент
        }
    });
});

document.getElementById('input-charter-class-from').addEventListener('input', function () {

    if (this.value === '') {
        document.getElementById('input-charter-class-to').value = '';

    }
});

document.getElementById('input-charter-class-to').addEventListener('input', function () {
    if (this.value === '') {
        document.getElementById('input-charter-class-from').value = '';
    }
});

//ДОБАВИТЬ ВЫЗОВ ЭТОЙ ФУНКЦИИ ПРИ ПОИСКЕ НОВОМ
const searchBtnFlight = document.querySelector('.btn.btn-primary.search-btn');

searchBtnFlight.addEventListener('click', () => {
    clearFlightCache('flightCache_');
})

function clearAllCache() {
    // console.log('clearCache')
    clearFlightCache('flightCache_');
    clearCharterFlightsCache('charterData');
}

if (isMobileFlag == true) {
    // Добавляем обработчик события scroll
    window.addEventListener('scroll', () => {
        if (datepicker.visible) {
            datepicker.hide()
        }
    });
}

$('#flightsearchform-locationfrom').on('change', function () {
    clearAllCache()
    if (datepicker != undefined || datepicker != null) {
        type = 'changeRoute'
        clearDatepickerValue(type)
        datepicker.setViewDate(today)
        typeRequest = 'start'
    }


})

$('#flightsearchform-locationto').on('change', function () {
    clearAllCache()
    if (datepicker != undefined || datepicker != null) {
        type = 'changeRoute'
        clearDatepickerValue(type)
        datepicker.setViewDate(today)
        typeRequest = 'start'
    }
})


document.querySelector('.remove-datepicker-date').addEventListener('click', () => {
    clearDatepickerValue()
})

document.querySelector('.search-btn-block.col-search-button').addEventListener('click', () => {
    if (isMobileFlag == false) {
        datepicker.hide();
    }
})

function clearDatepickerValue(type) {

    if(type != "changeRoute"){
        datepickerInputFrom.value = "";
        datepickerInputTo.value = "";
        selectedDate = null;
        datepicker.clear();
        isRange = true;
        datepicker.update({
            range: isRange
        });
        
        
    }

}

datepickerInputFrom.addEventListener('click', (event) => {

    if (isMobileFlag == false) {
        // datepickerInputFrom.focus()
        setActiveInput(datepickerInputFrom)
    }
});

datepickerInputTo.addEventListener('click', (event) => {
    if (datepickerInputFrom.value) {
        datepicker.show();

        if (isMobileFlag == false) {
            // datepickerInputTo.focus()
            setActiveInput(datepickerInputTo)
        }
    }
    if (!isRange) {
        datepicker.update({ range: true });

        const button = datepicker.$datepicker.querySelector('.trip-btn');
        if (button) {
            button.classList.toggle('active', !isRange);
        }

    }

});


document.addEventListener('click', function (event) {
    if (!datepicker.$datepicker.contains(event.target) &&
        !datepickerInputFrom.contains(event.target) &&
        !datepickerInputTo.contains(event.target)) {
        if (isMobileFlag == false) {
            datepicker.hide();
        }

    }
});


function setActiveInput(elem) {
    datepickerInputFrom.classList.remove('active');
    datepickerInputTo.classList.remove('active');
    if (elem != undefined) {
        elem.classList.add('active');
    }

}