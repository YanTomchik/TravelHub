/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { MarkerClusterer } from "https://cdn.skypack.dev/@googlemaps/markerclusterer@2.3.1";

const loaderDiv = document.getElementById('loader-map');
const leftSectionWrapper = document.getElementById('map-dashboard-left-section-wrapper');

let layoutDev = (typeof implemented === 'undefined');
console.log(layoutDev);

const adminFlag = false;
const apiUrl = layoutDev ? 'https://travelhub.by/hotels/search-map' : 'hotels/search-map';

let currentOpenMarker = null;
let currentOpenMarkerCheck = null;
let flagRefresh = false;

function triggerInputEvent(element) {
    let event = new Event('input', {
        bubbles: true,
        cancelable: true
    });
    element.dispatchEvent(event);
}

async function fetchDataFromAPI(formData) {
  try {
      const response = await fetch(apiUrl, {
          method: 'POST',
          body: formData
      });
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error fetching data from API:', error);
      throw error;
  }


}

// Функция для получения кэшированных данных из локального хранилища
function getCachedData() {
  const cachedData = localStorage.getItem('cachedData');
  if (cachedData) {
      return JSON.parse(cachedData);
  }
  return null;
}

// Функция для сохранения данных в локальное хранилище
function cacheData(data) {
  localStorage.setItem('cachedData', JSON.stringify(data));
}

// Функция для получения данных: сначала проверяем кэш, затем загружаем из API
async function getData(formDataFromRequest) {
  let data = getCachedData();
  if (!data) {

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
            formData.append("PropertySearchForm[location]", "602433");
            formData.append("PropertySearchForm[checkinDate]", "27.05.2024");
            formData.append("PropertySearchForm[checkoutDate]", "30.05.2024");
            formData.append("PropertySearchForm[guests]", JSON.stringify([{ "adults": 2 }]));
            formData.append("PropertySearchForm[partner]", "11090");
            formData.append("PropertySearchForm[map]", "true");
        }
      }
      data = await fetchDataFromAPI(formData);
      cacheData(data);
  }
  return data;
}

async function initMap(formData) {
  loaderDiv.style.display = 'block';
  // sync filters state

  document.querySelectorAll('#filters input[type="checkbox"], #filters input[type="radio"]').forEach(function(element) {
    let className = element.getAttribute('name');
    let checked = element.checked;
    let filterInputValue = element.value;
    let linkedItems = document.querySelectorAll(`#map_filters [name="map_${className}"]`);

    linkedItems.forEach(function(item) {
      let mapFilterInputValue = item.value;

        if(mapFilterInputValue == filterInputValue){
          item.checked = checked;
        }

    });
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

  const { Map, InfoWindow } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
    "marker",
  );

  // Получаем данные
  const infoHotels = await getData(formData);

  const dataHotelsObj = infoHotels.data;
  const currencyName = infoHotels.currency;
  const countHotels = infoHotels.count;

  const latC = parseFloat(infoHotels.latitude_с);
  const lngC = parseFloat(infoHotels.longitude_с);

  const center = {
    lat: latC,
    lng: lngC,
  };

  const map = new google.maps.Map(document.getElementById("map-dashoard-wrapper"), {
    zoom: 13,
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
    closeButton:false,
  });

  const markers = dataHotelsObj.map((property, i) => {

    const nameHotel = property.name;

    const position = {
      lat: parseFloat(property.latitude),
      lng: parseFloat(property.longitude)
    }

    let flagrRefundable = property.refundable;

    if (flagrRefundable == true) {
      flagrRefundable = translationsHub?.fullRefund ?? 'Полный возврат'
    } else {
      flagrRefundable = '';
    }

    let ratingHotel = property.rating;
    let ratingDescriptionBlock = ''
    if(ratingHotel > 0) {
      ratingDescriptionBlock = `
        <div class="marker-popup-header-description-rate">
          ${ratingHotel}
        </div>
        <div class="marker-popup-header-description">
          ${translationsHub?.guestRating ?? 'Рейтинг гостей'}
        </div>
      `
    } else {
      ratingDescriptionBlock = '';
    }

    let priceNet = property.priceNet;
    let priceNetBlock = ''

    if (priceNet !== null) {
      priceNetBlock = `
        <div class="marker-popup-footer-description">
          <div class="marker-popup-footer-description-main">
            ${translationsHub?.totalNetto ?? 'Всего (нетто цена):'}
          </div>
          <div class="marker-popup-footer-description-price">
          ${priceNet} ${currencyName}
          </div>
        </div>
        `
    } else{
      priceNetBlock = '';
    }

    let priceStrike = property.priceStrike;
    let priceStrikeBlock = ''
    if (priceStrike !== 0 && priceStrike !== null) {
      priceStrikeBlock = `
        <div class="marker-popup-footer-price-alert">
          ${priceStrike} ${currencyName}
        </div>
      `
    } else {
      priceStrikeBlock = '';
    }

    let availableRooms = property.availableRooms;
    let availableRoomsBlock = ''
    if (availableRooms == 1) {
      availableRoomsBlock = `
        <div class="marker-popup-red-available-description">
          ${translationsHub?.onlyOneRoom ?? 'Остался 1 номер по этой цене'}
        </div>
      `
    } else {
      availableRoomsBlock = '';
    }

    let quiQuoElem = property.quiQuo;
    let quiQuoBlock = ''

    if (adminFlag == true) {
      quiQuoBlock = `
        <div class="qq-btn-place" data-value="${quiQuoElem}">
        </div>
      `
    } else {
      quiQuoBlock = '';
    }

    const marker = new google.maps.marker.AdvancedMarkerElement({
      position,
      content: buildContent(property, currencyName, countHotels, flagrRefundable, ratingDescriptionBlock, priceNetBlock, availableRoomsBlock, priceStrikeBlock, quiQuoBlock),
        position: position,
        title: nameHotel,
    });

    //Генерация блока для инфо виндоу
    const contentInfoWindow = `
      <div class="details">
        <div class="marker-popup-wrapper">
          <div class="marker-popup-header-wrapper">
            <div class="market-popup-header-img-wrapper" style="background-image:url(${property.image});">
            </div>
            <div class="marker-popup-header-info">
              <div class="marker-popup-header-title-wrapper">
                <div class="marker-popup-header-title">
                  ${property.name}
                </div>

                <div class="marker-popup-header-title-stars-list">
                  ${buildRatingBlock(property.stars)}
                </div>
              </div>
              <div class="marker-popup-header-description-wrapper">
                ${ratingDescriptionBlock}
              </div>
              <div class="marker-popup-refundable-description">
                ${flagrRefundable}
              </div>
              ${availableRoomsBlock}
              ${quiQuoBlock}
            </div>
            <a target="_blank" href="/hotels/${property.id}/${property.url}" class="marker-popup-header-btn">
              <img src="./images/arrow-right-btn.svg" alt="">
            </a>
          </div>
          <div class="marker-popup-footer-info">
            <div class="marker-popup-footer-description-wrapper">
              ${priceNetBlock}
              <div class="marker-popup-footer-description">
                <div class="marker-popup-footer-description-main">
                  ${translationsHub?.onlyOneRoom ?? 'Всего (включая налоги и сборы):'}
                </div>
                <div class="marker-popup-footer-description-price">
                  ${property.priceTotal} ${currencyName}
                </div>
              </div>
            </div>
            <div class="marker-popup-footer-price-wrapper">
              ${priceStrikeBlock}
              <div class="marker-popup-footer-price">
                за ночь ${property.priceNightly} ${currencyName}
              </div>
            </div>
          </div>
      </div>
    </div>
    `
    const element = marker.element;
    element.style.zIndex = '-2';

    buildLeftContent(property, currencyName, countHotels, flagrRefundable, ratingDescriptionBlock, priceNetBlock, availableRoomsBlock, priceStrikeBlock, quiQuoBlock);

    //Считывание клика по маркеру
    marker.addListener("click", () => {

      // Центрирование карты на местоположении маркера
      // Вычисление смещения для infoWindow
      if(window.innerWidth > 1024){
        let offset = -150;
        centerMapZoom(offset,map, marker)

      }else if(window.innerWidth <= 1024 && window.innerWidth >= 770){
        let offset = -250;
        centerMapZoom(offset,map, marker)
      }
      // Отображение infoWindow
      infoWindow.setContent(contentInfoWindow);
      infoWindow.open(map, marker);


      //Дописать проверку на то есть ли уже уже у этого маркера этот клдасс
      toggleContentVisibility()

      buildBottomContent(property, currencyName, countHotels, flagrRefundable, ratingDescriptionBlock, priceNetBlock, availableRoomsBlock, priceStrikeBlock, quiQuoBlock);
      marker.element.querySelector('.property').classList.add("highlight");

    });

    const leftBlockItems = document.querySelectorAll('.map-dashboard-card-item');

    leftBlockItems.forEach((item)=>{

    item.addEventListener('click', () =>{
        const curItemLat = item.getAttribute('data-position-lat');
        const curItemLng = item.getAttribute('data-position-lng');

        if(marker.position.Gg == curItemLat && marker.position.Hg == curItemLng){
          // Вычисление смещения для infoWindow
          map.setZoom(16);
          // Центрируем карту на маркере
          if(window.innerWidth > 1024){
            let offset = -90;
            centerMapZoom(offset,map, marker)

          }else if(window.innerWidth <= 1024 && window.innerWidth >= 770){
            let offset = -130;
            centerMapZoom(offset,map, marker)
          }

          infoWindow.setContent(contentInfoWindow);
          infoWindow.open(map, marker);

          toggleContentVisibility()
          buildBottomContent(property, currencyName, countHotels, flagrRefundable, ratingDescriptionBlock, priceNetBlock, availableRoomsBlock, priceStrikeBlock, quiQuoBlock);
          marker.element.querySelector('.property').classList.add("highlight");
        }

      })
    });

    return marker;
  });

//Скрывание лоудера и открытие левого блока при прогрузке карты
  google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
    loaderDiv.style.display = 'none';
    leftSectionWrapper.classList.add('active')
  });

  // Обработка события изменения области видимости карты
  google.maps.event.addListener(map, 'bounds_changed', function() {
    // Получение текущей области видимости карты
    const bounds = map.getBounds();

    // Получение координат углов области видимости
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    const leftBlockWrapper = document.querySelectorAll('.map-dashboard-card-item');
    //Отображение отлей в левой части в зависимости от зума
    leftBlockWrapper.forEach((item)=>{

      const itemLat = item.getAttribute('data-position-lat');
      const itemLng = item.getAttribute('data-position-lng');

      if (itemLat >= sw.lat() && itemLat <= ne.lat() && itemLng >= sw.lng() && itemLng <= ne.lng()) {
        item.style.display = 'block'
      }else{
        item.style.display = 'none'
      }

    })
  });


function centerMapZoom (offsetValue, map, marker){
  var projection = map.getProjection();
  var centerPixel = projection.fromLatLngToPoint(marker.position);
  centerPixel.x += offsetValue / Math.pow(2, map.getZoom());
  var centerLatLng = projection.fromPointToLatLng(centerPixel);

  map.setCenter(centerLatLng);
}

//Считывание клика на пустую область карты для закрытия инфо виндоу
  google.maps.event.addListener(map, 'click', function(event) {
    // Закрыть infoWindow, если он 0рыт
    if (infoWindow) {

      infoWindow.close();
      toggleContentVisibility()
      const mapCardsListWrapper = document.getElementById('map-dashboard-bottom-section-wrapper');
      mapCardsListWrapper.classList.remove('active');

    }

    // Отключение информационных окон элементов инфраструктуры
    if (event.placeId) {
      // Call event.stop() on the event to prevent the default info window from showing.
      event.stop();
    }

  });

  const clusterOptions = {
    gridSize: 200,
    maxZoom: null,
    zoomOnClick: true,
    averageCenter: false,
    minimumClusterSize: 3
};
  const markerCluster = new MarkerClusterer({ markers, map, clusterOptions});

}


//Тоглер для очистки активных маркеров и активации нижнего блока при моб версии
function toggleContentVisibility() {
  const mapDashboardCardsListWrapper = document.getElementById('map-dashboard-bottom-section-wrapper');
  mapDashboardCardsListWrapper.classList.add('active');
  let allMarkersProperty = document.querySelectorAll('.property');
      allMarkersProperty.forEach((item)=>{
        item.classList.remove('highlight')
      })
}


//Генерация маркеров
function buildContent(property, currencyName, countHotels, flagrRefundable, ratingDescriptionBlock, priceNetBlock, availableRoomsBlock, priceStrikeBlock, quiQuoBlock) {
  const content = document.createElement("div");

  content.classList.add("property");
  content.innerHTML = `
    <div class="icon">
      <div class="map-marker-description">
        ${property.priceTotal}${currencyName}
      </div>
    </div>
  `;
  return content;
}

//Генерация левого блока
function buildLeftContent(property, currencyName, countHotels, flagrRefundable, ratingDescriptionBlock, priceNetBlock, availableRoomsBlock, priceStrikeBlock, quiQuoBlock){
  const mapDashboardCardsListWrapper = document.getElementById('map-dashboard-cards-list');
  const headerMapCountElement = document.getElementById('map-dashboard-filter-header-description');

  headerMapCountElement.innerHTML = `${countHotels} ${translationsHub?.numberOfHotels ?? 'отеля в этой области'}`;

  const content = document.createElement("div");

  content.classList.add("map-dashboard-card-item");

  content.setAttribute('data-position-lat',`${property.latitude}`);
  content.setAttribute('data-position-lng',`${property.longitude}`);

  content.innerHTML = `
    <div class="marker-popup-header-wrapper">
      <div class="market-popup-header-img-wrapper" style="background-image:url(${property.image});">
      </div>
      <div class="marker-popup-header-info">
        <div class="marker-popup-header-title-wrapper">
          <div class="marker-popup-header-title">
            ${property.name}
          </div>
          <div class="marker-popup-header-title-stars-list" id="marker-popup-header-title-stars-list">
            ${buildRatingBlock(property.stars)}
          </div>
        </div>
        <div class="marker-popup-header-description-wrapper">
          ${ratingDescriptionBlock}
        </div>
        <div class="marker-popup-refundable-description">
          ${flagrRefundable}
        </div>
        ${availableRoomsBlock}
        ${quiQuoBlock}
      </div>
      <a target="_blank" href="/hotels/${property.id}/${property.url}" class="marker-popup-header-btn">
        <img src="./images/arrow-right-btn.svg" alt="">
      </a>
    </div>
    <div class="marker-popup-footer-info">
      <div class="marker-popup-footer-description-wrapper">
        ${priceNetBlock}
        <div class="marker-popup-footer-description">
          <div class="marker-popup-footer-description-main">
            Всего (включая налоги и сборы):
          </div>
          <div class="marker-popup-footer-description-price">
            ${property.priceTotal} ${currencyName}
          </div>
        </div>
      </div>
      <div class="marker-popup-footer-price-wrapper">
        ${priceStrikeBlock}
        <div class="marker-popup-footer-price">
          за ночь ${property.priceNightly} ${currencyName}
        </div>
      </div>
    </div>
  `;
  mapDashboardCardsListWrapper.appendChild(content)

}

//Генерация блока для мобильной версии
function buildBottomContent (property, currencyName, countHotels, flagrRefundable, ratingDescriptionBlock, priceNetBlock, availableRoomsBlock, priceStrikeBlock, quiQuoBlock){
  const mapDashboardCardsListWrapper = document.getElementById('map-dashboard-bottom-section-wrapper');
  const headerMapCountElement = document.getElementById('map-dashboard-filter-header-description');

  headerMapCountElement.innerHTML = `${countHotels} ${translationsHub?.numberOfHotels ?? 'отеля в этой области'}`;

  mapDashboardCardsListWrapper.innerHTML = `
    <div class = "map-dashboard-card-item">
      <div class="marker-popup-header-wrapper">
        <div class="market-popup-header-img-wrapper" style="background-image:url(${property.image});">
      </div>
      <div class="marker-popup-header-info">
        <div class="marker-popup-header-title-wrapper">
          <div class="marker-popup-header-title">
            ${property.name}
          </div>
          <div class="marker-popup-header-title-stars-list" id="marker-popup-header-title-stars-list">
            ${buildRatingBlock(property.rating)}
          </div>
        </div>
        <div class="marker-popup-header-description-wrapper">
          ${ratingDescriptionBlock}
        </div>
        <div class="marker-popup-refundable-description">
            ${flagrRefundable}
        </div>
        ${availableRoomsBlock}
        ${quiQuoBlock}
      </div>
    </div>
    <div class="marker-popup-footer-info">
      <div class="marker-popup-footer-description-wrapper">
        ${priceNetBlock}
        <div class="marker-popup-footer-description">
          <div class="marker-popup-footer-description-main">
            Всего (включая налоги и сборы):
          </div>
          <div class="marker-popup-footer-description-price">
            ${property.priceTotal} ${currencyName}
          </div>
        </div>
      </div>
      ${priceStrikeBlock}
      <div class="marker-popup-footer-price-wrapper">
        <div class="marker-popup-footer-price">
          за ночь ${property.priceNightly} ${currencyName}
        </div>
        <a href="/hotels/${property.id}/${property.url}" class="marker-popup-header-btn">
          <img src="./images/arrow-right-btn.svg" alt="">
        </a>
      </div>
    </div>
  </div>
  `
}

//Генерация блока с рейтингом и количеством звезд
function buildRatingBlock (rating){

  let stars = ''
  let ratingToItterate = 0;

  if (rating - Math.floor(rating) === 0.5) {
    ratingToItterate = Math.floor(rating);
  } else {
    ratingToItterate =  Math.round(rating);
  }

  for(let i=0; i < ratingToItterate; i++){
    stars += '<img src="./images/hotels/star-icon.svg" alt="star" class="marker-popup-header-title-star-item">';
  }

  return stars;

}

const bodyTag = document.body;

//Открытие карты и генерация ее
const mapShowSearch = document.getElementById('result-amount-map-search-wrapper')
const mapDashboardWrapper = document.getElementById('map-dashboard-main-wrapper-fade')
mapShowSearch.addEventListener('click', function(){
  mapDashboardWrapper.classList.toggle('active');
  bodyTag.style.overflow = 'hidden';
  initMap()

  loaderDiv.style.display = 'block';
})

//Открытие фильтра
const mapDashboardFilterWrapper = document.getElementById('map-dashboard-filter-wrapper');
const mapDashboardFilterBtn = document.getElementById('map-dashboard-filter-header-btn');
const mapDashboardCardsListWrapper = document.getElementById('map-dashboard-cards-list');


mapDashboardFilterBtn.addEventListener('click', function(){
  mapDashboardFilterWrapper.classList.toggle('active')
  mapDashboardCardsListWrapper.classList.toggle('hide')
  document.querySelector('.map-dashboard-filter-main-wrapper').classList.toggle('active-filter')
  togglerMobileStyleFilterBlock()

})

//Закрытие фильтра
const closeFilterBlockbtn = document.getElementById('filters-block-submenus-header-btn');
closeFilterBlockbtn.addEventListener('click', function(){
  mapDashboardFilterWrapper.classList.toggle('active')
  mapDashboardCardsListWrapper.classList.toggle('hide');
  document.querySelector('.map-dashboard-filter-main-wrapper').classList.toggle('active-filter')
  togglerMobileStyleFilterBlock()
})

//Закрытие карты
const closeMapDashboardMainWrapperBtn = document.getElementById('map-dashboard-close-btn');
const mapCardsListWrapper = document.getElementById('map-dashboard-cards-list');

closeMapDashboardMainWrapperBtn.addEventListener('click', function(){
  mapDashboardWrapper.classList.toggle('active');
  bodyTag.style.overflow = 'scroll';
  leftSectionWrapper.classList.toggle('active');
  mapCardsListWrapper.innerHTML = '';
})

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('#map_filters input[type="checkbox"], #map_filters input[type="radio"]').forEach(function(element) {
      element.addEventListener('change', function() {

          const markerStarsList = document.getElementById('marker-popup-header-title-stars-list');
          
          mapDashboardFilterWrapper.classList.toggle('active')
          mapDashboardCardsListWrapper.classList.toggle('hide');
          document.querySelector('.map-dashboard-filter-main-wrapper').classList.toggle('active-filter')
          togglerMobileStyleFilterBlock()

          let classNameMapFilter = element.getAttribute('name');
          let classNameFilter = classNameMapFilter.split('map_')[1]
          let checked = element.checked;
          let mapFilterInputValue = element.value;
          let linkedItems = document.querySelectorAll(`#filters [name="${classNameFilter}"]`);

          linkedItems.forEach(function(item) {
            let filterInputValue = item.value;

              if(mapFilterInputValue == filterInputValue){
                item.checked = checked;
              }

          });

          if (typeof $.fn.yiiActiveForm === 'function') {
              $('#properties-search-form').yiiActiveForm('validate', true);
          }

          clearCachedData()
          markerStarsList.innerHTML = ''       

          if (!layoutDev) {

              let form = document.getElementById('properties-search-form');
              console.log(form)
              let newformData = new FormData(form);
              const newSearchParams = new URLSearchParams();

              for (const pair of newformData) {
                newSearchParams.append(pair[0], pair[1]);
                console.log(pair[0], pair[1])
              }
              newSearchParams.append('PropertySearchForm[parentUrl]', encodeURIComponent(window.location.search));
              initMap(newSearchParams)

            } else {

                let newformData = new FormData();
                newformData.append("PropertySearchForm[location]", "602433");
                newformData.append("PropertySearchForm[checkinDate]", "27.05.2024");
                newformData.append("PropertySearchForm[checkoutDate]", "30.05.2024");
                newformData.append("PropertySearchForm[guests]", JSON.stringify([{ "adults": 3 }]));
                newformData.append("PropertySearchForm[partner]", "11090");
                newformData.append("PropertySearchForm[map]", "true");
                initMap(newformData)

            }
      });
  });
});



function togglerMobileStyleFilterBlock(){
  if(window.innerWidth <= 770){
    let filterWrapperMobile = document.querySelector('.map-dashboard-left-section-wrapper.active');
    filterWrapperMobile.classList.toggle('mobile')
  }
}


// Функция для очистки данных из локального хранилища
function clearCachedData() {
  localStorage.removeItem('cachedData');
}




