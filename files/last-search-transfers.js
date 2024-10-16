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
        userCurrencyTofetch = 'USD';
    }

    // Сортировка массива по метке времени в обратном порядке
    const sortedSearches = searches.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const maxResults = isMobileFlagSearchResult ? 3 : sortedSearches.length;

    sortedSearches.slice(0, maxResults).forEach(({ search }) => {
        const link = document.createElement('a');
        link.href = `${search.searchLink}`;

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
        titleDiv.textContent = `${search.locationNameFrom} - ${search.locationNameTo}`;

        const descriptionDiv = document.createElement('div');
        descriptionDiv.className = 'description';
        const descriptionParts = [
            key === 'search_transfers' ? `${search.dateTo}${search.dateReturn ? ' - ' + search.dateReturn : ''}` : 
            `${search.dates}`,
            
            search.adultCounter > 0 ? `${search.adultCounter} ${search.adultCounter == 1 ? translationsHub.adult : translationsHub.adults}` :
            (search.adults > 0 ? `${search.adults} ${search.adults == 1 ? translationsHub.adult : translationsHub.adults}` : ''),
            
            search.childrenCounter > 0 ? `${search.childrenCounter} ${search.childrenCounter == 1 ? translationsHub.children : translationsHub.childrens}` :
            (search.children > 0 ? `${search.children} ${search.children == 1 ? translationsHub.children : translationsHub.childrens}` : ''),
            
            key === 'search_flights' && search.infantCounter > 0 ? `${search.infantCounter} ${search.infantCounter == 1 ? translationsHub.infant : translationsHub.infants}` : ''
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

const initTransfersPage = () => {
    document.querySelector('.search-btn-block.col-search-button').addEventListener('click', () => {
        const searchObj = {
            searchLink: window.location.href,
            locationNameFrom: $('#select2-location-from-container').text(),
            locationNameTo: $('#select2-location-to-container').text(),
            dateTo: $('#date-to').val(),
            dateReturn: $('#date-return').val(),
            adultCounter: document.getElementById('adults').textContent,
            childrenCounter: document.getElementById('childrens').textContent
        };
        
        if(searchObj.dateTo != ''){
            addSearchToLocalStorage(searchObj, 'search_transfers');
        }
    });
    updateLastSearchResults('search_transfers');
};

document.addEventListener('DOMContentLoaded', initTransfersPage);
