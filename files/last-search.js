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
    let userCurrencyTofetch = USER_CURRENCY;

    if(userCurrencyTofetch == 'KZT'){
        userCurrencyTofetch = 'USD'
    }

    const maxResults = isMobileFlagSearchResult ? 3 : searches.length;

    searches.slice(-maxResults).forEach(({ search }) => {
        const link = document.createElement('a');
        if (key === 'search_flights') {
            link.href = `${HOST_URL}flights?departure=${search.locationFrom}&arrival=${search.locationTo}&date=${search.depDate}&dateEnd=${search.retDate}&guests=${getGuests(search.adultCounter, search.childrenCounter, search.infantCounter)}&currency=${userCurrencyTofetch}&run=1`;
        } else if (key === 'search_hotels') {
            link.href = `${search.searchLink}`;
        } else if (key === 'search_tours') {
            link.href = `${HOST_URL}?locationFrom=${search.locationFrom}&countryId=${search.countryId}&nights=${search.nightsCounter}&fixPeriod=${search.fixPeriod}&adults=${search.adults}&children=${search.children}&childAges=&priceFrom=${search.priceFrom}&priceTo=${search.priceTo}&currency=${userCurrencyTofetch}&hotels=${search.hotels}&resorts=${search.resorts}&category=${search.starsCounter}&meal=${search.mealCounter}&run=1`
            
        }else if (key === 'search_transfers') {
            link.href = `${search.searchLink}`;
        }

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
        if (key === 'search_flights') {
            titleDiv.textContent = `${search.locationFromTitle} - ${search.locationToTitle}`;
        } else if (key === 'search_hotels') {
            titleDiv.textContent = `${search.locationName}`;
        } else if (key === 'search_tours') {
            titleDiv.textContent = `${search.locationName} - ${search.countryName}`;
        } else if (key === 'search_transfers') {
            titleDiv.textContent = `${search.locationNameFrom} - ${search.locationNameTo}`;
        }

        const descriptionDiv = document.createElement('div');
        descriptionDiv.className = 'description';
        const descriptionParts = [
            key === 'search_flights' ? `${search.depDate} - ${search.retDate}` :
            key === 'search_transfers' ? `${search.dateTo}${search.dateReturn ? ' - ' + search.dateReturn : ''}` : 
            key === 'search_hotels' ? `${search.checkin} - ${search.checkout}` :
            key === 'search_tours' ? `${search.fixPeriod.split(';')[0].trim()} - ${search.fixPeriod.split(';')[1].trim()}` : 
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
                const locationFromTitle = document.getElementById('select2-flightsearchform-locationfrom-container').textContent;
                const locationToTitle = document.getElementById('select2-flightsearchform-locationto-container').textContent;
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
                const locationFromTitle = document.getElementById('select2-flightsearchform-locationfrom-container').textContent;
                const locationToTitle = document.getElementById('select2-flightsearchform-locationto-container').textContent;
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
        '/hotels': {
            formSelector: '#properties-search-form .btn.btn-primary.search-btn',
            key: 'search_hotels',
            getSearchObj: () => {
            const searchLink = window.location.href
            const location = $('#propertysearchform-location').val();
            const locationName = $('#select2-propertysearchform-location-container').text();

            const checkin = document.querySelector('input[name="PropertySearchForm[checkinDate]"]').value;
            const checkout = document.querySelector('input[name="PropertySearchForm[checkoutDate]"]').value;
            const partner = document.querySelector('input[name="PropertySearchForm[partner]"]').value;

            const guests = document.querySelector('input[name="PropertySearchForm[guests]"]').value;
            const adultCounter = document.getElementById('adults').textContent;
            const childrenCounter = document.getElementById('children').textContent;

            return {
                location,
                locationName,
                checkin,
                checkout,
                guests,
                adultCounter,
                childrenCounter,
                partner,
                searchLink
            };
        }
        },
        '/': {
            formSelector: '#kt_form .search-btn-block .search-btn',
            key: 'search_tours',
            getSearchObj: () => {

                const locationFrom = $('#toursearchform-locationfrom').val();
                const countryId = $('#country-id').val();
                const countryName = $('#select2-country-id-container').text()
                const locationName = $('#select2-toursearchform-locationfrom-container').text()
                const fixPeriod = document.getElementById('tours-calendar').value.replace(' - ', ';');
                const nightsCounter = Array.from(document.querySelectorAll('#nights option:checked'))
                    .map(option => option.value)
                    .join(', ');
                const adults = document.getElementById('adults-count').value;
                const children = document.getElementById('children-count').value;
                const mealCounter = Array.from(document.querySelectorAll('#toursearchform-meal option:checked'))
                    .map(option => option.value)
                    .join(', ');
                const starsCounter = Array.from(document.querySelectorAll('#toursearchform-category option:checked'))
                    .map(option => option.value)
                    .join(', ');
                const priceFrom = document.getElementById('toursearchform-pricefrom').value
                const priceTo = document.getElementById('toursearchform-priceto').value
                const hotels = Array.from(document.querySelectorAll('.list-block-content .option-hotel input[type="checkbox"]:checked'))
                    .map(checkbox => checkbox.value)
                    .join(', ');
                const resorts = Array.from(document.querySelectorAll('.list-block-content.resorts-list .option-resort input[type="checkbox"]:checked'))
                    .map(checkbox => checkbox.value)
                    .join(', ');


                return {
                    adults,
                    children,
                    locationFrom,
                    countryId,
                    fixPeriod,
                    nightsCounter,
                    mealCounter,
                    starsCounter,
                    priceFrom,
                    priceTo,
                    hotels,
                    resorts,
                    countryName,
                    locationName

                };
            }
        },
        '/transfers': {
            formSelector: '.search-btn-block.col-search-button',
            key: 'search_transfers',
            getSearchObj: () => {
                const searchLink = window.location.href
                const locationNameFrom = $('#select2-location-from-container').text();
                const locationNameTo = $('#select2-location-to-container').text();
                const dateTo = $('#date-to').val();
                const dateReturn = $('#date-return').val();
                const adultCounter = document.getElementById('adults').textContent;
                const childrenCounter = document.getElementById('childrens').textContent;

                return {
                    locationNameFrom,
                    locationNameTo,
                    dateTo,
                    dateReturn,
                    adultCounter,
                    childrenCounter,
                    searchLink
                };
            }
        },
        '/TravelHub/pastSearchResult.html': {
            formSelector: '.search-btn-block.col-search-button',
            key: 'search_transfers',
            getSearchObj: () => {
                const searchLink = window.location.href
                const locationNameFrom = $('#select2-location-from-container').text();
                const locationNameTo = $('#select2-location-to-container').text();
                const dateTo = $('#date-to').val();
                const dateReturn = $('#date-return').val();
                const adultCounter = document.getElementById('adults').textContent;
                const childrenCounter = document.getElementById('childrens').textContent;

                return {
                    locationNameFrom,
                    locationNameTo,
                    dateTo,
                    dateReturn,
                    adultCounter,
                    childrenCounter,
                    searchLink
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
