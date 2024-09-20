document.addEventListener("DOMContentLoaded", () => {

    const analyticsInputFrom = document.getElementById('analyticsInputFrom')
    const analyticsInputTo = document.getElementById('analyticsInputTo')

    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            // Закрываем другие открытые элементы
            document.querySelectorAll('.menu-item').forEach(el => {
                if (el !== item) el.classList.remove('open');
            });
            // Открываем выбранный элемент
            item.classList.toggle('open');
            console.log(item)
        });
    });

    const ctx = document.getElementById('expenseChart').getContext('2d');

    const data = {
        labels: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июль', 'Сентябрь', 'Октябрь', 'Ноябрь'],
        datasets: [
            {
                label: 'Авиабилеты',
                backgroundColor: '#FF4E50',
                data: [220000, 50000, 20000, 10000, 5000, 70000, 0, 20000, 10000],
                barThickness: 40
            },
            {
                label: 'ЖД билеты',
                backgroundColor: '#4682B4',
                data: [0, 30000, 0, 0, 0, 0, 0, 10000, 15000],
                barThickness: 40
            },
            {
                label: 'Отели',
                backgroundColor: '#FFD700',
                data: [0, 0, 0, 0, 0, 50000, 0, 0, 5000],
                barThickness: 40
            },
            {
                label: 'Трансферы',
                backgroundColor: '#8B4513',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 3000],
                barThickness: 40
            },
            {
                label: 'Другие',
                backgroundColor: '#008000',
                data: [0, 0, 0, 600000, 0, 0, 0, 0, 0],
                barThickness: 40
            }
        ]
    };

    const config = {
        type: 'bar',
        data: data,
        options: {
            maintainAspectRatio: false,
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 100000
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#000'
                    }
                }
            },
            interaction: {
                mode: 'nearest'
            },
            barPercentage: 1.0,
            categoryPercentage: 1.0,
            grouped: false // Отключает группировку столбцов
        }
    };

    new Chart(ctx, config);



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

// const datepickerTourInput = document.getElementById('hotel-search-calendar');

const checkinDateInput = document.getElementById('analyticsInputFrom');
const checkoutDateInput = document.getElementById('analyticsInputTo');

let isMobileFlag = window.matchMedia("only screen and (max-width: 760px)").matches;

let datepickerAnalytics = new AirDatepicker(analyticsInputFrom, {
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
    datepickerAnalytics.clear()
    checkinDateInput.value = ''
    checkoutDateInput.value = ''
})

});