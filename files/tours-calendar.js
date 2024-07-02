const today = new Date();
let countNightsArr = []

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

const datepickerTourInput = document.getElementById('tours-calendar');
const clearDatepickerBtn = document.querySelector('.remove-datepicker-date.tour');
// console.log(datepickerTourInput)

const cityId = $('#cities').val();
const countryId = $('#country-id').val();


let isMobileFlag = window.matchMedia("only screen and (max-width: 760px)").matches;

let datepicker = null;
let todayString = formatDateToString(today);

function formatDateToString(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

const ONE_HOUR = 3600000; // Один час в миллисекундах

// Функция для получения кэшированных данных из локального хранилища с проверкой срока действия
const getCachedDataToursFlights = (cityId, countryId) => {
    const key = `toursData_${cityId}_${countryId}`;
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
const setLocalStorageToursFlights = (data, cityId, countryId) => {
    const item = {
        data,
        expiry: Date.now() + ONE_HOUR, // Срок действия один час
    };
    const key = `toursData_${cityId}_${countryId}`;
    localStorage.setItem(key, JSON.stringify(item));
};

async function getFlightToursCalendar(typeWay, cityId, countryId) {
    cityId = $('#cities').val();
    countryId = $('#country-id').val();
    countNightsArr = [];
    const countNights = document.querySelectorAll('.select2-selection__choice');
    countNights.forEach(elem => {
        countNightsArr.push(elem.title)
    });

    let adultCounter = document.getElementById('adult-counter').innerHTML;
    let childrenCounter = document.getElementById('children-counter').innerHTML;

    const apiUrl = 'https://api.travelhub.by/tour/dates'

    const queryParams = new URLSearchParams({
        cityId: `${cityId}`,
        countryId: `${countryId}`,
        adults: `${adultCounter}`,
        children: `${childrenCounter}`,
        nights: `${countNightsArr}`,
    });

    const headers = new Headers();
    headers.append('Authorization', 'Bearer AmaOk_eyJpZCI6MTYsImVtYWlsIjoibWFuYWdlcnNAaW5maW5pdHkuYnkifQ');

    const cachedData = getCachedDataToursFlights(cityId, countryId);
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
        if (data.dates.length != 0) {
            setLocalStorageToursFlights(data, cityId, countryId);
        }
        return data;
    } catch (error) {
        hideLoader()
        throw new Error(error);
    }
}

getFlightToursCalendar()

let datepickerTour = new AirDatepicker(datepickerTourInput, {
    locale: MAIN_LANGUAGE === 'ru' ? localeRu : localeEn,
    inline: false,
    minDate: new Date(),
    isMobile: isMobileFlag,
    autoClose: true,
    range: true,
    numberOfMonths: 2,
    multipleDatesSeparator: ' - ',
    showOtherMonths: false,
    onSelect: function (formattedDate, date, inst) {
    }, 
    onShow: function (inst) {
        if (inst) {
            getFlightToursCalendar()
                .then(response => {
                    const dates = response.dates;
                    const earliestDate = new Date(Math.min(...dates.map(dateStr => new Date(dateStr))));

                    datepickerTour.update({
                        onRenderCell: ({ date, cellType }) => {
                            dates.forEach(elem => {
                                datepickerTour.enableDate(new Date(elem))
                            })
                        }

                    })
                    datepickerTour.update({
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
                                        start: earliestDate,
                                    };
                                }
                            }
                        }
                    });
                    datepickerTour.setViewDate(earliestDate)

                    hideLoader();
                });
        }
    }
});


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

clearDatepickerBtn.addEventListener('click', (elem) => {

    datepickerTour.clear()
    // elem.target.parentElement.classList.remove('tour')
})
