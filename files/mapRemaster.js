
import { MarkerClusterer } from "https://cdn.skypack.dev/@googlemaps/markerclusterer@2.3.1";

let mapHotelId;
let locationInfo;
let partnerinfo;
let selectedNationality;
let initialIdle = true; // Флаг для отслеживания первого срабатывания 'idle'

// Использование предопределенных значений
// const defaultLocation = locationInfo ?? "100327";
const defaultLocation = locationInfo ?? "82";
const defaultPartner = partnerinfo ?? "11160";

const defaultLocationReInit = locationInfo ?? "48";
const defaultPartnerReInit = partnerinfo ?? "11115";

const defaultData = {
    "PropertySearchForm[location]": defaultLocation,
    "PropertySearchForm[partner]": defaultPartner,
    "PropertySearchForm[checkinDate]": "15.10.2024",
    "PropertySearchForm[checkoutDate]": "16.10.2024",
    "PropertySearchForm[guests]": JSON.stringify([{ "adults": 2 }]),
    "PropertySearchForm[map]": "true",
    "PropertySearchForm[nationality]": "AU",
};

const defaultDataReInit = {
    "PropertySearchForm[location]": defaultLocationReInit,
    "PropertySearchForm[partner]": defaultPartnerReInit,
    "PropertySearchForm[checkinDate]": "27.11.2024",
    "PropertySearchForm[checkoutDate]": "30.11.2024",
    "PropertySearchForm[guests]": JSON.stringify([{ "adults": 3 }]),
    "PropertySearchForm[map]": "true",
    "PropertySearchForm[nationality]": "AU",
};

let isMobileFlag = window.matchMedia("only screen and (max-width: 760px)").matches;

const loaderDiv = document.getElementById('loader-map');
const loaderDivCardsList = document.querySelector('.loader-cards-list-wrapper')
const leftSectionWrapper = document.querySelector('.map-dashboard-left-section-wrapper');
const mapCardsListBottomWrapper = document.querySelector('.map-dashboard-main-wrapper .map-dashboard-bottom-section-wrapper');
const headerMapCountElement = document.querySelector('.map-dashboard-filter-header-description');
const leftBlock = document.querySelector('.map-dashboard-cards-list');
const mobileFilterApplyBtn = document.querySelector('.btn.btn-primary.map-filter-apply-btn-mobile');
const nationalityField = document.querySelector('.field-propertysearchform-nationality');

const mapShowSearch = document.querySelector('.result-amount-map-search-wrapper');
const hotelInfoBlock = document.querySelector('.hotel-info-block');
const mapDashboardWrapper = document.querySelector('.map-dashboard-main-wrapper-fade');

const mapDashboardFilterWrapper = document.querySelector('.map-dashboard-filter-wrapper');
const mapDashboardFilterBtn = document.querySelector('.map-dashboard-filter-header-btn');

const closeMapDashboardMainWrapperBtn = document.getElementById('map-dashboard-close-btn');
closeMapDashboardMainWrapperBtn.addEventListener('click', closeMap);

const closeFilterBlockBtn = document.getElementById('filters-block-submenus-header-btn');

const bodyTag = document.body;
const CACHE_EXPIRY_MS = 3600000; // 1 hour cache expiry

let layoutDev = (typeof implemented === 'undefined');
let timesFlag = false;

let offset = 31;
const limit = 30;

let map = null;
let markers = [];
let animationFrame;

function triggerInputEvent(element) {
    let event = new Event('input', {
        bubbles: true,
        cancelable: true
    });
    element.dispatchEvent(event);
}

function generateCacheKey(prefix, params = '') {
    return `cache_${prefix}_${params}`;
}

function getFormDataString(formData) {
    return Array.from(formData.entries()).map(([key, value]) => `${key}=${value}`).join('&');
}

function getCachedData(cacheKey) {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_EXPIRY_MS) {
            return data;
        }
    }
    return null;
}

function setCachedData(cacheKey, data) {
    const cacheObject = {
        data,
        timestamp: Date.now()
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheObject));
}

async function fetchMarkerData(formDataFromRequest) {
    let formData;

    if (formDataFromRequest) {
        formData = formDataFromRequest;
    } else {
        if (!layoutDev) {
            // Получение параметров поиска из формы
            const form = document.getElementById('properties-search-form');
            formData = new FormData(form);
            const searchParams = new URLSearchParams(formData);

            if (!searchParams.has('PropertySearchForm[location]') && typeof locationInfo !== 'undefined') {
                searchParams.append('PropertySearchForm[location]', locationInfo);
            }

            if (!searchParams.has('PropertySearchForm[partner]') && typeof partnerinfo !== 'undefined') {
                searchParams.append('PropertySearchForm[partner]', partnerinfo);
            }

            if (!searchParams.has('PropertySearchForm[nationality]') && typeof selectedNationality !== 'undefined') {
                searchParams.append('PropertySearchForm[nationality]', selectedNationality);
            }

            searchParams.append('PropertySearchForm[parentUrl]', encodeURIComponent(window.location.search));
            formData = searchParams;
        } else {
            
            formData = new FormData();


            for (const [key, value] of Object.entries(defaultData)) {
                formData.append(key, value);
            }
        }
    }

    const formDataString = getFormDataString(formData);
    const cacheKey = generateCacheKey('markerData', formDataString);

    const cachedData = getCachedData(cacheKey);

    if (cachedData) {
        return cachedData;
    }

    const apiUrl = layoutDev
        ? 'https://travelhub.by/hotels/search-map-points'
        : '/hotels/search-map-points';

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        setCachedData(cacheKey, data);
        return data;
    } catch (error) {
        console.error('Error fetching data from API:', error);
        throw error;
    }
}

async function fetchPropertyData(propertyId, formDataFromRequest, marker) {
    const { element } = marker;

    element.querySelector('.map-marker-description').classList.add('white-marker-text');
    element.querySelector('.loader-icon-marker').style.display = 'inline-block';

    let formData;

    if (formDataFromRequest) {
        // Использование переданного formDataFromRequest
        formData = formDataFromRequest;
        formData.set("PropertySearchForm[propertyId]", propertyId);
    } else {
        formData = new FormData();

        if (!layoutDev) {
            // Получение данных из формы на странице
            const form = document.getElementById('properties-search-form');
            formData = new FormData(form);

            if (!formData.has('PropertySearchForm[location]') && typeof locationInfo !== 'undefined') {
                formData.append('PropertySearchForm[location]', locationInfo);
            }

            if (!formData.has('PropertySearchForm[partner]') && typeof partnerinfo !== 'undefined') {
                formData.append('PropertySearchForm[partner]', partnerinfo);
            }

            if (!formData.has('PropertySearchForm[nationality]') && typeof selectedNationality !== 'undefined') {
                formData.append('PropertySearchForm[nationality]', selectedNationality);
            }
        } else {
            
            for (const [key, value] of Object.entries(defaultData)) {
                formData.append(key, value);
            }
        }

        formData.set("PropertySearchForm[propertyId]", propertyId);
        formData.set('PropertySearchForm[parentUrl]', encodeURIComponent(window.location.search));
    }

    const cacheKey = generateCacheKey(`property_${propertyId}`);
    const cachedData = getCachedData(cacheKey);

    if (cachedData) {
        element.querySelector('.loader-icon-marker').style.display = 'none';
        return cachedData;
    }

    const apiUrl = layoutDev ? 'https://travelhub.by/hotels/get-map-cards' : '/hotels/get-map-cards';

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        setCachedData(cacheKey, data);
        return data;
    } catch (error) {
        console.error('Error fetching data from API:', error);
        throw error;
    } finally {
        element.querySelector('.loader-icon-marker').style.display = 'none';
    }
}

function updateLeftBlockWithMarkerData({ data: dataHotelsObj, currency: currencyName, count: countHotels }) {
    const fragment = document.createDocumentFragment();

    dataHotelsObj.forEach(property => {
        const cardElement = buildLeftContent(property, currencyName, countHotels);
        fragment.appendChild(cardElement);
    });

    leftBlock.innerHTML = '';
    leftBlock.appendChild(fragment);
    
}

async function fetchMarkerDataWithinBounds(existingMarkers) {
    const formData = new FormData();

    if (!layoutDev) {
        // Получение данных из формы на странице
        const form = document.getElementById('properties-search-form');
        const tempFormData = new FormData(form);

        tempFormData.forEach((value, key) => formData.append(key, value));

        if (!formData.has('PropertySearchForm[location]') && typeof locationInfo !== 'undefined') {
            formData.append('PropertySearchForm[location]', locationInfo);
        }

        if (!formData.has('PropertySearchForm[partner]') && typeof partnerinfo !== 'undefined') {
            formData.append('PropertySearchForm[partner]', partnerinfo);
        }

        if (!formData.has('PropertySearchForm[nationality]') && typeof selectedNationality !== 'undefined') {
            formData.append('PropertySearchForm[nationality]', selectedNationality);
        }
    } else {

        Object.entries(defaultData).forEach(([key, value]) => formData.append(key, value));
    }

    // Добавляем идентификаторы маркеров
    existingMarkers.slice(0, 30).forEach(id => formData.append("PropertySearchForm[propertyId][]", id));
    formData.append('PropertySearchForm[parentUrl]', encodeURIComponent(window.location.search));

    const apiUrl = layoutDev ? 'https://travelhub.by/hotels/get-map-cards' : '/hotels/get-map-cards';

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching marker data within bounds:', error);
        throw error;
    }
}

async function fetchLeftBlockData(offset = 0, limit = 30, formDataFromRequest) {
    let formData;

    if (formDataFromRequest) {
        formData = formDataFromRequest;
    } else {
        if (!layoutDev) {
            const form = document.getElementById('properties-search-form');
            formData = new FormData(form);
            const searchParams = new URLSearchParams(formData);

            if (offset !== undefined && limit !== undefined) {
                searchParams.set("PropertySearchForm[offset]", offset);
                searchParams.set("PropertySearchForm[limit]", limit);
            }

            if (!searchParams.has('PropertySearchForm[location]') && typeof locationInfo !== 'undefined') {
                searchParams.append('PropertySearchForm[location]', locationInfo);
            }

            if (!searchParams.has('PropertySearchForm[partner]') && typeof partnerinfo !== 'undefined') {
                searchParams.append('PropertySearchForm[partner]', partnerinfo);
            }

            if (!searchParams.has('PropertySearchForm[nationality]') && typeof selectedNationality !== 'undefined') {
                searchParams.append('PropertySearchForm[nationality]', selectedNationality);
            }

            searchParams.set('PropertySearchForm[parentUrl]', encodeURIComponent(window.location.search));
            formData = searchParams;
        } else {

            formData = new FormData();

            Object.entries(defaultData).forEach(([key, value]) => formData.append(key, value));
        }
    }

    const cacheKey = generateCacheKey(`leftBlock_${offset}_${limit}`);
    const cachedData = getCachedData(cacheKey);

    if (cachedData) {
        return cachedData;
    }

    const apiUrl = layoutDev ? 'https://travelhub.by/hotels/get-map-cards' : '/hotels/get-map-cards';

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        console.log(data);
        setCachedData(cacheKey, data);
        return data;
    } catch (error) {
        console.error('Error fetching data from API:', error);
        throw error;
    }
}

async function lazyLoadLeftBlock() {
    if (loaderDivCardsList.style.display !== 'none') return; // Не загружать данные, если уже идет загрузка
    loaderDivCardsList.style.display = 'flex';

    const newItems = await fetchLeftBlockData(offset, limit);

    const fragment = document.createDocumentFragment();
    const { data: dataHotelsObj, currency: currencyName, count: countHotels } = newItems;

    dataHotelsObj.forEach(property => {
        const cardElement = buildLeftContent(property, currencyName, countHotels);
        fragment.appendChild(cardElement);
    });

    leftBlock.appendChild(fragment);

    offset += limit;
    loaderDiv.style.display = 'none';
    loaderDivCardsList.style.display = 'none';
    leftSectionWrapper.classList.add('active');
}

leftBlock.addEventListener('scroll', () => {
    if (leftBlock.scrollTop + leftBlock.clientHeight >= leftBlock.scrollHeight) {
        const [countOfHotelsHeader] = headerMapCountElement.textContent.split(' ').map(Number);

        if (offset < countOfHotelsHeader) {
            lazyLoadLeftBlock();
        }
    }
});

// Функция для инициализации карты
async function initMap(formData, typeRender, mapActiverHotel) {
    loaderDiv.style.display = 'block';

    if (typeRender !== 'hotel-open') {
        if (typeRender === 'showFilter') {
            mapDashboardFilterWrapper.classList.toggle('active');
            leftBlock.classList.toggle('hide');
            document.querySelector('.map-dashboard-filter-main-wrapper').classList.toggle('active-filter');
        }

        document.querySelectorAll('#filters input[type="checkbox"], #filters input[type="radio"]').forEach(element => {
            const className = element.className;
            if (className) {
                const { checked } = element;
                document.querySelectorAll(`#map_filters .${className}`).forEach(linkedItem => {
                    linkedItem.checked = checked;
                });
            }
        });

        clearCachedData();

        const mapRangeInputs = document.querySelectorAll("#map_filters .range-input input");
        mapRangeInputs[1].value = document.querySelector('[name="maxPrice"]').value;
        triggerInputEvent(mapRangeInputs[1]);
        mapRangeInputs[0].value = document.querySelector('[name="minPrice"]').value;
        triggerInputEvent(mapRangeInputs[0]);
        document.querySelector('#map_min-price').textContent = document.querySelector('#min-price').textContent;
        document.querySelector('#map_max-price').textContent = document.querySelector('#max-price').textContent;
    }

    const { Map, InfoWindow } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    const markerData = await fetchMarkerData(formData);

    const {
        data: markerDataObj,
        latitude_с: latC,
        longitude_с: lngC,
        currency: markerDataCurrencyName,
        count: markerDataCountHotels,
    } = markerData;

    const limitForRequestLeftBlock = 30;
    const offsetForRequestLeftBlock = 0;

    console.log(isMobileFlag)

    if (!isMobileFlag) {
        leftSectionWrapper.classList.add('active');
        fetchLeftBlockData(offsetForRequestLeftBlock, limitForRequestLeftBlock, formData)
            .then(leftBlockData => {
                updateLeftBlockWithMarkerData(leftBlockData);
                loaderDivCardsList.style.display = 'none';
            });
    }



    if (!markerDataCountHotels) {
        closeMap();
    } else {
        headerMapCountElement.innerHTML = `${markerDataCountHotels} ${translationsHub?.numberOfHotels ?? 'отеля в этой области'}`;
    }

    const center = { lat: parseFloat(latC), lng: parseFloat(lngC) };
    const zoomInitMap = 14;
    
        map = new google.maps.Map(document.querySelector(".map-dashoard-wrapper"), {
            zoom: zoomInitMap,
            center,
            mapId: "4504f8b37365c3d0",
            mapTypeControl: false,
            fullscreenControl: false,
            streetViewControl: false,
            gestureHandling: 'greedy',
        });

        const infoWindow = new google.maps.InfoWindow({
            content: "",
            disableAutoPan: true,
            closeButton: false,
        });
    const bounds = new google.maps.LatLngBounds();

    const markers = markerDataObj.map(markerInfo => {
        const { id, price, lat, lng } = markerInfo;

        const marker = new google.maps.marker.AdvancedMarkerElement({
            position: { lat: parseFloat(lat), lng: parseFloat(lng) },
            content: buildContent(price, markerDataCurrencyName),
            title: `${id}`,
        });

        bounds.extend(marker.position);  // Добавляем каждую позицию маркера в bounds

        marker.addListener("click", async () => {
            const propertyId = marker.title;
            const propertyData = await fetchPropertyData(propertyId, formData, marker);
            const {
                name,
                latitude,
                longitude,
                refundable,
                rating,
                priceNet,
                priceStrike,
                availableRooms,
                quiQuo,
                image,
                url,
                stars,
                priceTotal,
                priceNightly,
                id,
                partnerName,
            } = propertyData.data[0];

            const flagRefundableText = refundable ? translationsHub?.fullRefund ?? 'Полный возврат' : '';
            const ratingBlock = rating > 0
                ? `<div class="marker-popup-header-description-rate">${rating}</div><div class="marker-popup-header-description">${translationsHub?.guestRating ?? 'Рейтинг гостей'}</div>`
                : '';
            const priceNetBlock = priceNet
                ? `<div class="marker-popup-footer-description"><div class="marker-popup-footer-description-main">${translationsHub?.totalNetto ?? 'Всего (нетто цена):'}</div><div class="marker-popup-footer-description-price">${priceNet} ${markerDataCurrencyName}</div></div>`
                : '';
            const priceStrikeBlock = priceStrike > 0
                ? `<div class="marker-popup-footer-price-alert">${priceStrike} ${markerDataCurrencyName}</div>`
                : '';
            const availableRoomsBlock = availableRooms === 1
                ? `<div class="marker-popup-red-available-description">${translationsHub?.onlyOneRoom ?? 'Остался 1 номер по этой цене'}</div>`
                : '';
            const quiQuoBlock = quiQuo ? `<div class="qq-btn-place" data-value='${quiQuo}'></div>` : '';

            const contentInfoWindow = `
          <div class="details">
            <div class="marker-popup-wrapper">
              <div class="marker-popup-header-wrapper">
                <a href="/hotels/${id}/${url}" class="map-dashboard-card-item-href">
                  <div class="market-popup-header-img-wrapper" style="background-image:url(${image});"></div>
                </a>
                <div class="marker-popup-header-info">
                  <a href="/hotels/${id}/${url}" class="map-dashboard-card-item-href">
                    <div class="marker-popup-header-title-wrapper">
                      <div class="marker-popup-header-title">${name}</div>
                      <div class="marker-popup-header-title-stars-list">${buildRatingBlock(stars)}</div>
                    </div>
                  </a>
                  <div class="marker-popup-header-description-wrapper">${ratingBlock}</div>
                  <div class="marker-popup-refundable-description">${flagRefundableText}</div>
                  <div class="marker-popup-partnername-description">${partnerName}</div>
                  ${availableRoomsBlock}
                  ${quiQuoBlock}
                </div>
                <a target="_blank" href="/hotels/${id}/${url}" class="marker-popup-header-btn">
                  <img src="/images/arrow-right-btn.svg" alt="">
                </a>
              </div>
              <div class="marker-popup-footer-info">
                <div class="marker-popup-footer-description-wrapper">
                  ${priceNetBlock}
                  <div class="marker-popup-footer-description">
                    <div class="marker-popup-footer-description-main">${translationsHub?.includingTaxes ?? 'Всего (включая налоги и сборы)'}:</div>
                    <div class="marker-popup-footer-description-price">${priceTotal} ${markerDataCurrencyName}</div>
                  </div>
                </div>
                <div class="marker-popup-footer-price-wrapper">
                  ${priceStrikeBlock}
                  <div class="marker-popup-footer-price">${translationsHub?.forNight ?? 'за ночь'} ${priceNightly} ${markerDataCurrencyName}</div>
                </div>
              </div>
            </div>
          </div>
        `;

            const offset = window.innerWidth > 1024 ? -150 : window.innerWidth >= 770 ? -250 : 0;
            centerMapZoom(offset, map, marker);

            infoWindow.setContent(contentInfoWindow);
            infoWindow.open(map, marker);

            toggleContentVisibility();
            buildBottomContent(
                name,
                stars,
                priceTotal,
                priceNightly,
                id,
                url,
                image,
                markerDataCurrencyName,
                markerDataCountHotels,
                flagRefundableText,
                ratingBlock,
                priceNetBlock,
                availableRoomsBlock,
                priceStrikeBlock,
                quiQuoBlock,
                partnerName
            );
            marker.element.querySelector('.property').classList.add("highlight");
        });

        return marker;
    });

    // Устанавливаем границы карты, чтобы включить все маркеры
    map.fitBounds(bounds);

    const markerCluster = new MarkerClusterer({ map, markers });

    google.maps.event.addListener(map, 'idle', async () => {
        const bounds = map.getBounds();

        if (initialIdle) {
            initialIdle = false; // Пропускаем первое срабатывание 'idle'
            return;
        }

        // const bounds = map.getBounds();
        const visibleMarkers = markers.filter(marker => bounds.contains(marker.position));
        const existingMarkers = visibleMarkers.map(marker => marker.title);
    
        if (visibleMarkers.length < markers.length) {
            const newMarkerData = await fetchMarkerDataWithinBounds(existingMarkers);
            updateLeftBlockWithMarkerData(newMarkerData);
        }
    });
    

    google.maps.event.addListener(map, 'click', event => {
        if (infoWindow) {
            infoWindow.close();
            toggleContentVisibility();
            mapCardsListBottomWrapper.classList.remove('active');
        }
        if (event.placeId) {
            event.stop();
        }
    });

    google.maps.event.addListenerOnce(map, 'tilesloaded', () => {
        loaderDiv.style.display = 'none';
    });
}

//Тоглер для очистки активных маркеров и активации нижнего блока при моб версии
function toggleContentVisibility() {
    mapCardsListBottomWrapper.classList.add('active');

    document.querySelectorAll('.property').forEach(item => {
        item.classList.remove('highlight');
    });

    document.querySelectorAll('.map-marker-description.white-marker-text').forEach(item => {
        item.classList.remove('white-marker-text');
    });
}

// Функция для создания контента маркера
function buildContent(price, currencyName) {
    const content = document.createElement("div");
    content.classList.add("property");

    const markerDescription = `${price} ${currencyName}`;

    content.innerHTML = `
      <div class="icon">
        <div class="loader-icon-marker"></div>
        <div class="map-marker-description">
          ${markerDescription}
        </div>
      </div>
    `;
    return content;
}

// Функция для построения нижнего контента
function buildBottomContent(
    name,
    stars,
    priceTotal,
    priceNightly,
    id,
    url,
    image,
    currencyName,
    countHotels,
    flagRefundableText,
    ratingBlock,
    priceNetBlock,
    availableRoomsBlock,
    priceStrikeBlock,
    quiQuoBlock,
    partnerName
) {
    headerMapCountElement.innerHTML = `${countHotels} ${translationsHub?.numberOfHotels ?? 'отеля в этой области'}`;

    mapCardsListBottomWrapper.innerHTML = `
      <div class="map-dashboard-card-item">
        <a href="/hotels/${id}/${url}" class="map-dashboard-card-item-href">
          <div class="marker-popup-header-wrapper">
            <div class="market-popup-header-img-wrapper" style="background-image:url(${image});"></div>
            <div class="marker-popup-header-info">
              <div class="marker-popup-header-title-wrapper">
                <div class="marker-popup-header-title">${name}</div>
                <div class="marker-popup-header-title-stars-list">${buildRatingBlock(stars)}</div>
              </div>
              <div class="marker-popup-header-description-wrapper">${ratingBlock}</div>
              <div class="marker-popup-refundable-description">${flagRefundableText}</div>
              <div class="marker-popup-partnername-description">${partnerName}</div>
              ${availableRoomsBlock}
              ${quiQuoBlock}
            </div>
          </div>
          <div class="marker-popup-footer-info">
            <div class="marker-popup-footer-description-wrapper">
              ${priceNetBlock}
              <div class="marker-popup-footer-description">
                <div class="marker-popup-footer-description-main">${translationsHub?.includingTaxes ?? 'Всего (включая налоги и сборы)'}:</div>
                <div class="marker-popup-footer-description-price">${priceTotal} ${currencyName}</div>
              </div>
            </div>
            ${priceStrikeBlock ? `<div class="marker-popup-footer-price-alert">${priceStrikeBlock}</div>` : ''}
            <div class="marker-popup-footer-price-wrapper">
              <div class="marker-popup-footer-price">${translationsHub?.forNight ?? 'за ночь'} ${priceNightly} ${currencyName}</div>
              <a href="/hotels/${id}/${url}" class="marker-popup-header-btn">
                <img src="/images/arrow-right-btn.svg" alt="">
              </a>
            </div>
          </div>
        </a>
      </div>
    `;
}

// Функция для создания блока рейтинга
function buildRatingBlock(rating) {
    const roundedRating = Math.round(rating);
    const stars = Array(roundedRating)
        .fill('<img src="/images/hotels/star-icon.svg" alt="star" class="marker-popup-header-title-star-item">')
        .join('');
    return stars;
}

function buildLeftContent(property, currencyName) {

    const content = document.createElement("div");
    content.classList.add("map-dashboard-card-item");
    content.setAttribute('id', `marker-${property.id}`)
    content.setAttribute('data-position-lat', `${property.latitude}`);
    content.setAttribute('data-position-lng', `${property.longitude}`);

    const { name, latitude, longitude, refundable, rating, priceNet, priceStrike, availableRooms, quiQuo, image, id, url, stars, priceTotal, priceNightly, partnerName } = property;

    const flagRefundableText = refundable ? (translationsHub?.fullRefund ?? 'Полный возврат') : '';
    const ratingBlock = rating > 0 ? `<div class="marker-popup-header-description-rate">${rating}</div><div class="marker-popup-header-description">${translationsHub?.guestRating ?? 'Рейтинг гостей'}</div>` : '';
    const priceNetBlock = priceNet ? `<div class="marker-popup-footer-description"><div class="marker-popup-footer-description-main">${translationsHub?.totalNetto ?? 'Всего (нетто цена):'}</div><div class="marker-popup-footer-description-price">${priceNet} ${currencyName}</div></div>` : '';
    const priceStrikeBlock = priceStrike > 0 ? `<div class="marker-popup-footer-price-alert">${priceStrike} ${currencyName}</div>` : '';
    const availableRoomsBlock = availableRooms === 1 ? `<div class="marker-popup-red-available-description">${translationsHub?.onlyOneRoom ?? 'Остался 1 номер по этой цене'}</div>` : '';
    const quiQuoBlock = quiQuo ? `<div class="qq-btn-place" data-value='${quiQuo}'></div>` : '';



    content.innerHTML = `
    <div class="marker-popup-header-wrapper">
    <a href="/hotels/${property.id}/${property.url}" class=map-dashboard-card-item-href>
      <div class="market-popup-header-img-wrapper" style="background-image:url(${property.image});"></div>
      </a>
      <div class="marker-popup-header-info">
      <a href="/hotels/${property.id}/${property.url}" class=map-dashboard-card-item-href>
        <div class="marker-popup-header-title-wrapper">
          <div class="marker-popup-header-title">${property.name}</div>
          <div class="marker-popup-header-title-stars-list">${buildRatingBlock(property.stars)}</div>
        </div>
        </a>
        <div class="marker-popup-header-description-wrapper">${ratingBlock}</div>
        <div class="marker-popup-refundable-description">${flagRefundableText}</div>
        <div class="marker-popup-partnername-description">${partnerName}</div>
        ${availableRoomsBlock}
        ${quiQuoBlock}
      </div>
      <a target="_blank" href="/hotels/${property.id}/${property.url}" class="marker-popup-header-btn">
        <img src="/images/arrow-right-btn.svg" alt="">
      </a>
    </div>
    <div class="marker-popup-footer-info">
      <div class="marker-popup-footer-description-wrapper">
        ${priceNetBlock}
        <div class="marker-popup-footer-description">
          <div class="marker-popup-footer-description-main">${translationsHub?.includingTaxes ?? 'Всего (включая налоги и сборы)'}:</div>
          <div class="marker-popup-footer-description-price">${property.priceTotal} ${currencyName}</div>
        </div>
      </div>
      
      <div class="marker-popup-footer-price-wrapper">
      ${priceStrikeBlock}
        <div class="marker-popup-footer-price">${translationsHub?.forNight ?? 'за ночь'} ${property.priceNightly} ${currencyName}</div>
      </div>
    </div>
  `;

    return content;
}

function centerMapZoom(offsetValue, map, marker) {
    var projection = map.getProjection();
    var centerPixel = projection.fromLatLngToPoint(marker.position);
    centerPixel.x += offsetValue / Math.pow(2, map.getZoom());
    var centerLatLng = projection.fromPointToLatLng(centerPixel);

    // map.setCenter(centerLatLng);
    smoothPanTo(centerLatLng, map)
}

function smoothPanTo(newCenter, map) {
    const duration = 1000; // duration of the animation in ms
    const steps = 30; // number of steps for the animation
    const interval = duration / steps;

    const startCenter = map.getCenter();
    const startLat = startCenter.lat();
    const startLng = startCenter.lng();
    const endLat = newCenter.lat();
    const endLng = newCenter.lng();

    let currentStep = 0;

    function animate() {
        currentStep += 1;
        const progress = currentStep / steps;

        const currentLat = startLat + (endLat - startLat) * progress;
        const currentLng = startLng + (endLng - startLng) * progress;

        map.setCenter({ lat: currentLat, lng: currentLng });

        if (currentStep < steps) {
            animationFrame = requestAnimationFrame(animate);
        }
    }

    cancelAnimationFrame(animationFrame);
    animate();
}

// Открытие карты и генерация ее
mapShowSearch.addEventListener('click', () => {
    if (hotelInfoBlock) {
        ({ propertyId: mapHotelId } = hotelInfoBlock.dataset);
        ({ location: locationInfo, partner: partnerinfo } = mapShowSearch.dataset);
    }

    if (nationalityField) {
        selectedNationality = $('#propertysearchform-nationality').val();
    }

    const renderType = mapShowSearch.dataset.rendertype;
    mapDashboardWrapper.classList.toggle('active');
    bodyTag.style.overflow = 'hidden';
    initMap(undefined, renderType, mapHotelId);

});

// Открытие фильтра
mapDashboardFilterBtn?.addEventListener('click', () => {
    mapDashboardFilterWrapper.classList.toggle('active');
    leftBlock.classList.toggle('hide');
    document.querySelector('.map-dashboard-filter-main-wrapper').classList.toggle('active-filter');
    togglerMobileStyleFilterBlock();
});

// Закрытие фильтра
closeFilterBlockBtn?.addEventListener('click', () => {
    mapDashboardFilterWrapper.classList.toggle('active');
    leftBlock.classList.toggle('hide');
    mapCardsListBottomWrapper.classList.toggle('hide');
    document.querySelector('.map-dashboard-filter-main-wrapper').classList.toggle('active-filter');
    togglerMobileStyleFilterBlock();
});

// Закрытие карты
function closeMap() {
    mapDashboardWrapper.classList.toggle('active');
    bodyTag.style.overflow = 'scroll';
    leftSectionWrapper.classList.toggle('active');
    clearMap();
}

$(document).ready(function () {
    $('#map_filters input[type="checkbox"], #map_filters input[type="radio"]').on('change', function () {
        var className = $(this).attr('class');
        var checked = $(this).is(':checked');
        var linkedItems = $('#filters .' + className);
        linkedItems.prop('checked', checked);

        linkedItems.each(function () {
            var event = new Event('change', { bubbles: true });
            this.dispatchEvent(event);
        });


        if (typeof $.fn.yiiActiveForm === 'function') {
            $('#properties-search-form').yiiActiveForm('validate', true);
            if (window.innerWidth > 770) {
                reInitMap()

            }
        }

    });

    $('#map_filters .range-input input').on('change', function () {
        let event = new Event('input', { bubbles: true });
        const mapRangeInputSite = document.querySelectorAll("#filters .range-input input");
        const mapRangeInputMap = document.querySelectorAll("#map_filters .range-input input");

        document.querySelector('[name="maxPrice"]').value = mapRangeInputMap[1].value
        mapRangeInputSite[1].dispatchEvent(event);
        document.querySelector('[name="minPrice"]').value = mapRangeInputMap[0].value;
        mapRangeInputSite[0].dispatchEvent(event);

        let minPriceTextMap = document.querySelector('#min-price').textContent;
        minPriceTextMap = document.querySelector('#map_min-price').textContent;
        let maxPriceTextMap = document.querySelector('#map_max-price').textContent;
        maxPriceTextMap = document.querySelector('#map_max-price').textContent;

        if (typeof $.fn.yiiActiveForm === 'function') {
            $('#properties-search-form').yiiActiveForm('validate', true);
            if (window.innerWidth > 770) {
                reInitMap()

            }
        }

    })

});

// Добавление обработчика события для кнопки применения фильтра на мобильных устройствах
mobileFilterApplyBtn?.addEventListener('click', reInitMap);

function reInitMap() {
    mapDashboardFilterWrapper.classList.toggle('active');
    leftBlock.classList.toggle('hide');

    document.querySelector('.map-dashboard-filter-main-wrapper').classList.toggle('active-filter');
    togglerMobileStyleFilterBlock();

    const markerStarsList = document.getElementById('marker-popup-header-title-stars-list');
    const propertiesSearchForm = document.getElementById('properties-search-form');
    clearCachedData();

    if (markerStarsList) {
        markerStarsList.innerHTML = '';
      }

    const typeRender = window.innerWidth > 770 ? 'showFilter' : undefined;

    let newformData;

    if (!layoutDev) {
        newformData = new FormData(propertiesSearchForm);
        const newSearchParams = new URLSearchParams(newformData);
        newSearchParams.append('PropertySearchForm[parentUrl]', encodeURIComponent(window.location.search));
        initMap(newSearchParams, typeRender);
    } else {
        newformData = new FormData();

        for (const [key, value] of Object.entries(defaultDataReInit)) {
            newformData.append(key, value);
        }

        initMap(newformData, typeRender);
    }

    clearMap();
}

const togglerMobileStyleFilterBlock = () => {
    if (window.innerWidth <= 770) {
        const filterWrapperMobile = document.querySelector('.map-dashboard-left-section-wrapper.active');
        filterWrapperMobile?.classList.toggle('mobile');
    }
};

// Функция для очистки данных из локального хранилища

function clearCachedData() {
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('cache_markerData_') || key.startsWith('cache_leftBlock_') || key.startsWith('cache_property_')) {
            localStorage.removeItem(key);
        }
    });
}

// Функция для очистки карты
function clearMap() {
    leftBlock.innerHTML = '';
    headerMapCountElement.innerHTML = ''
    mapCardsListBottomWrapper.innerHTML = '';

    // Очистка карты
    map = null;
}

function clearMarkerCache(prefix) {

    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(prefix)) {
            keysToRemove.push(key);
        }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
}

function clearPropertyCache(prefix) {

    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(prefix)) {
            keysToRemove.push(key);
        }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
}

function clearLeftBlockCache(prefix) {

    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(prefix)) {
            keysToRemove.push(key);
        }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
}

if (!timesFlag) {
    clearMap()
    clearCachedData()
    timesFlag = true
}

// Найти форму с action /hotels/search и добавить обработчик события клика, если кнопка найдена
document.querySelector('form[action="/hotels/search"]')
    ?.querySelector('.search-btn-block.col-search-button button')
    ?.addEventListener('click', clearCachedData);
