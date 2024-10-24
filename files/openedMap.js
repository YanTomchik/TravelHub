
import { MarkerClusterer } from "https://cdn.skypack.dev/@googlemaps/markerclusterer@2.3.1";

const loaderDiv = document.getElementById('loader-map');
const loaderDivCardsList = document.querySelector('.loader-cards-list-wrapper')
const leftSectionWrapper = document.querySelector('.map-dashboard-left-section-wrapper');
const mapCardsListBottomWrapper = document.querySelector('.map-dashboard-main-wrapper .map-dashboard-bottom-section-wrapper');
const headerMapCountElement = document.querySelector('.map-dashboard-filter-header-description');
const leftBlock = document.querySelector('.map-dashboard-cards-list');
const mobileFilterApplyBtn = document.querySelector('.btn.btn-primary.map-filter-apply-btn-mobile');
const bodyTag = document.body;

let layoutDev = (typeof implemented === 'undefined');

function triggerInputEvent(element) {
  let event = new Event('input', {
    bubbles: true,
    cancelable: true
  });
  element.dispatchEvent(event);
  // console.log(element);
}

const CACHE_EXPIRY_MS = 3600000; // 1 hour cache expiry

function generateCacheKey(prefix) {
  return `cache_${prefix}`;
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
  let formData = null;
  if (formDataFromRequest != null) {

    formData = formDataFromRequest;

  } else {


    if (!layoutDev) {
      // get search params
      const form = document.getElementById('properties-search-form');
      formData = new FormData(form);
      const searchParams = new URLSearchParams();

      for (const pair of formData) {
        searchParams.append(pair[0], pair[1]);
      }
      searchParams.append('PropertySearchForm[parentUrl]', encodeURIComponent(window.location.search));
      formData = searchParams;
    } else {
      formData = new FormData();
      formData.append("PropertySearchForm[location]", "179892");
      formData.append("PropertySearchForm[checkinDate]", "27.08.2024");
      formData.append("PropertySearchForm[checkoutDate]", "30.08.2024");
      formData.append("PropertySearchForm[guests]", JSON.stringify([{ "adults": 2 }]));
      formData.append("PropertySearchForm[partner]", "11090");
      formData.append("PropertySearchForm[map]", "true");
    }

  }

  const cacheKey = generateCacheKey('markerData');
  let cachedData = getCachedData(cacheKey);

  if (cachedData) {
    return cachedData;
  }


  const apiUrl = layoutDev ? 'https://travelhub.by/hotels/search-map-points' : 'hotels/search-map-points';

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData
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
  // console.log(propertyId);
  marker.element.querySelector('.map-marker-description').classList.add('white-marker-text');
  marker.element.querySelector('.loader-icon-marker').style.display = 'inline-block';

  let formData;

  if (formDataFromRequest != null) {
    // Использование переданного formDataFromRequest
    formData = formDataFromRequest;
    formData.delete("PropertySearchForm[propertyId]");
    formData.append("PropertySearchForm[propertyId]", `${propertyId}`);
  } else {
    formData = new FormData();

    if (!layoutDev) {
      // Получение данных из формы на странице
      const form = document.getElementById('properties-search-form');
      const tempFormData = new FormData(form);
      tempFormData.forEach((value, key) => {
        formData.append(key, value);
      });
    } else {
      // Использование предопределенных значений
      formData.append("PropertySearchForm[location]", "179892");
      formData.append("PropertySearchForm[checkinDate]", "27.8.2024");
      formData.append("PropertySearchForm[checkoutDate]", "30.08.2024");
      formData.append("PropertySearchForm[guests]", JSON.stringify([{ "adults": 2 }]));
      formData.append("PropertySearchForm[partner]", "11090");
      formData.append("PropertySearchForm[map]", "true");
    }

    formData.append("PropertySearchForm[propertyId]", `${propertyId}`);
    formData.append('PropertySearchForm[parentUrl]', encodeURIComponent(window.location.search));
  }

  const cacheKey = generateCacheKey(`property_${propertyId}`);
  const cachedData = getCachedData(cacheKey);

  // formData.forEach((value, key) => {
  //   console.log(`${key}: ${value}`);
  // });

  if (cachedData) {
    marker.element.querySelector('.loader-icon-marker').style.display = 'none';
    return cachedData;
  }

  const apiUrl = layoutDev ? 'https://travelhub.by/hotels/get-map-cards' : 'hotels/get-map-cards';

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData
    });
    // console.log(response);
    const data = await response.json();
    setCachedData(cacheKey, data);
    marker.element.querySelector('.loader-icon-marker').style.display = 'none';
    return data;
  } catch (error) {
    marker.element.querySelector('.loader-icon-marker').style.display = 'none';
    console.error('Error fetching data from API:', error);
    throw error;
  }
}

/////

function updateLeftBlockWithMarkerData(markerData) {
  // const leftBlock = document.getElementById('leftBlock');
  leftBlock.innerHTML = ''; // Очищаем текущий контент

  const { data: dataHotelsObj, currency: currencyName, count: countHotels } = markerData;

  dataHotelsObj.forEach(property => {
    const { name, latitude, longitude, refundable, rating, priceNet, priceStrike, availableRooms, quiQuo, image, id, url, stars, priceTotal, priceNightly } = property;

    const flagRefundableText = refundable ? (translationsHub?.fullRefund ?? 'Полный возврат') : '';
    const ratingBlock = rating > 0 ? `<div class="marker-popup-header-description-rate">${rating}</div><div class="marker-popup-header-description">${translationsHub?.guestRating ?? 'Рейтинг гостей'}</div>` : '';
    const priceNetBlock = priceNet ? `<div class="marker-popup-footer-description"><div class="marker-popup-footer-description-main">${translationsHub?.totalNetto ?? 'Всего (нетто цена):'}</div><div class="marker-popup-footer-description-price">${priceNet} ${currencyName}</div></div>` : '';
    const priceStrikeBlock = priceStrike ? `<div class="marker-popup-footer-price-alert">${priceStrike} ${currencyName}</div>` : '';
    const availableRoomsBlock = availableRooms === 1 ? `<div class="marker-popup-red-available-description">${translationsHub?.onlyOneRoom ?? 'Остался 1 номер по этой цене'}</div>` : '';
    const quiQuoBlock = quiQuo ? `<div class="qq-btn-place" data-value="${quiQuo}"></div>` : '';
    // leftBlock.innerHTML = ''
    buildLeftContent(property, currencyName, countHotels, flagRefundableText, ratingBlock, priceNetBlock, availableRoomsBlock, priceStrikeBlock, quiQuoBlock);
    // console.log(markerInfo)
    leftBlock.scrollTop = 0;
  });
}


async function fetchMarkerDataWithinBounds(existingMarkers) {
  const formData = new FormData();

  if (!layoutDev) {
    // Получение данных из формы на странице
    const form = document.getElementById('properties-search-form');
    const tempFormData = new FormData(form);
    tempFormData.forEach((value, key) => {
      formData.append(key, value);
    });
  } else {
    // Использование предопределенных значений
    formData.append("PropertySearchForm[location]", "179892");
    formData.append("PropertySearchForm[checkinDate]", "27.08.2024");
    formData.append("PropertySearchForm[checkoutDate]", "30.08.2024");
    formData.append("PropertySearchForm[guests]", JSON.stringify([{ "adults": 2 }]));
    formData.append("PropertySearchForm[partner]", "11090");
    formData.append("PropertySearchForm[map]", "true");
  }

  // Добавляем первые 30 идентификаторов маркеров в параметр PropertySearchForm[propertyId][]
  const markerIds = existingMarkers.slice(0, 30);
  // console.log(markerIds)
  markerIds.forEach(id => formData.append("PropertySearchForm[propertyId][]", id));
  formData.append('PropertySearchForm[parentUrl]', encodeURIComponent(window.location.search));

  const apiUrl = layoutDev ? 'https://travelhub.by/hotels/get-map-cards' : 'hotels/get-map-cards';

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    // console.log(data)
    return data; // Предполагается, что данные маркеров находятся в поле `data` ответа
  } catch (error) {
    console.error('Error fetching marker data within bounds:', error);
    throw error;
  }
}

async function fetchLeftBlockData(offset, limit, formDataFromRequest) {
  let formData = null;
  if (formDataFromRequest != null) {
    formData = formDataFromRequest;
  } else {
    if (!layoutDev) {
      const form = document.getElementById('properties-search-form');
      formData = new FormData(form);
      const searchParams = new URLSearchParams();
      for (const pair of formData) {
        searchParams.append(pair[0], pair[1]);
      }
      if (offset !== undefined && limit !== undefined) {
        searchParams.append("PropertySearchForm[offset]", `${offset}`);
        searchParams.append("PropertySearchForm[limit]", `${limit}`);
      }
      searchParams.append('PropertySearchForm[parentUrl]', encodeURIComponent(window.location.search));
      formData = searchParams;
    } else {
      formData = new FormData();
      formData.append("PropertySearchForm[location]", "179892");
      formData.append("PropertySearchForm[checkinDate]", "27.08.2024");
      formData.append("PropertySearchForm[checkoutDate]", "30.08.2024");
      formData.append("PropertySearchForm[guests]", JSON.stringify([{ "adults": 2 }]));
      formData.append("PropertySearchForm[partner]", "11090");
      formData.append("PropertySearchForm[map]", "true");
      if (offset !== undefined && limit !== undefined) {
        formData.append("PropertySearchForm[offset]", `${offset}`);
        formData.append("PropertySearchForm[limit]", `${limit}`);
      }
    }
  }

  const cacheKey = generateCacheKey(`leftBlock_${offset}_${limit}`);
  let cachedData = getCachedData(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  const apiUrl = layoutDev ? 'https://travelhub.by/hotels/get-map-cards' : 'hotels/get-map-cards';

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    setCachedData(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Error fetching data from API:', error);
    throw error;
  }
}

let offset = 31;
const limit = 30;

async function lazyLoadLeftBlock() {
  // console.log(loaderDiv.style.display)
  //if (loaderDivCardsList.style.display !== 'none') return; // Не загружать данные, если уже идет загрузка
  loaderDivCardsList.style.display = 'block';

  const newItems = await fetchLeftBlockData(offset, limit, null);
  const { data: dataHotelsObj, currency: currencyName, count: countHotels } = newItems;

  dataHotelsObj.forEach((property) => {
    const { name, latitude, longitude, refundable, rating, priceNet, priceStrike, availableRooms, quiQuo, image, id, url, stars, priceTotal, priceNightly } = property;

    const flagRefundableText = refundable ? (translationsHub?.fullRefund ?? 'Полный возврат') : '';
    const ratingBlock = rating > 0 ? `<div class="marker-popup-header-description-rate">${rating}</div><div class="marker-popup-header-description">${translationsHub?.guestRating ?? 'Рейтинг гостей'}</div>` : '';
    const priceNetBlock = priceNet ? `<div class="marker-popup-footer-description"><div class="marker-popup-footer-description-main">${translationsHub?.totalNetto ?? 'Всего (нетто цена):'}</div><div class="marker-popup-footer-description-price">${priceNet} ${currencyName}</div></div>` : '';
    const priceStrikeBlock = priceStrike ? `<div class="marker-popup-footer-price-alert">${priceStrike} ${currencyName}</div>` : '';
    const availableRoomsBlock = availableRooms === 1 ? `<div class="marker-popup-red-available-description">${translationsHub?.onlyOneRoom ?? 'Остался 1 номер по этой цене'}</div>` : '';
    const quiQuoBlock = quiQuo ? `<div class="qq-btn-place" data-value="${quiQuo}"></div>` : '';

    buildLeftContent(property, currencyName, countHotels, flagRefundableText, ratingBlock, priceNetBlock, availableRoomsBlock, priceStrikeBlock, quiQuoBlock);
  });

  offset += limit;
  loaderDiv.style.display = 'none'
  loaderDivCardsList.style.display = 'none';
  leftSectionWrapper.classList.add('active');
}

leftBlock.addEventListener('scroll', () => {
  if (leftBlock.scrollTop + leftBlock.clientHeight >= leftBlock.scrollHeight) {
    const countOfHotelsHeader = Number(headerMapCountElement.textContent.split(' ')[0]);
    // console.log(offset)
    // console.log(countOfHotelsHeader)

    if (offset < countOfHotelsHeader) {
      lazyLoadLeftBlock();
    }
  }
});

let map = null;
let markers = [];
let animationFrame;

async function initMap(formData, typeRender, mapActiverHotel) {

  loaderDiv.style.display = 'block';

  if(typeRender != 'hotel-open'){
      if (typeRender == 'showFilter') {
    mapDashboardFilterWrapper.classList.toggle('active')
    leftBlock.classList.toggle('hide')
    document.querySelector('.map-dashboard-filter-main-wrapper').classList.toggle('active-filter');
  }

  document.querySelectorAll('#filters input[type="checkbox"], #filters input[type="radio"]').forEach(function(element) {
    var className = element.className;
    if(className !=undefined || className!= ''){
      var checked = element.checked;
      var linkedItems = document.querySelectorAll('#map_filters .' +  className);
      linkedItems.forEach(function(linkedItem) {
         linkedItem.checked = checked;
      });
    }
    clearCachedData()
    });
  
    const mapRangeInput = document.querySelectorAll("#map_filters .range-input input");
    mapRangeInput[1].value = document.querySelector('[name="maxPrice"]').value;
    triggerInputEvent(mapRangeInput[1]);
    mapRangeInput[0].value = document.querySelector('[name="minPrice"]').value;
    triggerInputEvent(mapRangeInput[0]);
    const minPriceText = document.querySelector('#min-price').textContent;
    document.querySelector('#map_min-price').textContent = minPriceText;
    const maxPriceText = document.querySelector('#map_max-price').textContent;
    document.querySelector('#map_max-price').textContent = maxPriceText;
  }
  
  const { Map, InfoWindow } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  const markerData = await fetchMarkerData(formData);
  // console.log(markerData)

  const { data: markerDataObj, latitude_с: latC, longitude_с: lngC, currency: markerDataCurrencyName, count: markerDataCountHotels } = markerData;

  let limitForRequestLeftBlock = 30;
  let offsetForRequestLeftBlock = 0;

  const leftBlockData = await fetchLeftBlockData(offsetForRequestLeftBlock, limitForRequestLeftBlock, formData);
  const { data: dataHotelsObj, currency: currencyName, count: countHotels } = leftBlockData;

  if(countHotels == 0 || countHotels == undefined){
    closeMap() 
  }else{
    headerMapCountElement.innerHTML = `${countHotels} ${translationsHub?.numberOfHotels ?? 'отеля в этой области'}`;
  }
  

  const center = { lat: parseFloat(latC), lng: parseFloat(lngC) };
  const zoomInitMap = 11;

  map = new google.maps.Map(document.querySelector(".map-dashoard-wrapper"), {
    zoom: zoomInitMap,
    center: center,
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

  await lazyLoadLeftBlock();

  const markers = markerDataObj.map((markerInfo) => {
    const { id, price, lat, lng } = markerInfo;

    const marker = new google.maps.marker.AdvancedMarkerElement({
      position: { lat: parseFloat(lat), lng: parseFloat(lng) },
      content: buildContent(price, currencyName),
      title: `${id}`,
    });

    if(typeRender == 'hotel-open'){
        if(id == mapActiverHotel){
            (async () => {
              try {
                const propertyData = await fetchPropertyData(id, formData, marker);
                const { name, latitude, longitude, refundable, rating, priceNet, priceStrike, availableRooms, quiQuo, image, url, stars, priceTotal, priceNightly } = propertyData.data[0];
      
                const flagRefundableText = refundable ? (translationsHub?.fullRefund ?? 'Полный возврат') : '';
                const ratingBlock = rating > 0 ? `<div class="marker-popup-header-description-rate">${rating}</div><div class="marker-popup-header-description">${translationsHub?.guestRating ?? 'Рейтинг гостей'}</div>` : '';
                const priceNetBlock = priceNet ? `<div class="marker-popup-footer-description"><div class="marker-popup-footer-description-main">${translationsHub?.totalNetto ?? 'Всего (нетто цена):'}</div><div class="marker-popup-footer-description-price">${priceNet} ${currencyName}</div></div>` : '';
                const priceStrikeBlock = priceStrike ? `<div class="marker-popup-footer-price-alert">${priceStrike} ${currencyName}</div>` : '';
                const availableRoomsBlock = availableRooms === 1 ? `<div class="marker-popup-red-available-description">${translationsHub?.onlyOneRoom ?? 'Остался 1 номер по этой цене'}</div>` : '';
                const quiQuoBlock = quiQuo ? `<div class="qq-btn-place" data-value="${quiQuo}"></div>` : '';
      
                const contentInfoWindow = `
                  <div class="details">
                    <div class="marker-popup-wrapper">
                      <div class="marker-popup-header-wrapper">
                      <a href="/hotels/${id}/${url}" class=map-dashboard-card-item-href>
                        <div class="market-popup-header-img-wrapper" style="background-image:url(${image});"></div>
                        </a>
                        <div class="marker-popup-header-info">
                        <a href="/hotels/${id}/${url}" class=map-dashboard-card-item-href>
                          <div class="marker-popup-header-title-wrapper">
                            <div class="marker-popup-header-title">${name}</div>
                            <div class="marker-popup-header-title-stars-list">${buildRatingBlock(stars)}</div>
                          </div>
                          </a>
                          <div class="marker-popup-header-description-wrapper">${ratingBlock}</div>
                          <div class="marker-popup-refundable-description">${flagRefundableText}</div>
                          ${availableRoomsBlock}
                          ${quiQuoBlock}
                        </div>
                        <a target="_blank" href="/hotels/${id}/${url}" class="marker-popup-header-btn"><img src="./images/arrow-right-btn.svg" alt=""></a>
                      </div>
                      <div class="marker-popup-footer-info">
                        <div class="marker-popup-footer-description-wrapper">${priceNetBlock}<div class="marker-popup-footer-description"><div class="marker-popup-footer-description-main">Всего (включая налоги и сборы):</div><div class="marker-popup-footer-description-price">${priceTotal} ${currencyName}</div></div></div>
                        <div class="marker-popup-footer-price-wrapper">${priceStrikeBlock}<div class="marker-popup-footer-price">за ночь ${priceNightly} ${currencyName}</div></div>
                      </div>
                    </div>
                  </div>
                `;
      
                // Создание InfoWindow
                infoWindow.setContent(contentInfoWindow);
                infoWindow.open(map, marker);
    
                // Центрирование карты на маркере и установка зума
              map.setCenter(marker.position);
              map.setZoom(15);
    
                toggleContentVisibility();
                buildBottomContent(name, stars, priceTotal, priceNightly, id, url, image, currencyName, countHotels, flagRefundableText, ratingBlock, priceNetBlock, availableRoomsBlock, priceStrikeBlock, quiQuoBlock);
                marker.element.querySelector('.property').classList.add("highlight");
    
    
              } catch (error) {
                console.error('Ошибка:', error);
              }
            })();
          }
    }



    marker.addListener("click", async () => {
      const propertyId = marker.title;

      const propertyData = await fetchPropertyData(propertyId, formData, marker);
      // console.log(propertyData)
      const { name, latitude, longitude, refundable, rating, priceNet, priceStrike, availableRooms, quiQuo, image, url, stars, priceTotal, priceNightly } = propertyData.data[0];

      const flagRefundableText = refundable ? (translationsHub?.fullRefund ?? 'Полный возврат') : '';
      const ratingBlock = rating > 0 ? `<div class="marker-popup-header-description-rate">${rating}</div><div class="marker-popup-header-description">${translationsHub?.guestRating ?? 'Рейтинг гостей'}</div>` : '';
      const priceNetBlock = priceNet ? `<div class="marker-popup-footer-description"><div class="marker-popup-footer-description-main">${translationsHub?.totalNetto ?? 'Всего (нетто цена):'}</div><div class="marker-popup-footer-description-price">${priceNet} ${currencyName}</div></div>` : '';
      const priceStrikeBlock = priceStrike ? `<div class="marker-popup-footer-price-alert">${priceStrike} ${currencyName}</div>` : '';
      const availableRoomsBlock = availableRooms === 1 ? `<div class="marker-popup-red-available-description">${translationsHub?.onlyOneRoom ?? 'Остался 1 номер по этой цене'}</div>` : '';
      const quiQuoBlock = quiQuo ? `<div class="qq-btn-place" data-value="${quiQuo}"></div>` : '';

      const contentInfoWindow = `
        <div class="details">
          <div class="marker-popup-wrapper">
            <div class="marker-popup-header-wrapper">
            <a href="/hotels/${id}/${url}" class=map-dashboard-card-item-href>
              <div class="market-popup-header-img-wrapper" style="background-image:url(${image});"></div>
              </a>
              <div class="marker-popup-header-info">
              <a href="/hotels/${id}/${url}" class=map-dashboard-card-item-href>
                <div class="marker-popup-header-title-wrapper">
                  <div class="marker-popup-header-title">${name}</div>
                  <div class="marker-popup-header-title-stars-list">${buildRatingBlock(stars)}</div>
                </div>
                </a>
                <div class="marker-popup-header-description-wrapper">${ratingBlock}</div>
                <div class="marker-popup-refundable-description">${flagRefundableText}</div>
                ${availableRoomsBlock}
                ${quiQuoBlock}
              </div>
              <a target="_blank" href="/hotels/${id}/${url}" class="marker-popup-header-btn"><img src="/images/arrow-right-btn.svg" alt=""></a>
            </div>
            <div class="marker-popup-footer-info">
              <div class="marker-popup-footer-description-wrapper">${priceNetBlock}<div class="marker-popup-footer-description"><div class="marker-popup-footer-description-main">${translationsHub?.includingTaxes ?? 'Всего (включая налоги и сборы)'}:</div><div class="marker-popup-footer-description-price">${priceTotal} ${currencyName}</div></div></div>
              <div class="marker-popup-footer-price-wrapper">${priceStrikeBlock}<div class="marker-popup-footer-price">${translationsHub?.forNight ?? 'за ночь'} ${priceNightly} ${currencyName}</div></div>
            </div>
          </div>
        </div>
      `;

      const offset = window.innerWidth > 1024 ? -150 : window.innerWidth >= 770 ? -250 : 0;
      centerMapZoom(offset, map, marker);

      infoWindow.setContent(contentInfoWindow);
      infoWindow.open(map, marker);

      toggleContentVisibility();
      buildBottomContent(name, stars, priceTotal, priceNightly, id, url, image, currencyName, countHotels, flagRefundableText, ratingBlock, priceNetBlock, availableRoomsBlock, priceStrikeBlock, quiQuoBlock);
      marker.element.querySelector('.property').classList.add("highlight");
    });

    leftBlock.addEventListener('click', function (event) {
      const target = event.target.closest('.map-dashboard-card-item');
      if (!target) return;

      const curItemLat = target.getAttribute('data-position-lat');
      const curItemLng = target.getAttribute('data-position-lng');

      if (marker.position.Gg == curItemLat && marker.position.Hg == curItemLng) {
        // Вычисление смещения для infoWindow
        map.setZoom(16);

        // Центрируем карту на маркере
        let offset = window.innerWidth > 1024 ? -90 : (window.innerWidth <= 1024 && window.innerWidth >= 770) ? -130 : 0;
        centerMapZoom(offset, map, marker);

        // console.log(target)
        const markerPopupHeaderWrapper = target.querySelector('.marker-popup-header-wrapper').outerHTML;
        const markerPopupFooterInfo = target.querySelector('.marker-popup-footer-info').outerHTML;
        // console.log(markerPopupHeaderWrapper)
        // console.log(markerPopupFooterInfo)
        const contentInfoWindow = `
        <div class="details">
          <div class="marker-popup-wrapper">
            ${markerPopupHeaderWrapper}
            ${markerPopupFooterInfo}
          </div>
        </div>
      `;

        infoWindow.setContent(contentInfoWindow);
        infoWindow.open(map, marker);

        toggleContentVisibility();
        // buildBottomContent(name,stars,priceTotal,priceNightly,id,url,image, currencyName, countHotels, flagRefundableText, ratingBlock, priceNetBlock, availableRoomsBlock, priceStrikeBlock, quiQuoBlock);
        marker.element.querySelector('.property').classList.add("highlight");
      }
    });

    return marker;
  });

  const markerCluster = new MarkerClusterer({ map, markers });

  google.maps.event.addListener(map, 'idle', async function () {
    const bounds = map.getBounds();

    const visibleMarkers = markers.filter(marker => {
      const position = marker.position;
      return bounds.contains(position);
    });

    const existingMarkers = visibleMarkers.map(marker => marker.title);

    if (visibleMarkers.length < markers.length) {

      const newMarkerData = await fetchMarkerDataWithinBounds(existingMarkers);

      // Обновляем leftBlock с новыми данными маркеров
      updateLeftBlockWithMarkerData(newMarkerData);
    }
  });


  google.maps.event.addListener(map, 'click', (event) => {
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
    leftSectionWrapper.classList.add('active');
  });

  // loaderDiv.style.display = 'none';
}
/////

function buildLeftContent(property, currencyName, countHotels, flagRefundableText, ratingBlock, priceNetBlock, availableRoomsBlock, priceStrikeBlock, quiQuoBlock) {

  const content = document.createElement("div");
  content.classList.add("map-dashboard-card-item");
  content.setAttribute('id', `marker-${property.id}`)
  content.setAttribute('data-position-lat', `${property.latitude}`);
  content.setAttribute('data-position-lng', `${property.longitude}`);

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
        <div class="marker-popup-footer-price">за ночь ${property.priceNightly} ${currencyName}</div>
      </div>
    </div>
  `;

  leftBlock.appendChild(content);
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

//Тоглер для очистки активных маркеров и активации нижнего блока при моб версии
function toggleContentVisibility() {
  // const mapDashboardCardsListWrapper = document.getElementById('map-dashboard-bottom-section-wrapper');
  mapCardsListBottomWrapper.classList.add('active');
  let allMarkersProperty = document.querySelectorAll('.property');
  allMarkersProperty.forEach((item) => {
    item.classList.remove('highlight')
  })
  let allMarkersLoaders = document.querySelectorAll('.map-marker-description.white-marker-text');
  allMarkersLoaders.forEach((item) => {
    item.classList.remove('white-marker-text')
  })
}

function buildContent(price, currencyName) {
  const content = document.createElement("div");
  content.classList.add("property");

  const priceTotal = price;
  const markerDescription = `${priceTotal} ${currencyName}`;

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

function buildBottomContent(name, stars, priceTotal, priceNightly, id, url, image, currencyName, countHotels, flagRefundableText, ratingBlock, priceNetBlock, availableRoomsBlock, priceStrikeBlock, quiQuoBlock) {
  headerMapCountElement.innerHTML = `${countHotels} ${translationsHub?.numberOfHotels ?? 'отеля в этой области'}`;

  mapCardsListBottomWrapper.innerHTML = `
  
    <div class="map-dashboard-card-item">
    <a href="/hotels/${id}/${url}" class=map-dashboard-card-item-href>
      <div class="marker-popup-header-wrapper">
        <div class="market-popup-header-img-wrapper" style="background-image:url(${image});"></div>
        <div class="marker-popup-header-info">
          <div class="marker-popup-header-title-wrapper">
            <div class="marker-popup-header-title">${name}</div>
            <div class="marker-popup-header-title-stars-list">${buildRatingBlock(stars)}</div>
          </div>
          <div class="marker-popup-header-description-wrapper">${ratingBlock}</div>
          <div class="marker-popup-refundable-description">${flagRefundableText}</div>
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
          <a href="/hotels/${id}/${url}" class="marker-popup-header-btn"><img src="/images/arrow-right-btn.svg" alt=""></a>
        </div>
      </div>
      </a>
    </div>
    
    
  `;
}

function buildRatingBlock(rating) {
  let stars = '';

  const roundedRating = Math.round(rating);

  for (let i = 0; i < roundedRating; i++) {
    stars += '<img src="/images/hotels/star-icon.svg" alt="star" class="marker-popup-header-title-star-item">';
  }

  return stars;
}

//Открытие карты и генерация ее
const mapShowSearch = document.querySelector('.result-amount-map-search-wrapper');
const hotelInfoBlock = document.querySelector('.hotel-info-block')
const mapDashboardWrapper = document.querySelector('.map-dashboard-main-wrapper-fade');

mapShowSearch.addEventListener('click', function () {
   const mapHotelId =  hotelInfoBlock.dataset.propertyId;
   const renderType =  mapShowSearch.dataset.rendertype;
  mapDashboardWrapper.classList.toggle('active');
  bodyTag.style.overflow = 'hidden';
  initMap(undefined,renderType,mapHotelId)

  loaderDiv.style.display = 'block';
})

//Открытие фильтра
const mapDashboardFilterWrapper = document.querySelector('.map-dashboard-filter-wrapper');
const mapDashboardFilterBtn = document.querySelector('.map-dashboard-filter-header-btn');

if (mapDashboardFilterBtn) {
    mapDashboardFilterBtn.addEventListener('click', function () {
      mapDashboardFilterWrapper.classList.toggle('active');
      leftBlock.classList.toggle('hide');
      document.querySelector('.map-dashboard-filter-main-wrapper').classList.toggle('active-filter');
      togglerMobileStyleFilterBlock();
    });
  }

//Закрытие фильтра
const closeFilterBlockbtn = document.getElementById('filters-block-submenus-header-btn');
if(closeFilterBlockbtn){
    closeFilterBlockbtn.addEventListener('click', function () {
        mapDashboardFilterWrapper.classList.toggle('active');
        leftBlock.classList.toggle('hide')
        mapCardsListBottomWrapper.classList.toggle('hide');
        document.querySelector('.map-dashboard-filter-main-wrapper').classList.toggle('active-filter')
        togglerMobileStyleFilterBlock()
      })
}

//Закрытие карты
const closeMapDashboardMainWrapperBtn = document.getElementById('map-dashboard-close-btn');
closeMapDashboardMainWrapperBtn.addEventListener('click', function () {
    closeMap()
})

function closeMap(){
    mapDashboardWrapper.classList.toggle('active');
  bodyTag.style.overflow = 'scroll';
  leftSectionWrapper.classList.toggle('active');
  clearMap()
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

//Нажатие на кнопку фильтра
if(mobileFilterApplyBtn){
    mobileFilterApplyBtn.addEventListener('click', () => {

        reInitMap()
      })
}

function reInitMap() {

  mapDashboardFilterWrapper.classList.toggle('active')
  leftBlock.classList.toggle('hide');

  document.querySelector('.map-dashboard-filter-main-wrapper').classList.toggle('active-filter')
  togglerMobileStyleFilterBlock()

  const markerStarsList = document.getElementById('marker-popup-header-title-stars-list');
  const propertiesSearchForm = document.getElementById('properties-search-form');
  clearCachedData()
  if (markerStarsList != null) {
    markerStarsList.innerHTML = ''
  }

  let typeRender = undefined;
  if (window.innerWidth > 770) {
    typeRender = 'showFilter'
  }

  if (!layoutDev) {
    let newformData = new FormData(propertiesSearchForm);
    const newSearchParams = new URLSearchParams();

    for (const pair of newformData) {
      newSearchParams.append(pair[0], pair[1]);
      // console.log(pair[0], pair[1])
    }
    newSearchParams.append('PropertySearchForm[parentUrl]', encodeURIComponent(window.location.search));
    initMap(newSearchParams, typeRender)

  } else {

    let newformData = new FormData();
    newformData.append("PropertySearchForm[location]", "179892");
    newformData.append("PropertySearchForm[checkinDate]", "27.08.2024");
    newformData.append("PropertySearchForm[checkoutDate]", "30.08.2024");
    newformData.append("PropertySearchForm[guests]", JSON.stringify([{ "adults": 3 }]));
    newformData.append("PropertySearchForm[partner]", "11090");
    newformData.append("PropertySearchForm[map]", "true");
    initMap(newformData, typeRender)

  }

  clearMap()
}

function togglerMobileStyleFilterBlock() {
  if (window.innerWidth <= 770) {
    let filterWrapperMobile = document.querySelector('.map-dashboard-left-section-wrapper.active');
    filterWrapperMobile.classList.toggle('mobile');
  }
}

// Функция для очистки данных из локального хранилища
function clearCachedData() {
  localStorage.removeItem('cachedData');
  clearMarkerCache('cache_markerData');
  clearLeftBlockCache('cache_leftBlock');
  clearPropertyCache('cache_property_')
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


// Найти форму с action /hotels/search
const form = document.querySelector('form[action="/hotels/search"]');

if (form) {
  // Найти кнопку внутри этой формы
  const searchButtonBlock = form.querySelector('.search-btn-block.col-search-button button');

  if (searchButtonBlock) {
    // Добавить обработчик события клика
    searchButtonBlock.addEventListener('click', () => {
      clearCachedData();
    });
  }
}
