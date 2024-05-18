const blockedDates = [
    '2024-05-20',
    '2024-05-21',
    '2024-05-22'
];

const today = new Date();
// Переводим даты в строки
let todayString = formatDateToString(today);
let typeRequest = 'start';
let isMobileFlag = false;
let datepicker = null;

let charterFlightCache = null;
let charterDirectionsCache = null;

const datepickerInput = document.querySelector('.form-control.form-control-solid.form-control-lg');

let codeIataFrom = document.getElementById('flightsearchform-locationfrom').options[1].value;
let codeIataTo = document.getElementById('flightsearchform-locationto').options[1].value;
const radioButtons = document.querySelectorAll('.flight-route');
const charterCheckbox = document.querySelector('.charter-checkbox');

const inputCharterFrom = document.getElementById('input-charter-class-from');
const inputCharterTo = document.getElementById('input-charter-class-to');

const charterInputFrom = document.getElementById('charter-input-from');
const charterInputTo = document.getElementById('charter-input-to');

const defaultInputFrom = document.getElementById('input-default-flights-from');
const defaultInputTo = document.getElementById('input-default-flights-to');

let radioButtonValue = radiobuttonValueCheck();

if (window.innerWidth < 767) {
    isMobileFlag = true
}

//Изначальное отображение календаря
if (datepickerInput) {
    datepicker = createOneWayCalendar(datepickerInput, codeIataFrom, codeIataTo);
}

function radiobuttonValueCheck() {

    let rdbValue = null;
    radioButtons.forEach(radioButton => {
        if (radioButton.checked) {
            rdbValue = radioButton.value;
        }

    });
    return rdbValue;
}

radioButtons.forEach(radioButton => {
    radioButton.addEventListener('change', () => {
        datepickerInput.innerHTML = '';
        datepickerInput.value = '';
        inputCharterFrom.value = ''
    inputCharterFrom.innerHTML = ''
    inputCharterTo.value = ''
    inputCharterTo.innerHTML = ''
        radioButtonValue = radioButton.value;

        if (radioButtonValue == 'trip' && !charterCheckbox.checked) {
            datepicker.destroy()
            codeIataFrom = document.getElementById('flightsearchform-locationfrom').options[1].value;
            codeIataTo = document.getElementById('flightsearchform-locationto').options[1].value;

            datepicker = createBothWayCalendar(datepickerInput, codeIataFrom, codeIataTo);
        }
        else if (radioButtonValue == 'one' && !charterCheckbox.checked) {
            datepicker.destroy()

            codeIataFrom = document.getElementById('flightsearchform-locationfrom').options[1].value;
            codeIataTo = document.getElementById('flightsearchform-locationto').options[1].value;

            datepicker = createOneWayCalendar(datepickerInput, codeIataFrom, codeIataTo);
        } else if (radioButtonValue == 'trip' && charterCheckbox.checked) {
            datepicker.destroy()
            datepicker = createTwoWayCharterCalendar(datepickerInput, 'twoWay')
        }
        else if (radioButtonValue == 'one' && charterCheckbox.checked) {
            datepicker.destroy()

            datepicker = createOneWayCharterCalendar(datepickerInput, 'oneWay')
        }
    });

});

charterCheckbox.addEventListener('change', () => {
    radioButtonValue = radiobuttonValueCheck()
    datepickerInput.innerHTML = '';
    datepickerInput.value = '';

    inputCharterFrom.value = ''
    inputCharterFrom.innerHTML = ''
    inputCharterTo.value = ''
    inputCharterTo.innerHTML = ''
    // console.log(radioButtonValue)
    if (charterCheckbox.checked) {

        charterInputFrom.classList.toggle('active');
        charterInputTo.classList.toggle('active');

        defaultInputFrom.classList.toggle('hide');
        defaultInputTo.classList.toggle('hide');


        datepicker.destroy()
        if (radioButtonValue == 'one') {

            datepicker = createOneWayCharterCalendar(datepickerInput, 'oneWay')
        } else if (radioButtonValue == 'trip') {
            datepicker = createTwoWayCharterCalendar(datepickerInput, 'twoWay')
            
        }

    } else {
        // datepicker.destroy()
        charterInputFrom.classList.toggle('active');
        charterInputTo.classList.toggle('active');

        defaultInputFrom.classList.toggle('hide');
        defaultInputTo.classList.toggle('hide');
    }
    
})



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

function findFlightData(from, to) {
    for (const [flight, data] of Object.entries(flightsWithDates)) {
        if (data.from === from && data.to === to) {
            return data;
        }
    }
    return null; // если ничего не найдено
}


const splitFlightsData = (data) => {
    const newData = {};

    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const fromCode = key.slice(0, 3);
            const toCode = key.slice(3);

            if (!newData[fromCode]) {
                newData[fromCode] = {};
            }

            newData[fromCode][toCode] = {
                from: parseDates(data[key].from),
                back: parseDates(data[key].back)
            };
        }
    }

    return newData;
};

// Функция для парсинга дат (учитывает возможность массивов и объектов)
const parseDates = (dates) => {
    if (Array.isArray(dates)) {
        return dates; // Возвращаем массив, если dates является массивом
    } else if (typeof dates === 'object') {
        // Преобразуем объект в массив значений (в данном случае берем только значения)
        return Object.values(dates);
    } else {
        return []; // Возвращаем пустой массив по умолчанию, если формат не распознан
    }
};

async function getFlightCharterCalendar(typeWay, codeIataFrom, codeIataTo) {
    const apiUrl = 'https://chartertickets.com.ua/api/avia';
    const token = 'MjFL6mR6DGfHDA9Y3d_rDB60D-sK9MXV';

    codeIataFrom = inputCharterFrom.value;
    codeIataTo = inputCharterTo.value;

    console.log(typeWay)

    try {
        showLoader();
        const response = await fetch(`${apiUrl}/${typeWay}/dates?token=${token}`);
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        let flightData = null;

        if (typeWay == 'oneWay') {
            const formattedFlights = Object.entries(data).reduce((acc, [flight, dates]) => {
                const from = flight.slice(0, 3);
                const to = flight.slice(3);
                acc[flight] = { from, to, dates };
                return acc;
            }, {});

            // Функция для поиска рейса по заданным параметрам
            const findFlightData = (formattedFlights, from, to) => {
                for (const [flight, data] of Object.entries(formattedFlights)) {
                    if (data.from === from && data.to === to) {
                        return data;
                    }
                }
                return null; // если ничего не найдено
            };

            // Поиск рейсов по заданным параметрам
            flightData = findFlightData(formattedFlights, codeIataFrom, codeIataTo);
        } else {
            const newFormattedFlightsData = splitFlightsData(data);
                const getFlightData = (data, fromCode, toCode) => {
                    if (data[fromCode] && data[fromCode][toCode]) {
                        return {
                            from: data[fromCode][toCode].from,
                            back: data[fromCode][toCode].back
                        };
                    } else {
                        return null;  // Возвращаем null, если данные не найдены
                    }
                };
                flightData = getFlightData(newFormattedFlightsData, codeIataFrom, codeIataTo);

            
        }

        
        return flightData

    } catch (error) {
        throw new Error('There was a problem with your fetch operation:', error);
    }
}

async function getFlightCharterDirectionsCalendar() {
    const apiUrl = 'https://chartertickets.com.ua/api/avia/directions';
    const token = 'MjFL6mR6DGfHDA9Y3d_rDB60D-sK9MXV';

    try {
        const response = await fetch(`${apiUrl}?token=${token}`);
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        // console.log(data);
        const flightObject = data.reduce((acc, flight) => {
            const from = flight.slice(0, 3);
            const to = flight.slice(3);
            acc[flight] = { from, to };
            return acc;
        }, {});

        
        return flightObject;
    } catch (error) {
        throw new Error('There was a problem with your fetch operation:', error);
    }
}

const getFlightCalendar = async (firstDateToSend, daysAfterToSend, codeIataFrom, codeIataTo, typeRequest) => {
    const apiUrl = 'https://api.travelhub.by/flight/calendar';

    codeIataFrom = document.getElementById('flightsearchform-locationfrom').options[1].value;
    codeIataTo = document.getElementById('flightsearchform-locationto').options[1].value;


    let firstDate = todayString;
    let daysAfter = calculateDaysAfter(today);
    let daysBefore = '5'
    let termIata = null;
    if (firstDateToSend != undefined) {
        firstDate = firstDateToSend
    }
    if (daysAfterToSend != undefined) {
        daysAfter = daysAfterToSend;
        // daysBefore = 0;
    }

    if (typeRequest == 'return') {

        termIata = codeIataFrom;
        codeIataFrom = codeIataTo;
        codeIataTo = termIata;

    }

    const queryParams = new URLSearchParams({
        route: 'one',
        locationFrom: `${codeIataFrom}`,
        locationTo: `${codeIataTo}`,
        date: `${firstDate}`,
        adults: '1',
        children: '0',
        infants: '0',
        cabinClass: 'economy',
        daysBefore: `${daysBefore}`,
        daysAfter: `${daysAfter}`
    });

    const headers = new Headers();
    headers.append('Authorization', 'Bearer AmaOk_eyJpZCI6MTYsImVtYWlsIjoibWFuYWdlcnNAaW5maW5pdHkuYnkifQ');

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

        return data;
    } catch (error) {
        throw new Error('There was a problem with your fetch operation:', error);
    }
};

const displayPrices = (prices, type) => {
    const allDayPrices = document.querySelectorAll('.day-price');
    allDayPrices.forEach(elem => elem.remove());
    // Find the minimum price
    const minPrice = Math.min(...prices.map(priceObj => priceObj.price));
    // console.log(minPrice)
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
                    element.append(div);
                }
            });
        }
    });

};


function showLoader() {
    const loader = document.querySelector('.loader-calendar-wrapper.calendar');
    if (loader) {
        loader.remove()
    }
    const airDatepickerContent = document.querySelector('.air-datepicker--content');
    airDatepickerContent.style.position = 'relative'
    const div = document.createElement('div');
    div.classList.add('loader-calendar-wrapper');
    div.classList.add('calendar')
    div.innerHTML = `<div class="loader-calendar" id="loader-calendar"></div>`
    airDatepickerContent.appendChild(div)
}

function hideLoader() {
    const loader = document.querySelector('.loader-calendar-wrapper.calendar');
    loader.style.display = 'none';
}

function createBothWayCalendar(datepickerInput, codeIataFrom, codeIataTo) {

    let datepickerBothWay = new AirDatepicker(datepickerInput, {
        language: 'en',
        inline: false,
        minDate: new Date(),
        isMobile: isMobileFlag,
        autoClose: true,
        multipleDatesSeparator: ' - ',
        range: true,
        numberOfMonths: 2,
        onSelect: function (formattedDate, date, inst) {
            if (formattedDate.date[1] != undefined) {
                const firstDateToSend = formatDateToString(formattedDate.date[0]);
                const daysAfterToSend = calculateDaysAfter(formattedDate.date[0]);
                getFlightCalendar(firstDateToSend, daysAfterToSend, codeIataFrom, codeIataTo, typeRequest)
                    .then(response => {
                        const dates = response.result.map(entry => ({
                            date: entry.date,
                            price: entry.price
                        }));
                        displayPrices(dates, 'reRender');
                        //   hideLoader();

                    });
            } else {
                const firstDateToSend = formatDateToString(formattedDate.date[0]);
                const daysAfterToSend = calculateDaysAfter(formattedDate.date[0]);
                typeRequest = 'return'
                getFlightCalendar(firstDateToSend, daysAfterToSend, codeIataFrom, codeIataTo, typeRequest)
                    .then(response => {
                        const dates = response.result.map(entry => ({
                            date: entry.date,
                            price: entry.price
                        }));
                        displayPrices(dates, 'reRender');
                        hideLoader();
                    });
            }


        },
        onShow: function (inst) {
            if (inst) {
                getFlightCalendar(undefined, undefined, codeIataFrom, codeIataTo, typeRequest)
                    .then(response => {
                        const dates = response.result.map(entry => ({
                            date: entry.date,
                            price: entry.price
                        }));
                        displayPrices(dates);
                        hideLoader();
                    });
                // datepickerBothWay.destroy()
            }
        },
        onChangeViewDate: function ({ month, year }) {
            const firstDateToSend = `${month + 1}.01.${year}`;
            const formattedFirstDate = formatDateToString(new Date(firstDateToSend));
            const daysAfterToSend = calculateDaysAfter(new Date(firstDateToSend));
            getFlightCalendar(formattedFirstDate, daysAfterToSend, codeIataFrom, codeIataTo, typeRequest)
                .then(response => {
                    const dates = response.result.map(entry => ({
                        date: entry.date,
                        price: entry.price
                    }));
                    displayPrices(dates);
                    hideLoader();
                });
        }
    })
    return datepickerBothWay;
}

function createOneWayCalendar(datepickerInput, codeIataFrom, codeIataTo) {
    let datepickerOneWay = new AirDatepicker(datepickerInput, {
        language: 'en',
        inline: false,
        minDate: new Date(),
        isMobile: isMobileFlag,
        autoClose: true,
        range: false,
        numberOfMonths: 2,
        onSelect: function (formattedDate, date, inst) {
            // datepickerOneWay.hide()
        },
        onShow: function (inst) {
            if (inst) {
                getFlightCalendar(undefined, undefined, codeIataFrom, codeIataTo, typeRequest)
                    .then(response => {
                        const dates = response.result.map(entry => ({
                            date: entry.date,
                            price: entry.price
                        }));
                        displayPrices(dates);
                        hideLoader();
                    });
            }
        },
        onChangeViewDate: function ({ month, year }) {
            const firstDateToSend = `${month + 1}.01.${year}`;
            const formattedFirstDate = formatDateToString(new Date(firstDateToSend));
            const daysAfterToSend = calculateDaysAfter(new Date(firstDateToSend));
            getFlightCalendar(formattedFirstDate, daysAfterToSend, codeIataFrom, codeIataTo, typeRequest)
                .then(response => {
                    const dates = response.result.map(entry => ({
                        date: entry.date,
                        price: entry.price
                    }));
                    displayPrices(dates);
                    hideLoader();
                });
        }
    })
    return datepickerOneWay;
}

function createOneWayCharterCalendar(datepickerInput, typeWay) {
    let datepickerCharter = new AirDatepicker(datepickerInput, {
        language: 'en',
        inline: false,
        minDate: new Date(),
        isMobile: isMobileFlag,
        autoClose: true,
        range: false,
        numberOfMonths: 2,
        onSelect: function (formattedDate, date, inst) {
            // datepickerOneWay.hide()
        },
        onShow: function (inst) {
            if (inst) {

                console.log(typeWay)
                getFlightCharterCalendar(typeWay)
                    .then(response => {


                        const dates = response.dates;
                        console.log(dates)
                        // const dates = response.result.map(entry => ({
                        //     date: entry.date,
                        //     price: entry.price
                        // }));
                        datepicker.update({
                            onRenderCell: ({ date, cellType }) => {
                                if (cellType === 'day') {
                                    const dateString = date.toISOString().split('T')[0];
                                    const day = String(date.getDate()).padStart(2, '0');
                                    const month = String(date.getMonth() + 1).padStart(2, '0');
                                    const year = date.getFullYear();
                                    const renderCellDate = `${year}-${month}-${day}`;

                                    // console.log(renderCellDate)
                                    // console.log(dateString)

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
                        });

                        // displayCharterDates(dates);
                        hideLoader();
                    });

            }

        },
    })
    return datepickerCharter;
}

function createTwoWayCharterCalendar(datepickerInput, typeWay) {
    let datepickerTwoWayCharter = new AirDatepicker(datepickerInput, {
        language: 'en',
        inline: false,
        minDate: new Date(),
        isMobile: isMobileFlag,
        autoClose: true,
        range: true,
        numberOfMonths: 2,
        onSelect: function (formattedDate, date, inst) {
            if (formattedDate.date[0] != undefined) {
                console.log(formattedDate.date[0])
                getFlightCharterCalendar(typeWay)
                    .then(response => {
                        

                        const dates = response.back;
                        datepicker.update({
                            onRenderCell: ({ date, cellType }) => {
                                if (cellType === 'day') {
                                    const day = String(date.getDate()).padStart(2, '0');
                                    const month = String(date.getMonth() + 1).padStart(2, '0');
                                    const year = date.getFullYear();
                                    const renderCellDateTwoWay = `${year}-${month}-${day}`;

                                    const renderCellDateFormat = new Date(renderCellDateTwoWay);
                                    
                                    if (dates.includes(renderCellDateTwoWay) && renderCellDateFormat > formattedDate.date[0]) {
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
                        });
                        hideLoader();
                    });
            } 


        },
        onShow: function (inst) {
            if (inst) {


                getFlightCharterCalendar(typeWay)
                    .then(response => {
                        

                        const dates = response.from;
                        datepicker.update({
                            onRenderCell: ({ date, cellType }) => {
                                if (cellType === 'day') {
                                    const day = String(date.getDate()).padStart(2, '0');
                                    const month = String(date.getMonth() + 1).padStart(2, '0');
                                    const year = date.getFullYear();
                                    const renderCellDateTwoWay = `${year}-${month}-${day}`;

                                    if (dates.includes(renderCellDateTwoWay)) {
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
                        });
                        hideLoader();
                    });

            }

        },
    })
    return datepickerTwoWayCharter;
}


if (inputCharterFrom != undefined) {
    const dropdownCharter = document.getElementById('dropdown-charter-from');
    const dropDownCharterList = document.getElementById('dropdown-charter-list-country-from');
    const dropDownCharterListCity = document.getElementById('dropdown-charter-list-city-from');
    inputCharterFrom.addEventListener('click', function (event) {
        showLoaderCharter('from')
        dropdownCharter.style.display = 'grid';

        getFlightCharterDirectionsCalendar()
            .then(response => {
                const uniqueFromSet = new Set();
                dropDownCharterList.innerHTML = ''
                // Перебираем ключи объекта flightsData
                Object.keys(response).forEach(key => {
                    const flight = response[key];
                    const { from } = flight;

                    if (!uniqueFromSet.has(from)) { // Проверяем, есть ли такой `from` в множестве
                        uniqueFromSet.add(from); // Добавляем `from` в множество

                        const divElement = document.createElement('div');
                        divElement.classList.add('dropdown-charter-item');
                        divElement.textContent = from;
                        dropDownCharterList.appendChild(divElement); // Добавляем div с `from` в контейнер
                        // Добавляем обработчик клика для div
                        divElement.addEventListener('click', (event) => {
                            inputCharterFrom.value = divElement.textContent;
                            // console.log(divElement.textContent)
                        });
                    }

                });
                hideLoaderCharter('from')

            });
        document.addEventListener('click', function handleOutsideClick(event) {
            if (!inputCharterFrom.contains(event.target)) {
                dropdownCharter.style.display = 'none';
                document.removeEventListener('click', handleOutsideClick);
            }
        });


    })


}


if (inputCharterTo != undefined) {
    const dropdownCharterTo = document.getElementById('dropdown-charter-to');
    const dropDownCharterListTo = document.getElementById('dropdown-charter-list-country-to');
    const dropDownCharterListCityTo = document.getElementById('dropdown-charter-list-city-to');
    inputCharterTo.addEventListener('click', function (event) {
        showLoaderCharter('to')
        dropdownCharterTo.style.display = 'grid';

        getFlightCharterDirectionsCalendar()
            .then(response => {
                dropDownCharterListTo.innerHTML = ''
                // Перебираем ключи объекта flightsData
                Object.keys(response).forEach(innerKey => {
                    const innerFlight = response[innerKey];
                    if (innerFlight.from === inputCharterFrom.value) {
                        // console.log(`Key: ${innerKey}, From: ${innerFlight.from}, To: ${innerFlight.to}`);
                        // console.log(innerFlight.to);
                        const divElement = document.createElement('div');
                        divElement.classList.add('dropdown-charter-item');
                        divElement.textContent = innerFlight.to;
                        dropDownCharterListTo.appendChild(divElement);
                        divElement.addEventListener('click', (event) => {
                            inputCharterTo.value = divElement.textContent;
                        });
                    }
                });
                hideLoaderCharter('to')

            });
        document.addEventListener('click', function handleOutsideClick(event) {
            if (!inputCharterTo.contains(event.target)) {
                dropdownCharterTo.style.display = 'none';
                document.removeEventListener('click', handleOutsideClick);
            }
        });


    })


}


function showLoaderCharter(typeS) {
    // console.log(typeS)
    const loader = document.querySelector(`.loader-calendar-wrapper.${typeS}`);
    loader.style.display = 'block'


}

function hideLoaderCharter(typeH) {
    // console.log(typeH)
    const loader = document.querySelector(`.loader-calendar-wrapper.${typeH}`);
    loader.style.display = 'none';
}