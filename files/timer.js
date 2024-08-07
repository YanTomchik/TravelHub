document.addEventListener("DOMContentLoaded", function() {
    // const delay = 20 * 60 * 1000; // Таймер на 20 минут (20 * 60 * 1000 миллисекунд)
    const delay = 1000; // Для тестирования можно установить меньший интервал
    const overlay = document.getElementById('overlayTimer');
    const popup = document.getElementById('popupTimer');
    const refreshButton = document.getElementById('refreshTimer');
    const closeButton = document.getElementById('closeTimer');

    let timer;

    // Объект с текстами на разных языках
    const texts = {
        en: {
            header: "Search results may be outdated",
            description: "Ticket prices change several times a day. Update your search to get exact prices",
            close: "Later",
            refresh: "Refresh"
        },
        ru: {
            header: "Результаты могли устареть",
            description: "Цены на билеты меняются около 10 раз в день. Обновите поиск, чтобы увидеть точные цены.",
            close: "Позже",
            refresh: "Обновить"
        }
        // Добавьте другие языки по мере необходимости
    };

    // Функция для показа всплывающего окна
    function showPopup() {
        const text = texts[MAIN_LANGUAGE] || texts.en; // Используем английский по умолчанию, если язык не найден
        document.querySelector('.header-timer').innerText = text.header;
        document.querySelector('.description-timer').innerHTML = text.description;
        closeButton.innerText = text.close;
        refreshButton.innerText = text.refresh;

        overlay.style.display = 'block';
        popup.style.display = 'block';
    }

    // Функция для скрытия всплывающего окна
    function hidePopup() {
        overlay.style.display = 'none';
        popup.style.display = 'none';
    }

    // Функция для запуска таймера
    function startTimer() {
        clearTimeout(timer); // Очищаем предыдущий таймер, если он существует
        timer = setTimeout(showPopup, delay); // Устанавливаем новый таймер
    }

    // Функция для получения параметров и перенаправления на новый URL
    function refreshPage() {
        let locationFrom = document.getElementById('flightsearchform-locationfrom').value;
        let locationTo = document.getElementById('flightsearchform-locationto').value;
        let depDate = document.getElementById('flightsearchform-departuredate').value;
        let retDate = document.getElementById('flightsearchform-returndate').value;
        let guests = getGuests();
        
        let newURL = `${HOST_URL}flights?departure=${locationFrom}&arrival=${locationTo}&date=${depDate}&dateEnd=${retDate}&guests=${guests}&run=1`;
        window.location.href = newURL;
    }

    // Обработчик для кнопки "Обновить"
    refreshButton.addEventListener('click', function() {
        refreshPage();
    });

    // Обработчик для кнопки "Позже"
    closeButton.addEventListener('click', function() {
        hidePopup();
        startTimer(); // Перезапускаем таймер при закрытии окна
    });

    // Запускаем таймер при загрузке страницы
    startTimer();
});

// Функция для получения количества гостей
function getGuests() {
    return document.getElementById('guests').value;
}
