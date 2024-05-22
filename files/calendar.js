const today = new Date();
// Переводим даты в строки
let todayString = formatDateToString(today);
let typeRequest = 'start';
let datepicker = null;

let charterFlightCache = null;
let charterDirectionsCache = null;

const datepickerInput = document.querySelector('.form-control.form-control-solid.form-control-lg');

let codeIataFrom = document.getElementById('flightsearchform-locationfrom').value;
let codeIataTo = document.getElementById('flightsearchform-locationto').value;

let codeIataFromArr = document.getElementById('flightsearchform-locationfrom').options;
let codeIatatoArr = document.getElementById('flightsearchform-locationto').options;

const radioButtons = document.querySelectorAll('.flight-route');
const charterCheckbox = document.querySelector('.charter-checkbox');

const inputCharterFrom = document.getElementById('input-charter-class-from');
const inputCharterTo = document.getElementById('input-charter-class-to');

const charterInputFrom = document.getElementById('charter-input-from');
const charterInputTo = document.getElementById('charter-input-to');

const defaultInputFrom = document.getElementById('input-default-flights-from');
const defaultInputTo = document.getElementById('input-default-flights-to');

let radioButtonValue = radiobuttonValueCheck();
//Change
let isMobileFlag = window.matchMedia("only screen and (max-width: 760px)").matches;
// console.log(isMobileFlag)
//Изначальное отображение календаря
if (datepickerInput) {
    datepicker = mainCreateDatepickers(datepickerInput,radioButtonValue, 'startDatepicker');
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



function mainCreateDatepickers (datepickerInput, radioButtonValue, typeRenderDatepicker){
    if (radioButtonValue == 'trip' && !charterCheckbox.checked) {
        if(typeRenderDatepicker != 'startDatepicker'){
            datepicker.destroy()
        }
        
        codeIataFrom = codeIataFromArr[codeIataFromArr.length - 1].value;
        codeIataTo = codeIatatoArr[codeIatatoArr.length - 1].value;

        datepicker = createBothWayCalendar(datepickerInput, codeIataFrom, codeIataTo);
    }
    else if (radioButtonValue == 'one' && !charterCheckbox.checked) {
        if(typeRenderDatepicker != 'startDatepicker'){
            datepicker.destroy()
        }

        codeIataFrom = codeIataFromArr[codeIataFromArr.length - 1].value;
        codeIataTo = codeIatatoArr[codeIatatoArr.length - 1].value;

        datepicker = createOneWayCalendar(datepickerInput, codeIataFrom, codeIataTo);
    } else if (radioButtonValue == 'trip' && charterCheckbox.checked) {
        if(typeRenderDatepicker != 'startDatepicker'){
            datepicker.destroy()
        }
        clearCharterFlightsCache('charterData');
        clearDirectionsCache();
        datepicker = createTwoWayCharterCalendar(datepickerInput, 'trip')
    }
    else if (radioButtonValue == 'one' && charterCheckbox.checked) {
        if(typeRenderDatepicker != 'startDatepicker'){
            datepicker.destroy()
        }
        clearCharterFlightsCache('charterData');
        clearDirectionsCache();
        datepicker = createOneWayCharterCalendar(datepickerInput, 'one')
    }
    return datepicker;
}



radioButtons.forEach(radioButton => {
    radioButton.addEventListener('change', () => {
        
    clearInputs();
        radioButtonValue = radioButton.value;

        datepicker = mainCreateDatepickers(datepickerInput,radioButtonValue);
    });

});

charterCheckbox.addEventListener('change', () => {
    radioButtonValue = radiobuttonValueCheck()
    clearInputs()
    // clearFlightCache('flightCache_');
    if (charterCheckbox.checked) {

        togglerInputsShowHide()


        datepicker.destroy()
        if (radioButtonValue == 'one') {

            datepicker = createOneWayCharterCalendar(datepickerInput, 'one')
        } else if (radioButtonValue == 'trip') {
            datepicker = createTwoWayCharterCalendar(datepickerInput, 'trip')
            
        }

    } else {
        togglerInputsShowHide()
    }
    
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


// Функция для получения кэшированных данных из локального хранилища
function getCachedDataCharterFlights(codeIataFrom,codeIataTo) {
    const cachedData = localStorage.getItem(`charterData_${codeIataFrom}_${codeIataTo}`);
    if (cachedData) {
        return JSON.parse(cachedData);
    }
    return null;
}

// Функция для сохранения данных в локальное хранилище
function setLocalStorageCharterFlights(data,codeIataFrom, codeIataTo) {
    const jsonData = JSON.stringify(data);
    localStorage.setItem(`charterData_${codeIataFrom}_${codeIataTo}`, jsonData);
}

async function getFlightCharterCalendar(typeWay, codeIataFrom, codeIataTo) {
    codeIataFrom = inputCharterFrom.getAttribute('iata-from');
    codeIataTo = inputCharterTo.getAttribute('iata-to');
    const apiUrl = 'https://api.travelhub.by/flight/charter-dates'

    const queryParams = new URLSearchParams({
        route: `${typeWay}`,
        locationFrom: `${codeIataFrom}`,
        locationTo: `${codeIataTo}`,
    });

    const headers = new Headers();
    headers.append('Authorization', 'Bearer AmaOk_eyJpZCI6MTYsImVtYWlsIjoibWFuYWdlcnNAaW5maW5pdHkuYnkifQ');

    const cachedData = getCachedDataCharterFlights(codeIataFrom,codeIataTo);
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
        setLocalStorageCharterFlights(data, codeIataFrom, codeIataTo);
        console.log(data)

        return data;
    } catch (error) {
        hideLoader()
        throw new Error('There was a problem with your fetch operation:', error);
    }
}


// Функция для получения кэшированных данных из локального хранилища
function getCachedDirectionsData() {
    const cachedData = localStorage.getItem('directionsData');
    if (cachedData) {
        return JSON.parse(cachedData);
    }
    return null;
}

// Функция для сохранения данных в локальное хранилище
function setLocalStorageDirectionsData(data) {
    const jsonData = JSON.stringify(data);
    localStorage.setItem('directionsData', jsonData);
}

async function getFlightCharterDirectionsCalendar() {
    const apiUrl = 'https://api.travelhub.by/flight/charter-directions';

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
        console.log(data)

        return data;
    } catch (error) {
        throw new Error('There was a problem with your fetch operation:', error);
    }

}


// Функция для получения кэшированных данных из локального хранилища
function getCachedFlightData(key) {
    const cachedData = localStorage.getItem(key);
    if (cachedData) {
        return JSON.parse(cachedData);
    }
    return null;
}

// Функция для сохранения данных в локальное хранилище
function setLocalStorageFlightData(key, data) {
    const jsonData = JSON.stringify(data);
    localStorage.setItem(key, jsonData);
}

// Функция для генерации уникального ключа для кэширования на основе параметров запроса
function generateCacheKey(firstDate, codeIataFrom, codeIataTo, typeRequest) {
    return `flightCache_${firstDate}_${codeIataFrom}_${codeIataTo}_${typeRequest}`;
}

// Основная функция для получения данных
const getFlightCalendar = async (firstDateToSend, daysAfterToSend, codeIataFrom, codeIataTo, typeRequest) => {
    const apiUrl = 'https://api.travelhub.by/flight/calendar';

    codeIataFrom = codeIataFromArr[codeIataFromArr.length - 1].value;
    codeIataTo = codeIatatoArr[codeIatatoArr.length - 1].value;
    
    let firstDate = todayString;
    
    let daysAfter = calculateDaysAfter(today);
    let daysBefore = '5';
    let termIata = null;
    // console.log(firstDate)
    if (firstDateToSend !== undefined) {
        // console.log(firstDateToSend)
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

    // console.log(firstDate);
    // console.log(codeIataFrom);
    // console.log(codeIataTo)

    const headers = new Headers();
    headers.append('Authorization', 'Bearer AmaOk_eyJpZCI6MTYsImVtYWlsIjoibWFuYWdlcnNAaW5maW5pdHkuYnkifQ');

    let monthToCacheKey = firstDate.split('.')[1]

    const cacheKey = generateCacheKey(monthToCacheKey, codeIataFrom, codeIataTo, typeRequest);

        const cachedData = getCachedFlightData(cacheKey);
        if (cachedData) {
            // console.log(cachedData)
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
        setLocalStorageFlightData(cacheKey, data);

        return data;
    } catch (error) {
        hideLoader();
        throw new Error('There was a problem with your fetch operation:', error);
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

function createBothWayCalendar(datepickerInput, codeIataFrom, codeIataTo) {
    let selectedDate = null; // Переменная для хранения выбранной даты
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
            selectedDate = formatDateToString(formattedDate.date[0]);
            // console.log(formatDateToString(formattedDate.date[0]))
            if (formattedDate.date[1] != undefined) {
                const firstDateToSend = formatDateToString(formattedDate.date[0]);
                const daysAfterToSend = calculateDaysAfter(formattedDate.date[0]);
                getFlightCalendar(firstDateToSend, daysAfterToSend, codeIataFrom, codeIataTo, typeRequest)
                    .then(response => {
                        if(response.status == 'error'){
                            hideLoader()
                        }
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
                if (selectedDate) {
                    // Устанавливаем сохраненную дату как текущую
                    // datepicker.setViewDate(selectedDate);
                    console.log(selectedDate)
                    getFlightCalendar(selectedDate, undefined, codeIataFrom, codeIataTo, typeRequest)
                    .then(response => {
                        if (response.status === 'error') {
                            hideLoader();
                        }
                        const dates = response.result.map(entry => ({
                            date: entry.date,
                            price: entry.price
                        }));
                        displayPrices(dates);
                        hideLoader();
                    });
                    
                }else{
                    getFlightCalendar(undefined, undefined, codeIataFrom, codeIataTo, typeRequest)
                    .then(response => {
                        if (response.status === 'error') {
                            hideLoader();
                        }
                        const dates = response.result.map(entry => ({
                            date: entry.date,
                            price: entry.price
                        }));
                        displayPrices(dates);
                        hideLoader();
                    });
                }
                
                
            }
        },
        onChangeViewDate: function ({ month, year }) {
            const firstDateToSend = `${month + 1}.01.${year}`;
            const formattedFirstDate = formatDateToString(new Date(firstDateToSend));
            const daysAfterToSend = calculateDaysAfter(new Date(firstDateToSend));
            getFlightCalendar(formattedFirstDate, daysAfterToSend, codeIataFrom, codeIataTo, typeRequest)
                .then(response => {
                    if(response.status == 'error'){
                        hideLoader()
                    }
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
    let selectedDate = null; // Переменная для хранения выбранной даты

    let datepickerOneWay = new AirDatepicker(datepickerInput, {
        language: 'en',
        inline: false,
        minDate: new Date(),
        isMobile: isMobileFlag,
        autoClose: true,
        range: false,
        numberOfMonths: 2,
        onSelect: function ({date, formattedDate, datepicker}){            
            selectedDate = formattedDate; // Сохраняем выбранную дату
        },
        onShow: function (inst) {
            if (inst) {
                if (selectedDate) {
                    // Устанавливаем сохраненную дату как текущую
                    // datepicker.setViewDate(selectedDate);

                    getFlightCalendar(selectedDate, undefined, codeIataFrom, codeIataTo, typeRequest)
                    .then(response => {
                        if (response.status === 'error') {
                            hideLoader();
                        }
                        const dates = response.result.map(entry => ({
                            date: entry.date,
                            price: entry.price
                        }));
                        displayPrices(dates);
                        hideLoader();
                    });
                    
                }else{
                    getFlightCalendar(undefined, undefined, codeIataFrom, codeIataTo, typeRequest)
                    .then(response => {
                        if (response.status === 'error') {
                            hideLoader();
                        }
                        const dates = response.result.map(entry => ({
                            date: entry.date,
                            price: entry.price
                        }));
                        displayPrices(dates);
                        hideLoader();
                    });
                }
                    
                
                
            }
        },
        onChangeViewDate: function ({ month, year }) {
            const firstDateToSend = `${month + 1}.01.${year}`;
            const formattedFirstDate = formatDateToString(new Date(firstDateToSend));
            const daysAfterToSend = calculateDaysAfter(new Date(firstDateToSend));
            getFlightCalendar(formattedFirstDate, daysAfterToSend, codeIataFrom, codeIataTo, typeRequest)
                .then(response => {
                    if (response.status === 'error') {
                        hideLoader();
                    }
                    const dates = response.result.map(entry => ({
                        date: entry.date,
                        price: entry.price
                    }));
                    displayPrices(dates);
                    hideLoader();
                });
        }
    });

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
                getFlightCharterCalendar(typeWay)
                    .then(response => {
                        const dates = response.dates;
                        console.log(response);

                        // Find the earliest date in the dates array
                        const earliestDate = new Date(Math.min(...dates.map(dateStr => new Date(dateStr))));

                        // console.log(earliestDate)

                        datepickerCharter.update({
                            // startDate: '2024-11-04', // Set the initial display date to the earliest date
                            
                            onRenderCell: ({ date, cellType }) => {
                                if (cellType === 'day') {
                                    const dateString = date.toISOString().split('T')[0];
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
                                            disabled: true,
                                            start:earliestDate,
                                        };
                                    }
                                }
                            }
                        });
                        datepickerCharter.setViewDate(earliestDate)

                        hideLoader();
                    });
            }
        },
    });
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
                getFlightCharterCalendar(typeWay)
                    .then(response => {
                        
                        
                        const dates = response.back;
                        console.log(response)
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
                        
                        console.log(response)
                        const dates = response.from;
                        const earliestDate = new Date(Math.min(...dates.map(dateStr => new Date(dateStr))));
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
                        datepickerTwoWayCharter.setViewDate(earliestDate)
                        hideLoader();
                    });

            }

        },
    })
    return datepickerTwoWayCharter;
}

//Change
function clearInputs (){
    datepickerInput.innerHTML = '';
    datepickerInput.value = '';
    inputCharterFrom.value = ''
    inputCharterFrom.innerHTML = ''
    inputCharterTo.value = ''
    inputCharterTo.innerHTML = '';
}
//Change
function togglerInputsShowHide (){
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

                const countries = new Set();
                const countryCityMap = {};
                const cityCodeMap = {};

                Object.entries(response).forEach(([cityCode, cityData]) => {
                    const countryName = cityData.country;
                    const cityName = cityData.title;

                    if (countryName) {
                        countries.add(countryName);
                        if (!countryCityMap[countryName]) {
                            countryCityMap[countryName] = [];
                        }
                        countryCityMap[countryName].push(cityName);
                        cityCodeMap[cityName] = cityCode;
                    }
                });

                countries.forEach(countryName => {
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
                                selectedCityCode = cityCodeMap[cityName];
                                selectedCityName = cityName;
                                inputCharterFrom.setAttribute('iata-from', selectedCityCode);
                                inputCharterFrom.value = selectedCityName;
                                dropdownCharter.style.display = 'none';
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

                const countriesTo = new Set();
                const countryCityMapTo = {};
                const cityCodeMapTo = {};

                if (selectedCityCode && response[selectedCityCode]) {
                    const directions = response[selectedCityCode].directions;

                    Object.entries(directions).forEach(([cityCode, cityName]) => {
                        const countryName = response[cityCode]?.country;

                        if (countryName) {
                            countriesTo.add(countryName);
                            if (!countryCityMapTo[countryName]) {
                                countryCityMapTo[countryName] = [];
                            }
                            countryCityMapTo[countryName].push(cityName);
                            cityCodeMapTo[cityName] = cityCode;
                        }
                    });

                    countriesTo.forEach(countryName => {
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
                                    const cityCode = cityCodeMapTo[cityName];
                                    inputCharterTo.setAttribute('iata-to', cityCode);
                                    inputCharterTo.value = cityName;
                                    dropdownCharterTo.style.display = 'none';
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
    if (loader) {
    loader.style.display = 'none';
    }
}

document.getElementById('input-charter-class-from').addEventListener('input', function() {
    let filter = this.value.toUpperCase();
    let items = document.querySelectorAll('#dropdown-charter-list-country-from .dropdown-charter-item');
    
    items.forEach(function(item) {
      if (item.textContent.toUpperCase().indexOf(filter) > -1) {
        item.style.display = ''; // Показать элемент
      } else {
        item.style.display = 'none'; // Скрыть элемент
      }
    });
  });


  document.getElementById('input-charter-class-to').addEventListener('input', function() {
    let filter = this.value.toUpperCase();
    let items = document.querySelectorAll('#dropdown-charter-list-country-to .dropdown-charter-item');
    
    items.forEach(function(item) {
      if (item.textContent.toUpperCase().indexOf(filter) > -1) {
        item.style.display = ''; // Показать элемент
      } else {
        item.style.display = 'none'; // Скрыть элемент
      }
    });
  });

  // Функция для очистки кэша данных о чартерных рейсах
function clearCharterFlightsCache(prefix) {
    
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(prefix)) {
            keysToRemove.push(key);
        }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
}

// Функция для очистки кэша данных о направлениях
function clearDirectionsCache() {
    localStorage.removeItem('directionsData');
}

// Функция для очистки кэша данных о рейсах
function clearFlightCache(prefix) {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(prefix)) {
            keysToRemove.push(key);
        }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
}

document.getElementById('input-charter-class-from').addEventListener('input', function() {
    if (this.value === '') {
        document.getElementById('input-charter-class-to').value = '';
    }
});

document.getElementById('input-charter-class-to').addEventListener('input', function() {
    if (this.value === '') {
        document.getElementById('input-charter-class-from').value = '';
    }
});

//ДОБАВИТЬ ВЫЗОВ ЭТОЙ ФУНКЦИИ ПРИ ПОИСКЕ НОВОМ
const searchBtnFlight = document.querySelector('.btn.btn-primary.search-btn');

searchBtnFlight.addEventListener('click',()=>{
    clearFlightCache('flightCache_');
})



