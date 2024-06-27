

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

const datepickerTourInput = document.getElementById('hotel-search-calendar');

const checkinDateInput = document.getElementById('hotel-book-checkin-date');
const checkoutDateInput = document.getElementById('hotel-book-checkout-date');

let isMobileFlag = window.matchMedia("only screen and (max-width: 760px)").matches;

let datepickerHotel = new AirDatepicker(datepickerTourInput, {
    locale: MAIN_LANGUAGE === 'ru' ? localeRu : localeEn,
    inline: false,
    minDate: new Date(),
    isMobile: isMobileFlag,
    autoClose: true,
    range: true,
    multipleDatesSeparator: ' - ',
    showOtherMonths: false,
    onSelect: function (formattedDate, date, inst) {
        if (formattedDate.formattedDate[0] != undefined) {
            checkinDateInput.textContent = formattedDate.formattedDate[0];
            checkinDateInput.value = formattedDate.formattedDate[0];
        }
        if (formattedDate.formattedDate[1] != undefined) {
            checkoutDateInput.textContent = formattedDate.formattedDate[1];
            checkoutDateInput.value = formattedDate.formattedDate[1];
        }
    },
})

document.querySelector('.remove-datepicker-date').addEventListener('click', () => {
    datepickerHotel.clear()
})

document.querySelector('.check').addEventListener('click',()=>{
    datepickerHotel.selectDate([today,`${new Date('06.02.2024')}`])
})


$(document).ready(function () {
    datepickerHotel.selectDate([today,`${new Date('06.02.2024')}`])
})
