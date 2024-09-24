const addSearchToLocalStorage = (searchObj, key) => {
    const searches = JSON.parse(localStorage.getItem(key) || '[]');

    const isDuplicate = searches.some(search => JSON.stringify(search.search) === JSON.stringify(searchObj));
    if (isDuplicate) {
        console.log('Duplicate search query, not adding to localStorage');
        return;
    }

    if (searches.length >= 5) {
        searches.pop(); // удаляем самый старый запрос
    }

    searches.unshift({ search: searchObj, timestamp: new Date().toISOString() }); // добавляем новый запрос в начало массива

    localStorage.setItem(key, JSON.stringify(searches));

    updateLastSearchResults(key);
};

const updateLastSearchResults = (key) => {
    const isMobileFlagSearchResult = window.matchMedia("only screen and (max-width: 760px)").matches;
    const container = document.querySelector('.last-search-results-container');
    const listContainer = document.querySelector('.last-search-result-list');
    const searches = JSON.parse(localStorage.getItem(key) || '[]');

    if (searches.length === 0) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'block';
    listContainer.innerHTML = '';
    let userCurrencyTofetch = USER_CURRENCY;

    if(userCurrencyTofetch == 'KZT'){
        userCurrencyTofetch = 'USD'
    }

    // Сортировка по метке времени в обратном порядке
    const sortedSearches = searches.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const maxResults = isMobileFlagSearchResult ? 3 : sortedSearches.length;

    sortedSearches.slice(0, maxResults).forEach(({ search }) => {
        const link = document.createElement('a');
        link.href = `${HOST_URL}flights?departure=${search.locationFrom}&arrival=${search.locationTo}&date=${search.depDate}&dateEnd=${search.retDate}&guests=${getGuests(search.adultCounter, search.childrenCounter, search.infantCounter)}&currency=${userCurrencyTofetch}&run=1`;

        const item = document.createElement('div');
        item.className = 'last-search-result-item';

        const iconDiv = document.createElement('div');
        iconDiv.className = 'last-search-result-item-icon';
        const img = document.createElement('img');
        img.src = HOST_URL + '/images/flight/last-search-icon.svg';
        img.alt = '';
        iconDiv.appendChild(img);

        const infoDiv = document.createElement('div');
        infoDiv.className = 'last-search-result-item-info';

        const titleDiv = document.createElement('div');
        titleDiv.className = 'title';
        titleDiv.textContent = `${search.locationFromTitle} - ${search.locationToTitle}`;

        const descriptionDiv = document.createElement('div');
        descriptionDiv.className = 'description';
        const descriptionParts = [
            `${search.depDate}${search.retDate ? ' - ' + search.retDate : ''}`,
            search.adultCounter > 0 ? `${search.adultCounter} ${search.adultCounter == 1 ? translationsHub.adult : translationsHub.adults}` : '',
            search.childrenCounter > 0 ? `${search.childrenCounter} ${search.childrenCounter == 1 ? translationsHub.children : translationsHub.childrens}` : '',
            search.infantCounter > 0 ? `${search.infantCounter} ${search.infantCounter == 1 ? translationsHub.infant : translationsHub.infants}` : ''
        ].filter(part => part).join(' | ');

        descriptionDiv.textContent = descriptionParts;

        infoDiv.appendChild(titleDiv);
        infoDiv.appendChild(descriptionDiv);

        item.appendChild(iconDiv);
        item.appendChild(infoDiv);

        link.appendChild(item);
        listContainer.appendChild(link);
    });
};

const initFlightsPage = () => {
    document.querySelector('#flights-search-form .btn.btn-primary.search-btn').addEventListener('click', () => {
        const searchObj = {
            locationFrom: document.getElementById('flightsearchform-locationfrom').value,
            locationTo: document.getElementById('flightsearchform-locationto').value,
            locationFromTitle: document.getElementById('select2-flightsearchform-locationfrom-container').textContent,
            locationToTitle: document.getElementById('select2-flightsearchform-locationto-container').textContent,
            depDate: document.querySelector('.date-inputs-item.datepicker-avia-from').value,
            retDate: document.querySelector('.date-inputs-item.datepicker-avia-to').value,
            adultCounter: document.getElementById('adult-counter').innerHTML,
            childrenCounter: document.getElementById('children-counter').innerHTML,
            infantCounter: document.getElementById('infant-counter').innerHTML
        };
        addSearchToLocalStorage(searchObj, 'search_flight');
    });

    updateLastSearchResults('search_flight')
    
};

document.addEventListener('DOMContentLoaded', initFlightsPage);
