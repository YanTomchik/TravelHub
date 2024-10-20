const today = new Date();
let countNightsArr = [];
let lastSelectedDate = null; // Для хранения последней выбранной даты
let lastVisibleDate = null;  // Для хранения последней видимой даты

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
        countNightsArr.push(elem.title);
    });

    let adultCounter = document.getElementById('adult-counter').innerHTML;
    let childrenCounter = document.getElementById('children-counter').innerHTML;

    const apiUrl = 'https://api.travelhub.by/tour/dates';

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
        if (data.dates.length != 0) {
            setLocalStorageToursFlights(data, cityId, countryId);
        }
        return data;
    } catch (error) {
        hideLoader();
        throw new Error(error);
    }
}

// let datepickerTour = new AirDatepicker(datepickerTourInput, {
//     locale: MAIN_LANGUAGE === 'ru' ? localeRu : localeEn,
//     inline: false,
//     minDate: new Date(),
//     isMobile: isMobileFlag,
//     autoClose: true,
//     range: true,
//     numberOfMonths: 2,
//     multipleDatesSeparator: ' - ',
//     showOtherMonths: false,
//     onSelect: function (formattedDate, date, inst) {
//         if (formattedDate.date && formattedDate.date.length > 0) {
//             const startDate = formattedDate.date[0];
//             const endDate = formattedDate.date[1];
            
//             if (startDate && endDate) {
//                 const diffTime = Math.abs(endDate - startDate);
//                 const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//                 console.log(diffDays)
//                 if (diffDays >= 3) {
//                     const errorMessage = MAIN_LANGUAGE === 'ru' 
//                         ? "Вы можете выбрать не более 3 дней" 
//                         : "You can select no more than 3 days";
//                     document.querySelector('.field-tours-calendar .help-block.help-block-error').textContent = errorMessage
//                     datepickerTour.clear();
                    
//                     return;
//                 }else{
//                     document.querySelector('.field-tours-calendar .help-block.help-block-error').textContent = ""
//                 }
//             }

//             lastSelectedDate = startDate; 
//             lastVisibleDate = datepickerTour.viewDate;
//         }
//     },
//     onShow: function (inst) {
//         if (inst) {
//             // getFlightToursCalendar()
//             //     .then(response => {
//             //         const dates = response.dates;
//             //         const earliestDate = new Date(Math.min(...dates.map(dateStr => new Date(dateStr))));

//             //         datepickerTour.update({
//             //             onRenderCell: ({ date, cellType }) => {
//             //                 dates.forEach(elem => {
//             //                     datepickerTour.enableDate(new Date(elem));
//             //                 });
//             //             }
//             //         });

//             //         datepickerTour.update({
//             //             onRenderCell: ({ date, cellType }) => {
//             //                 if (cellType === 'day') {
//             //                     const dateString = date.toISOString().split('T')[0];
//             //                     const day = String(date.getDate()).padStart(2, '0');
//             //                     const month = String(date.getMonth() + 1).padStart(2, '0');
//             //                     const year = date.getFullYear();
//             //                     const renderCellDate = `${year}-${month}-${day}`;
//             //                     if (dates.includes(renderCellDate)) {
//             //                         return {
//             //                             html: `<span class="available-date">${date.getDate()}</span>`,
//             //                             classes: 'charter-day'
//             //                         };
//             //                     } else {
//             //                         return {
//             //                             disabled: true,
//             //                             start: earliestDate,
//             //                         };
//             //                     }
//             //                 }
//             //             }
//             //         });

//             //         if (lastVisibleDate) {
//             //             datepickerTour.setViewDate(lastVisibleDate); // Устанавливаем видимую дату на последнюю видимую
//             //         } else {
//             //             datepickerTour.setViewDate(earliestDate);
//             //         }

//             //         hideLoader();
//             //     });
//         }
//     }
// });

let fullRange = false;
let formatSameDate = null;
let lastSelectDateCheck = null;

let datepickerTour = new AirDatepicker(datepickerTourInput, {
    locale: MAIN_LANGUAGE === 'ru' ? localeRu : localeEn,
    inline: false,
    minDate: new Date(),
    isMobile: isMobileFlag,
    autoClose: true,
    range: true,
    numberOfMonths: 2,
    dynamicRange:true,
    multipleDatesSeparator: ' - ',
    showOtherMonths: false,
    onSelect: function (formattedDate, date, inst) {
        if (formattedDate.date && formattedDate.date.length > 0) {
            const selectedDates = formattedDate.date;
            let startDate, endDate;

            if (selectedDates.length === 1) {
                startDate = selectedDates[0];
            } else {
                startDate = selectedDates[0];
                endDate = selectedDates[1];
            }

            // Дополнительная логика по блокировке дат
            if (startDate) {
                check = true;
                const maxDate = new Date(startDate.getTime());
                maxDate.setDate(maxDate.getDate() + 2); // Ограничиваем выбор на 3 дня

                datepickerTour.update({
                    onRenderCell: function ({ date, cellType }) {
                        if (cellType === 'day') {
                            if (date < startDate || date > maxDate) {
                                return {
                                    disabled: true,
                                };
                            }
                        }
                    }
                });
            }

            lastSelectedDate = startDate;
            lastVisibleDate = datepickerTour.viewDate;
        }

        if(fullRange && formattedDate.date.length == 1){
            datepickerTour.update({
                onRenderCell: function ({ date, cellType }) {
                    datepickerTour.enableDate(date);
                }
            });

            const startDate = formattedDate.date[0];

            if (startDate) {
                const maxDate = new Date(startDate.getTime());
                maxDate.setDate(maxDate.getDate() + 2); // Ограничиваем выбор до 3 дней

                // Обновляем логику блокировки дат
                datepickerTour.update({
                    onRenderCell: function ({ date, cellType }) {
                        if (cellType === 'day') {
                            if (date < startDate || date > maxDate) {
                                return {
                                    disabled: true,
                                };
                            }
                        }
                    }
                });
            }


            lastSelectedDate = startDate;
            lastVisibleDate = datepickerTour.viewDate;
        }
    },
    onShow: function (inst) {
        if (lastVisibleDate) {
            datepickerTour.setViewDate(lastVisibleDate); // Устанавливаем видимую дату на последнюю видимую
        }

        if(datepickerTour.selectedDates.length == 2){
            fullRange = true;
        }
    },
    onHide: function () {
        lastSelectDateCheck = null;
    }
});

const datepickerGlobalContainer = document.querySelector('.air-datepicker-global-container')

if(datepickerGlobalContainer){
    datepickerGlobalContainer.addEventListener('click', (cell) => {
        if (cell.target.matches('.air-datepicker-cell.-day-')) {
            if(lastSelectDateCheck == `${cell.target.dataset.date}.${cell.target.dataset.month}.${cell.target.dataset.year}`){
                datepickerTour.hide()
                formatSameDate = new Date(`${Number(cell.target.dataset.month)+1}.${cell.target.dataset.date}.${cell.target.dataset.year}`)
                datepickerTour.selectDate(formatSameDate)
            }
            lastSelectDateCheck = `${cell.target.dataset.date}.${cell.target.dataset.month}.${cell.target.dataset.year}`
        }
    });
}

function showLoader() {
    const loader = document.querySelector('.loader-calendar-wrapper.calendar');
    if (loader) {
        loader.remove();
    }
    const airDatepickerContent = document.querySelector('.air-datepicker--content');
    airDatepickerContent.style.position = 'relative';
    const div = document.createElement('div');
    div.classList.add('loader-calendar-wrapper');
    div.classList.add('calendar');
    div.innerHTML = `<div class="loader-calendar" id="loader-calendar"></div>`;
    airDatepickerContent.appendChild(div);
}

function hideLoader() {
    const loader = document.querySelector('.loader-calendar-wrapper.calendar');
    if (loader) {
        loader.style.display = 'none';
    }
}

if(clearDatepickerBtn){
    clearDatepickerBtn.addEventListener('click', (elem) => {
        datepickerTour.clear();
        datepickerTour.update({
            onRenderCell: function ({ date, cellType }) {
                datepickerTour.enableDate(date);
            }
        });
        lastSelectedDate = null; // Очищаем последнюю выбранную дату
        lastVisibleDate = null;  // Очищаем последнюю видимую дату
        lastSelectDateCheck = null;
        
    });
}

