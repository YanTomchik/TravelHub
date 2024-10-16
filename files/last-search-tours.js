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
        link.href = `${HOST_URL}?locationFrom=${search.locationFrom}&countryId=${search.countryId}&nights=${search.nightsCounter}&fixPeriod=${search.fixPeriod}&adults=${search.adultCounter}&children=${search.childrenCounter}&childAges=&priceFrom=${search.priceFrom}&priceTo=${search.priceTo}&currency=${userCurrencyTofetch}&hotels=${search.hotels}&resorts=${search.resorts}&category=${search.starsCounter}&meal=${search.mealCounter}&run=1`;

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
        titleDiv.textContent = `${search.locationName} - ${search.countryName}`;

        const descriptionDiv = document.createElement('div');
        descriptionDiv.className = 'description';
        let descriptionParts = [];

        if (key === 'search_tours') {
            descriptionParts.push(`${search.fixPeriod.split(';')[0].trim()} - ${search.fixPeriod.split(';')[1].trim()}`);
        } else {
            descriptionParts.push(`${search.dates}`);
        }

        if (search.adultCounter > 0) {
            if (search.adultCounter == 1) {
                descriptionParts.push(`${search.adultCounter} ${translationsHub.adult}`);
            } else {
                descriptionParts.push(`${search.adultCounter} ${translationsHub.adults}`);
            }
        }

        if (search.childrenCounter > 0) {
            if (search.childrenCounter == 1) {
                descriptionParts.push(`${search.childrenCounter} ${translationsHub.children}`);
            } else {
                descriptionParts.push(`${search.childrenCounter} ${translationsHub.childrens}`);
            }
        }

        if (key === 'search_flights' && search.infantCounter > 0) {
            if (search.infantCounter == 1) {
                descriptionParts.push(`${search.infantCounter} ${translationsHub.infant}`);
            } else {
                descriptionParts.push(`${search.infantCounter} ${translationsHub.infants}`);
            }
        }

        descriptionParts = descriptionParts.filter(part => part).join(' | ');

        descriptionDiv.textContent = descriptionParts;

        infoDiv.appendChild(titleDiv);
        infoDiv.appendChild(descriptionDiv);

        item.appendChild(iconDiv);
        item.appendChild(infoDiv);

        link.appendChild(item);
        listContainer.appendChild(link);
    });
};

const initToursPage = () => {
    document.querySelector('#kt_form .search-btn-block .search-btn').addEventListener('click', () => {
        const searchObj = {
            locationFrom: $('#toursearchform-locationfrom').val(),
            countryId: $('#country-id').val(),
            countryName: $('#select2-country-id-container').text(),
            locationName: $('#select2-toursearchform-locationfrom-container').text(),
            fixPeriod: document.getElementById('tours-calendar').value.replace(' - ', ';'),
            nightsCounter: Array.from(document.querySelectorAll('#nights option:checked')).map(option => option.value).join(', '),
            adultCounter: document.getElementById('adults-count').value,
            childrenCounter: document.getElementById('children-count').value,
            mealCounter: Array.from(document.querySelectorAll('#toursearchform-meal option:checked')).map(option => option.value).join(', '),
            starsCounter: Array.from(document.querySelectorAll('#toursearchform-category option:checked')).map(option => option.value).join(', '),
            priceFrom: document.getElementById('toursearchform-pricefrom').value,
            priceTo: document.getElementById('toursearchform-priceto').value,
            hotels: Array.from(document.querySelectorAll('.list-block-content .option-hotel input[type="checkbox"]:checked')).map(checkbox => checkbox.value).join(', '),
            resorts: Array.from(document.querySelectorAll('.list-block-content.resorts-list .option-resort input[type="checkbox"]:checked')).map(checkbox => checkbox.value).join(', ')
        };
        if(searchObj.fixPeriod != ''){
            addSearchToLocalStorage(searchObj, 'search_tours');
        }
        
    });
    updateLastSearchResults('search_tours');
};

document.addEventListener('DOMContentLoaded', initToursPage);
