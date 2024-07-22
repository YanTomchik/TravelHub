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
 
// Переводим даты в строки
let todayString = formatDateToString(today);
let typeRequest = 'start';
let datepicker = null;
let isRange = true;

let charterFlightCache = null;
let charterDirectionsCache = null;

const dateInputsWrapper = document.querySelector('.date-inputs-wrapper')
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
    }if (charterCheckbox.checked) {
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
const getCachedFlightData = (key) => {
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
const setLocalStorageFlightData = (key, data) => {
    const item = {
        data,
        expiry: Date.now() + ONE_HOUR, // Срок действия один час
    };
    localStorage.setItem(key, JSON.stringify(item));
};

// Функция для генерации уникального ключа для кэширования на основе параметров запроса
const generateCacheKey = (firstDate, codeIataFrom, codeIataTo, typeRequest, cabinClassContainer, adultCounter, childrenCounter, infantCounter) =>
    `flightCache_${firstDate}_${codeIataFrom}_${codeIataTo}_${typeRequest}_${USER_CURRENCY}_${cabinClassContainer}_${adultCounter}_${childrenCounter}_${infantCounter}`;

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
        console.log(data)
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

// Основная функция для получения данных
const getFlightCalendar = async (firstDateToSend, daysAfterToSend, codeIataFrom, codeIataTo, typeRequest) => {
    const apiUrl = 'https://api.travelhub.by/flight/calendar';

    codeIataFrom = $('#flightsearchform-locationfrom').val();
    codeIataTo = $('#flightsearchform-locationto').val();

    let adultCounter = document.getElementById('adult-counter').innerHTML;
    let childrenCounter = document.getElementById('children-counter').innerHTML;
    let infantCounter = document.getElementById('infant-counter').innerHTML;
    let cabinClassContainer = document.getElementById('select2-cabin-class-container').innerHTML;
    if (cabinClassContainer == 'Эконом') {
        cabinClassContainer = 'economy';
    } else if (cabinClassContainer == 'Бизнес') {
        cabinClassContainer = 'business';
    }

    let firstDate = todayString;
    let daysAfter = calculateDaysAfter(today);
    let daysBefore = '0';
    let termIata = null;
    if (firstDateToSend !== undefined) {
        firstDate = firstDateToSend;
    }
    if (daysAfterToSend !== undefined) {
        daysAfter = daysAfterToSend;
    }

    if (typeRequest === 'return') {
        termIata = codeIataFrom;
        codeIataFrom = codeIataTo;
        codeIataTo = termIata;
    }

    // console.log(codeIataFrom);
    // console.log(codeIataTo)

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
        currency: `${USER_CURRENCY}`
    });

    const headers = new Headers();
    headers.append('Authorization', 'Bearer AmaOk_eyJpZCI6MTYsImVtYWlsIjoibWFuYWdlcnNAaW5maW5pdHkuYnkifQ');


    try {
        showLoader();
        const response = await fetch(`${apiUrl}?${queryParams}`, {
            headers: headers,
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        // console.log(data)
        // console.log(firstDate)
        // console.log('daysAfter'+' '+daysAfter)
        // console.log('daysAfterToSend'+' '+ daysAfterToSend)
        return data;
    } catch (error) {
        hideLoader();
        throw new Error(error);
    }
};

const displayPrices = (prices, type) => {
    const allDayPrices = document.querySelectorAll('.day-price');
    allDayPrices.forEach(elem => elem.remove());
    // Find the minimum price
    const minPrice = Math.min(...prices.map(priceObj => priceObj.price));
    const cells = document.querySelectorAll('.air-datepicker-cell');
    cells.forEach(element => {
        const cellDateDay = element.getAttribute('data-date').padStart(2, '0');
        const cellDateMonth = String(Number(element.getAttribute('data-month')) + 1).padStart(2, '0');
        const cellDateYear = element.getAttribute('data-year');
        const cellDate = `${cellDateDay}.${cellDateMonth}.${cellDateYear}`;

        if (type === 'reRender') {
            prices.forEach(elem => {
                if (elem.date === cellDate) {
                    const divR = document.createElement('div');
                    divR.className = 'day-price';
                    if (elem.price === minPrice) {
                        divR.classList.add('green')
                    }
                    divR.innerHTML = `${elem.price}`;
        
                    // Check if elem.price has more than 6 characters
                    if (elem.price.length > 6) {
                        divR.style.fontSize = '9px';
                    }
        
                    element.append(divR);
                }
            });
        } else {
            prices.forEach(elem => {
                if (elem.date === cellDate) {
                    const div = document.createElement('div');
                    div.className = 'day-price';
                    if (elem.price === minPrice) {
                        div.classList.add('green')
                    }
                    div.innerHTML = `${elem.price}`;
        
                    // Check if elem.price has more than 6 characters
                    if (elem.price.length > 6) {
                        div.style.fontSize = '9px';
                    }
        
                    element.append(div);
                }
            });
        }
        
    });

};

function createBothWayCalendar(datepickerInputFrom, codeIataFrom, codeIataTo) {
    let selectedDate = null; // Переменная для хранения выбранной даты
    let typeRequest = 'start'; // Изначальное значение typeRequest

    const locale = MAIN_LANGUAGE === 'ru' ? localeRu : localeEn;

    const handleTripButtonClick = (dp) => {
        isRange = !isRange;
        dp.update({ range: isRange });

        const daysAfterToSend = calculateDaysAfter(dp.viewDate);

        // console.log(dp.viewDate)

        const button = dp.$datepicker.querySelector('.trip-btn');
        if (button) {
            button.classList.toggle('active', !isRange);
        }

        // Проверка на две выбранные даты
        if (!isRange && dp.selectedDates.length === 2) {
            // Сброс выбранных дат
            dp.clear();

            // Обновление полей ввода
            datepickerInputFrom.value = '';
            datepickerInputTo.value = '';
            selectedDate = null;

            // Обновление типа запроса
            typeRequest = 'start';

            // Обновление календаря с новой датой
            const viewDate = dp.viewDate;
            const formattedViewDate = formatDateToString(viewDate);
            updateCalendarDates(dp, formattedViewDate, daysAfterToSend, codeIataFrom, codeIataTo);
        }else if(dp.selectedDates.length === 0){
            const viewDate = dp.viewDate;
            const formattedViewDate = formatDateToString(viewDate);
            updateCalendarDates(dp, formattedViewDate, daysAfterToSend, codeIataFrom, codeIataTo);
        }else if(dp.selectedDates.length === 1){
            // Обновление типа запроса
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
        if (formattedDate.date[0] !== undefined) {
            selectedDate = formatDateToString(formattedDate.date[0]);
        }

        if (formattedDate.date[1] !== undefined) {
            handleSecondDateSelect(formattedDate);
        } else if (formattedDate.date[0] !== undefined) {
            handleFirstDateSelect(formattedDate);
        }
    };

    const handleFirstDateSelect = (formattedDate) => {
        datepickerInputTo.focus();
        datepicker.show();
        datepickerInputFrom.value = formattedDate.formattedDate[0];

        const firstDateToSend = formatDateToString(formattedDate.date[0]);
        const daysAfterToSend = calculateDaysAfter(formattedDate.date[0]);
        typeRequest = 'return';
        updateCalendarDates(datepicker, firstDateToSend, daysAfterToSend, codeIataFrom, codeIataTo);
    };

    const handleSecondDateSelect = (formattedDate) => {
        const firstDateToSend = formatDateToString(formattedDate.date[0]);
        const daysAfterToSend = calculateDaysAfter(formattedDate.date[0]);
        updateCalendarDates(datepicker, firstDateToSend, daysAfterToSend, codeIataFrom, codeIataTo);

        datepickerInputFrom.value = formattedDate.formattedDate[0];
        datepickerInputTo.value = formattedDate.formattedDate[1];
    };

    const handleShow = (inst) => {
        if (inst) {
            if (!isRange) {
                const button = datepicker.$datepicker.querySelector('.trip-btn');
                if (button) {
                    button.classList.toggle('active');
                }
            }
            

            const dateToSend = selectedDate ? selectedDate : formatDateToString(today);
            const viewDate = selectedDate ? new Date(selectedDate.split('.').reverse().join('-')) : today;
            datepicker.setViewDate(viewDate);
            updateCalendarDates(datepicker, dateToSend, undefined, codeIataFrom, codeIataTo);
        }
    };

    const handleChangeViewDate = ({ month, year }) => {
        month = month < 10 ? '0' + month : month.toString();
        const firstDateToSend = new Date(year, month, '01');
        const formattedFirstDate = formatDateToString(new Date(firstDateToSend));
        const daysAfterToSend = calculateDaysAfter(new Date(firstDateToSend));
        updateCalendarDates(datepicker, formattedFirstDate, daysAfterToSend, codeIataFrom, codeIataTo);
    };

    const updateCalendarDates = (dp, firstDateToSend, daysAfterToSend, codeIataFrom, codeIataTo) => {
        getFlightCalendar(firstDateToSend, daysAfterToSend, codeIataFrom, codeIataTo, typeRequest)
            .then(response => {
                if (response.status === 'error') {
                    hideLoader();
                    return;
                }
                const dates = response.result.map(entry => ({
                    date: entry.date,
                    price: entry.price
                }));
                displayPrices(dates, daysAfterToSend ? 'reRender' : '');
                hideLoader();
            });
    };

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
            handleShow(inst);
        },
        onChangeViewDate: function ({ month, year }) {
            handleChangeViewDate({ month, year });
        }
    });

    return datepickerBothWay;
}


function createTwoWayCharterCalendar(datepickerInputFrom, typeWay) {
    if (isRange === true) {
        typeWay = 'trip';
    } else {
        typeWay = 'one';
    }

    const locale = MAIN_LANGUAGE === 'ru' ? localeRu : localeEn;

    const renderCell = (dates, date, cellType) => {
        if (cellType === 'day') {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            const renderCellDate = `${year}-${month}-${day}`;

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
    };

    const updateCalendar = (dp, dates) => {
        dates.forEach(dateStr => {
            dp.enableDate(new Date(dateStr));
        });
        const earliestDate = new Date(Math.min(...dates.map(dateStr => new Date(dateStr))));
        dp.update({
            onRenderCell: ({ date, cellType }) => renderCell(dates, date, cellType)
        });
        dp.setViewDate(earliestDate);
        hideLoader();
    };

    const onTripButtonClick = (dp) => {
        dp.clear();
        isRange = !isRange;
        dp.update({
            range: isRange
        });

        setTimeout(() => {
            const button = dp.$datepicker.querySelector('.trip-btn');
            if (button) {
                datepickerInputTo.value = ''
                button.classList.toggle('active', !isRange);
            }
        }, 0);

        getFlightCharterCalendar(typeWay)
            .then(response => updateCalendar(dp, response.from));
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
            console.log(isRange)
            if (formattedDate.date[0] !== undefined) {
                if (formattedDate.date[1] == undefined) {
                    datepickerInputTo.focus();
                    datepicker.show();
                    datepickerInputFrom.value = formattedDate.formattedDate[0];
                } else if (formattedDate.date[1] !== undefined) {
                    datepickerInputFrom.value = formattedDate.formattedDate[0];
                    datepickerInputTo.value = formattedDate.formattedDate[1];
                }

                getFlightCharterCalendar(typeWay)
                    .then(response => {
                        const dates = response.back;
                        updateCalendar(datepickerTwoWayCharter, dates);
                    });
            }

            if (formattedDate.date[1] !== undefined) {
                setTimeout(() => {
                    datepickerInputFrom.value = formattedDate.formattedDate[0];
                    datepickerInputTo.value = formattedDate.formattedDate[1];
                }, 0);
            }
        },
        onShow: function (inst) {
            if (inst) {
                
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
        clearDatepickerValue()
        datepicker.setViewDate(today)
        typeRequest = 'start'
    }


})

$('#flightsearchform-locationto').on('change', function () {
    clearAllCache()
    if (datepicker != undefined || datepicker != null) {
        clearDatepickerValue()
        datepicker.setViewDate(today)
        typeRequest = 'start'
    }
})


document.querySelector('.remove-datepicker-date').addEventListener('click', () => {
    clearDatepickerValue()
})

function clearDatepickerValue(){
    datepickerInputFrom.value = "";
    datepickerInputTo.value = "";
    isRange = true;
    datepicker.update({
        range: isRange
    });
    datepicker.clear();
}

