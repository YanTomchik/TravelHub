/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { MarkerClusterer } from "https://cdn.skypack.dev/@googlemaps/markerclusterer@2.3.1";

/*const formData = new FormData();
formData.append("PropertySearchForm[location]", "6");
formData.append("PropertySearchForm[checkinDate]", "24.05.2024");
formData.append("PropertySearchForm[checkoutDate]", "30.05.2024");
formData.append("PropertySearchForm[guests]", JSON.stringify([{ "adults": 4 }]));
formData.append("PropertySearchForm[partner]", "11115");
formData.append("PropertySearchForm[map]", "true");*/

const loaderDiv = document.getElementById('loader-map');
const leftSectionWrapper = document.getElementById('map-dashboard-left-section-wrapper')
const adminFlag = false;
let currentOpenMarker = null;
let currentOpenMarkerCheck = null;

function triggerInputEvent(element) {
    let event = new Event('input', {
        bubbles: true,
        cancelable: true
    });
    element.dispatchEvent(event);
}

async function initMap() {
  // sync filters state
  $('#filters input[type="checkbox"], #filters input[type="radio"]').each(function() {
    var className = $(this).attr('class');
    var checked = $(this).is(':checked');
    var linkedItems = $('#map_filters .' + className);
    linkedItems.prop('checked', checked);
  });

  const mapRangeInput = document.querySelectorAll("#map_filters .range-input input");
  mapRangeInput[1].value = $('[name="maxPrice"]').val();
  triggerInputEvent(mapRangeInput[1]);

  mapRangeInput[0].value = $('[name="minPrice"]').val();
  triggerInputEvent(mapRangeInput[0]);

  $('#map_minPrice').text($('#minPrice').text());
  $('#map_maxPrice').text($('#maxPrice').text());

  // get search params
  const form = document.getElementById('properties-search-form');
  const formData = new FormData(form);
  const searchParams = new URLSearchParams();

  for (const pair of formData) {
    searchParams.append(pair[0], pair[1]);
  }
  searchParams.append('PropertySearchForm[parentUrl]', encodeURIComponent(window.location.search));

  const { Map, InfoWindow } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
    "marker",
  );

  const infoHotels = await fetch('/hotels/search-map', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: searchParams

  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(result => {
    return result;
  })

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
    disableAutoPan: false,
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
    if (priceStrike !== null) {
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
      infoWindow.setContent(contentInfoWindow);
      infoWindow.open(map, marker);

      //Дописать проверку на то есть ли уже уже у этого маркера этот клдасс
      toggleContentVisibility()
      buildBottomContent(property, currencyName, countHotels, flagrRefundable, ratingDescriptionBlock, priceNetBlock, availableRoomsBlock, priceStrikeBlock, quiQuoBlock);
      marker.element.querySelector('.property').classList.add("highlight");

    });

    return marker;
  });

//Скрывание лоудера и открытие левого блока при прогрузке карты
  google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
    loaderDiv.style.display = 'none';
    leftSectionWrapper.classList.toggle('active')
  });

  // Обработка события изменения области видимости карты
  google.maps.event.addListener(map, 'bounds_changed', function() {
    // Получение текущей области видимости карты
    const bounds = map.getBounds();

    // Получение координат углов области видимости
    const ne = bounds.getNorthEast(); // Северо-восточный угол
    const sw = bounds.getSouthWest(); // Юго-западный угол

    // Вывод координат углов области видимости в консоль
    // console.log('Северо-восточный угол:', ne.lat(), ne.lng());
    // console.log('Юго-западный угол:', sw.lat(), sw.lng());

    // Можно также получить центр текущей области видимости
    // const center = map.getCenter();
    // console.log('Центр области видимости:', center.lat(), center.lng());
  });

//Считывание клика на пустую область карты для закрытия инфо виндоу
google.maps.event.addListener(map, 'click', function(event) {
  // Закрыть infoWindow, если он 0рыт
  if (infoWindow) {

    infoWindow.close();
    toggleContentVisibility()
    const mapDashboardCardsListWrapperX = document.getElementById('map-dashboard-bottom-section-wrapper');
    mapDashboardCardsListWrapperX.classList.remove('active');

  }

  // Отключение информационных окон элементов инфраструктуры
  if (event.placeId) {
    // Call event.stop() on the event to prevent the default info window from showing.
    event.stop();
  }

});

  const markerCluster = new MarkerClusterer({ markers, map});

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
        <a href="#" class="marker-popup-header-btn">
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
})

//Закрытие фильтра
const closeFilterBlockbtn = document.getElementById('filters-block-submenus-header-btn');
closeFilterBlockbtn.addEventListener('click', function(){
  mapDashboardFilterWrapper.classList.toggle('active')
  mapDashboardCardsListWrapper.classList.toggle('hide')
})

//Закрытие карты
const closeMapDashboardMainWrapperBtn = document.getElementById('map-dashboard-close-btn');
closeMapDashboardMainWrapperBtn.addEventListener('click', function(){
  mapDashboardWrapper.classList.toggle('active');
  bodyTag.style.overflow = 'scroll';
  leftSectionWrapper.classList.toggle('active')
})

$(document).ready(function() {
  $('#map_filters input[type="checkbox"], #map_filters input[type="radio"]').on('change', function() {
    var className = $(this).attr('class');
    var checked = $(this).is(':checked');
    var linkedItems = $('#filters .' + className);
    linkedItems.prop('checked', checked);

    if (typeof $.fn.yiiActiveForm === 'function') {
      $('#properties-search-form').yiiActiveForm('validate', true);
    }
  });
});
