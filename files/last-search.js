const isMobileFlagSearchResult = window.matchMedia("only screen and (max-width: 760px)").matches;
const container = document.querySelector('.last-search-results-container');

function getGuests() {
    return document.getElementById('guests').value;
}

const addSearchToLocalStorage = (searchObj, key) => {
    const searches = JSON.parse(localStorage.getItem(key) || '[]');

    const isDuplicate = searches.some(search => JSON.stringify(search.search) === JSON.stringify(searchObj));
    if (isDuplicate) {
        console.log('Duplicate search query, not adding to localStorage');
        return;
    }

    if (searches.length >= 5) {
        searches.shift();
    }

    searches.push({ search: searchObj, timestamp: new Date().toISOString() });

    localStorage.setItem(key, JSON.stringify(searches));

    updateLastSearchResults(key);
};

// Функция для создания и обновления last-search-result-item элементов
const updateLastSearchResults = (key) => {
    
    const listContainer = document.querySelector('.last-search-result-list');
    const searches = JSON.parse(localStorage.getItem(key) || '[]');

    if (searches.length === 0) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'block';
    listContainer.innerHTML = '';

    const maxResults = isMobileFlagSearchResult ? 3 : searches.length;

    searches.slice(-maxResults).forEach(({ search }) => {
        const link = document.createElement('a');
        if (key === 'search_flights') {
            link.href = `${HOST_URL}flights?departure=${search.locationFrom}&arrival=${search.locationTo}&date=${search.depDate}&dateEnd=${search.retDate}&guests=${getGuests(search.adultCounter, search.childrenCounter, search.infantCounter)}&run=1`;
        } else if (key === 'search_hotels') {
            link.href = `${HOST_URL}hotels?location=${search.location}&locationName=${search.locationName}&partner=${search.partner}&checkin=${search.checkin}&checkout=${search.checkout}&guests=${search.guests}&run=1`;
        } else if (key === 'search_tours') {
            link.href = `${HOST_URL}tours?departureCity=${search.departureCity}&country=${search.country}&dates=${search.dates}&nights=${search.nights.join(',')}&adults=${search.adults}&children=${search.children}&run=1`;
        }

        const item = document.createElement('div');
        item.className = 'last-search-result-item';

        const iconDiv = document.createElement('div');
        iconDiv.className = 'last-search-result-item-icon';
        const img = document.createElement('img');
        img.src = './files/last-search-icon.svg';
        img.alt = '';
        iconDiv.appendChild(img);

        const infoDiv = document.createElement('div');
        infoDiv.className = 'last-search-result-item-info';

        const titleDiv = document.createElement('div');
        titleDiv.className = 'title';
        if (key === 'search_flights') {
            titleDiv.textContent = `${search.locationFromTitle} - ${search.locationToTitle}`;
        } else if (key === 'search_hotels') {
            titleDiv.textContent = `${search.locationName}`;
        } else if (key === 'search_tours') {
            titleDiv.textContent = `${search.departureCity} - ${search.country}`;
        } else if (key === 'search_transfers') {
            titleDiv.textContent = `${search.locationName}`;
        }

        const descriptionDiv = document.createElement('div');
        descriptionDiv.className = 'description';
        const descriptionParts = [
    key === 'search_flights' ? `${search.depDate} - ${search.retDate}` :
        key === 'search_transfers' ? `${search.dateTo} - ${search.dateReturn}` :
            key === 'search_hotels' ? `${search.checkin} - ${search.checkout}` :
                `${search.dates}`,
    search.adultCounter > 0 ? `${search.adultCounter} ${search.adultCounter == 1 ? 'взрослый' : 'взрослых'}` : 
        (search.adults > 0 ? `${search.adults} ${search.adults == 1 ? 'взрослый' : 'взрослых'}` : ''),
    search.childrenCounter > 0 ? `${search.childrenCounter} ${search.childrenCounter == 1 ? 'ребенок' : 'детей'}` : 
        (search.children > 0 ? `${search.children} ${search.children == 1 ? 'ребенок' : 'детей'}` : ''),
    key === 'search_flights' && search.infantCounter > 0 ? `${search.infantCounter} ${search.infantCounter == 1 ? 'младенец' : 'младенцев'}` : ''
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

// Функция для инициализации функционала для конкретной страницы
const initPage = () => {
    const path = window.location.pathname;

    const searchForms = {
        '/flights': {
            formSelector: '#flights-search-form .btn.btn-primary.search-btn',
            key: 'search_flights',
            getSearchObj: () => {
                const locationFrom = document.getElementById('flightsearchform-locationfrom').value;
                const locationTo = document.getElementById('flightsearchform-locationto').value;
                const locationFromTitle = document.getElementById('select2-flightsearchform-locationfrom-container').title;
                const locationToTitle = document.getElementById('select2-flightsearchform-locationto-container').title;
                const depDate = document.querySelector('.date-inputs-item.datepicker-avia-from').value;
                const retDate = document.querySelector('.date-inputs-item.datepicker-avia-to').value;
                const adultCounter = document.getElementById('adult-counter').innerHTML;
                const childrenCounter = document.getElementById('children-counter').innerHTML;
                const infantCounter = document.getElementById('infant-counter').innerHTML;
                let cabinClassContainer = document.getElementById('select2-cabin-class-container').innerHTML;

                if (cabinClassContainer === 'Эконом') {
                    cabinClassContainer = 'economy';
                } else if (cabinClassContainer === 'Бизнес') {
                    cabinClassContainer = 'business';
                }

                return {
                    locationFrom,
                    locationTo,
                    locationFromTitle,
                    locationToTitle,
                    depDate,
                    retDate,
                    adultCounter,
                    childrenCounter,
                    infantCounter,
                    cabinClassContainer
                };
            }
        },
        '/flights/index-new': {
            formSelector: '#flights-search-form .btn.btn-primary.search-btn',
            key: 'search_flights',
            getSearchObj: () => {
                const locationFrom = document.getElementById('flightsearchform-locationfrom').value;
                const locationTo = document.getElementById('flightsearchform-locationto').value;
                const locationFromTitle = document.getElementById('select2-flightsearchform-locationfrom-container').title;
                const locationToTitle = document.getElementById('select2-flightsearchform-locationto-container').title;
                const depDate = document.querySelector('.date-inputs-item.datepicker-avia-from').value;
                const retDate = document.querySelector('.date-inputs-item.datepicker-avia-to').value;
                const adultCounter = document.getElementById('adult-counter').innerHTML;
                const childrenCounter = document.getElementById('children-counter').innerHTML;
                const infantCounter = document.getElementById('infant-counter').innerHTML;
                let cabinClassContainer = document.getElementById('select2-cabin-class-container').innerHTML;

                if (cabinClassContainer === 'Эконом') {
                    cabinClassContainer = 'economy';
                } else if (cabinClassContainer === 'Бизнес') {
                    cabinClassContainer = 'business';
                }

                return {
                    locationFrom,
                    locationTo,
                    locationFromTitle,
                    locationToTitle,
                    depDate,
                    retDate,
                    adultCounter,
                    childrenCounter,
                    infantCounter,
                    cabinClassContainer
                };
            }
        },
        // '/hotels': {
        //     formSelector: '#properties-search-form .btn.btn-primary.search-btn',
        //     key: 'search_hotels',
        //     getSearchObj: () => {
        //         // const searchParams = new URLSearchParams(window.location.search);
        //         const location = $('#propertysearchform-location').val();
        //         const locationName = $('#select2-propertysearchform-location-container').text();

        //         const checkin = document.querySelector('input[name="PropertySearchForm[checkinDate]"]').value;
        //         const checkout = document.querySelector('input[name="PropertySearchForm[checkoutDate]"]').value;
        //         const partner = document.querySelector('input[name="PropertySearchForm[partner]"]').value;

        //         const guests = document.querySelector('input[name="PropertySearchForm[guests]"]').value;
        //         const adultCounter = document.getElementById('adults').textContent;
        //         const childrenCounter = document.getElementById('children').textContent;

        //         return {
        //             location,
        //             locationName,
        //             checkin,
        //             checkout,
        //             guests,
        //             adultCounter,
        //             childrenCounter,
        //             partner
        //         };
        //     }
        // },
        // '/': {
        //     formSelector: '#kt_form .search-btn-block .search-btn',
        //     key: 'search_tours',
        //     getSearchObj: () => {
        //         const departureCity = document.getElementById('select2-cities-container').title;
        //         const country = document.getElementById('select2-country-id-container').title;
        //         const dates = document.getElementById('tours-calendar').value;
        //         const nights = Array.from(document.querySelectorAll('#nights option:checked')).map(option => option.value);
        //         const adults = document.getElementById('adults-count').value;
        //         const children = document.getElementById('children-count').value;

        //         return {
        //             departureCity,
        //             country,
        //             dates,
        //             nights,
        //             adults,
        //             children
        //         };
        //     }
        // },
        // '/transfers': {
        //     formSelector: '.search-btn-block.col-search-button',
        //     key: 'search_transfers',
        //     getSearchObj: () => {
        //         const searchParams = new URLSearchParams(window.location.search);
        //         const fromId = searchParams.get('location');
        //         const locationName = $('#select2-location-from-container').text();
        //         const dateTo = searchParams.get('dateTo');
        //         const dateReturn = searchParams.get('dateReturn');
        //         const toId = searchParams.get('toId');
        //         const adultCounter = document.getElementById('adults');
        //         const childrenCounter = document.getElementById('children');

        //         return {
        //             fromId,
        //             locationName,
        //             dateTo,
        //             dateReturn,
        //             toId,
        //             adultCounter,
        //             childrenCounter
        //         };
        //     }
        // },
        '/TravelHub/pastSearchResult.html': {
            formSelector: '#flights-search-form .btn.btn-primary.search-btn',
            key: 'search_flights',
            getSearchObj: () => {
                const locationFrom = document.getElementById('flightsearchform-locationfrom').value;
                const locationTo = document.getElementById('flightsearchform-locationto').value;
                const locationFromTitle = document.getElementById('select2-flightsearchform-locationfrom-container').title;
                const locationToTitle = document.getElementById('select2-flightsearchform-locationto-container').title;
                const depDate = document.querySelector('.date-inputs-item.datepicker-avia-from').value;
                const retDate = document.querySelector('.date-inputs-item.datepicker-avia-to').value;
                const adultCounter = document.getElementById('adult-counter').innerHTML;
                const childrenCounter = document.getElementById('children-counter').innerHTML;
                const infantCounter = document.getElementById('infant-counter').innerHTML;
                let cabinClassContainer = document.getElementById('select2-cabin-class-container').innerHTML;

                if (cabinClassContainer === 'Эконом') {
                    cabinClassContainer = 'economy';
                } else if (cabinClassContainer === 'Бизнес') {
                    cabinClassContainer = 'business';
                }

                return {
                    locationFrom,
                    locationTo,
                    locationFromTitle,
                    locationToTitle,
                    depDate,
                    retDate,
                    adultCounter,
                    childrenCounter,
                    infantCounter,
                    cabinClassContainer
                };
            }
        }
    };

    const searchForm = searchForms[path];
    if (searchForm) {
        document.querySelector(searchForm.formSelector).addEventListener('click', () => {
            const searchObj = searchForm.getSearchObj();
            addSearchToLocalStorage(searchObj, searchForm.key);
            console.log(searchObj);
        });
        console.log(searchForm.key)
        updateLastSearchResults(searchForm.key);
    }
};


document.addEventListener('DOMContentLoaded', initPage);
