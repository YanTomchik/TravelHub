document.addEventListener("DOMContentLoaded", function() {
    const delay = 1000; 
    const overlay = document.getElementById('overlayTimer');
    const popup = document.getElementById('popupTimer');
    const refreshButton = document.getElementById('refreshTimer');
    const closeButton = document.getElementById('closeTimer');

    let timer;

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
    };

    function showPopup() {
        const text = texts[MAIN_LANGUAGE] || texts.en; 
        document.querySelector('.header-timer').innerText = text.header;
        document.querySelector('.description-timer').innerHTML = text.description;
        closeButton.innerText = text.close;
        refreshButton.innerText = text.refresh;

        overlay.style.display = 'block';
        popup.style.display = 'block';
    }

    function hidePopup() {
        overlay.style.display = 'none';
        popup.style.display = 'none';
    }
    
    function startTimer() {
        clearTimeout(timer); 
        timer = setTimeout(showPopup, delay); 
    }
    
    function refreshPage() {
        let locationFrom = document.getElementById('flightsearchform-locationfrom').value;
        let locationTo = document.getElementById('flightsearchform-locationto').value;
        let depDate = document.querySelector('.date-inputs-item.datepicker-avia-from').value;
        let retDate = document.querySelector('.date-inputs-item.datepicker-avia-to').value;
        let guests = getGuests();
        
        let newURL = `${HOST_URL}flights?departure=${locationFrom}&arrival=${locationTo}&date=${depDate}&dateEnd=${retDate}&guests=${guests}&run=1`;
        window.location.href = newURL;
    }

    refreshButton.addEventListener('click', function() {
        refreshPage();
    });

    closeButton.addEventListener('click', function() {
        hidePopup();
        startTimer();
    });

    
    document.querySelector('.btn.btn-primary.search-btn').addEventListener('click', function() {
        startTimer();  
    });
});

function getGuests() {
    return document.getElementById('guests').value;
}
