/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { MarkerClusterer } from "https://cdn.skypack.dev/@googlemaps/markerclusterer@2.3.1";

const formData = new FormData();
formData.append("PropertySearchForm[location]", "6");
formData.append("PropertySearchForm[checkinDate]", "24.05.2024");
formData.append("PropertySearchForm[checkoutDate]", "30.05.2024");
formData.append("PropertySearchForm[guests]", JSON.stringify([{ "adults": 4 }]));
formData.append("PropertySearchForm[partner]", "11115");
formData.append("PropertySearchForm[map]", "true");

const loaderDiv = document.getElementById('loader-map');
let currentOpenMarker = null;
let currentOpenMarkerCheck = null;
const adminFlag = false;

async function initMap() {
  // Request needed libraries.
  const { Map, InfoWindow } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
    "marker",
  );

  const infoHotels = await fetch('https://travelhub.by/hotels/search-map', {
    method: 'POST',
    body: formData
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(result => {
    console.log(result)
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
  });


  const infoWindow = new google.maps.InfoWindow({
    content: "",
    disableAutoPan: true,
  });
  // Create an array of alphabetical characters used to label the markers.
  const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  // Add some markers to the map.
  const markers = dataHotelsObj.map((property, i) => {

    const nameHotel = property.name;
      
      const position = {
        lat: parseFloat(property.latitude),
        lng: parseFloat(property.longitude)
      }

      let flagrRefundable = property.refundable;
      if(flagrRefundable == true){
        flagrRefundable = 'Полный возврат'
      }else{
        flagrRefundable = '';
      }

      let ratingHotel = property.rating;
      let ratingDescriptionBlock = ''
      if(ratingHotel > 0){
        ratingDescriptionBlock = `
            <div class="marker-popup-header-description-rate">
            ${ratingHotel}
          </div>
          <div class="marker-popup-header-description">
            Рейтинг гостей
          </div>
        `
      }else{
        ratingDescriptionBlock = '';
      }

      let priceNet = property.priceNet;
      let priceNetBlock = ''
      if(priceNet !== null){
        priceNetBlock = `
        <div class="marker-popup-footer-description">
          <div class="marker-popup-footer-description-main">
            Всего (нетто цена):
          </div>
          <div class="marker-popup-footer-description-price">
          ${priceNet} ${currencyName}
          </div>
        </div>
        `
      }else{
        priceNetBlock = '';
      }

      let priceStrike = property.priceStrike;
      let priceStrikeBlock = ''
      if(priceStrike !== null){
        priceStrikeBlock = `
        <div class="marker-popup-footer-price-alert">
        ${priceStrike} ${currencyName}
        </div>
        `
      }else{
        priceStrikeBlock = '';
      }

      let availableRooms = property.availableRooms;
      let availableRoomsBlock = ''
      if(availableRooms == 1){
        availableRoomsBlock = `
        <div class="marker-popup-red-available-description">
          Остался 1 номер по этой цене 
        </div>
        `
      }else{
        availableRoomsBlock = '';
      }

      let quiQuoElem = property.quiQuo;
      let quiQuoBlock = ''
      
      if(adminFlag == true){
        quiQuoBlock = `
        <div class="qq-btn-place" data-value="${quiQuoElem}">
        </div>
        `
      }else{
        quiQuoBlock = '';
      }

    const marker = new google.maps.marker.AdvancedMarkerElement({
      position,
      content: buildContent(property, currencyName, countHotels, flagrRefundable, ratingDescriptionBlock, priceNetBlock, availableRoomsBlock, priceStrikeBlock, quiQuoBlock),
        position: position,
        title: nameHotel,
    });

    // Получаем все кластеры маркеров из объекта MarkerClusterer

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
          <a href="#" class="marker-popup-header-btn">
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
      </div>
    </div>
    
    `
    const element = marker.element;   
      
    element.style.zIndex = '-2';

    buildLeftContent(property, currencyName, countHotels, flagrRefundable, ratingDescriptionBlock, priceNetBlock, availableRoomsBlock, priceStrikeBlock, quiQuoBlock);
    
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

  google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
    loaderDiv.style.display = 'none';
  });


google.maps.event.addListener(map, 'click', function() {
  // Закрыть infoWindow, если он открыт
  if (infoWindow) {
    
    infoWindow.close();
    toggleContentVisibility()
    const mapDashboardCardsListWrapperX = document.getElementById('map-dashboard-bottom-section-wrapper');
    mapDashboardCardsListWrapperX.classList.remove('active');

  }

});

  const markerCluster = new MarkerClusterer({ markers, map});

}


function toggleContentVisibility() {
  const mapDashboardCardsListWrapper = document.getElementById('map-dashboard-bottom-section-wrapper');
  mapDashboardCardsListWrapper.classList.add('active');

  let allMarkersProperty = document.querySelectorAll('.property');
      allMarkersProperty.forEach((item)=>{
        item.classList.remove('highlight')
      })
}

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

function buildLeftContent(property, currencyName, countHotels, flagrRefundable, ratingDescriptionBlock, priceNetBlock, availableRoomsBlock, priceStrikeBlock, quiQuoBlock){
  const mapDashboardCardsListWrapper = document.getElementById('map-dashboard-cards-list');
  const headerMapCountElement = document.getElementById('map-dashboard-filter-header-description');

  headerMapCountElement.innerHTML = `${countHotels} отеля в этой области`

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
                  <a href="#" class="marker-popup-header-btn">
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

function buildBottomContent (property, currencyName, countHotels, flagrRefundable, ratingDescriptionBlock, priceNetBlock, availableRoomsBlock, priceStrikeBlock, quiQuoBlock){
  const mapDashboardCardsListWrapper = document.getElementById('map-dashboard-bottom-section-wrapper');
  const headerMapCountElement = document.getElementById('map-dashboard-filter-header-description');

  headerMapCountElement.innerHTML = `${countHotels} отеля в этой области`
  
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

function buildRatingBlock (rating){

  let stars = ''
  let ratingToItterate = 0;

  if (rating - Math.floor(rating) === 0.5) {
    ratingToItterate = Math.floor(rating);
  } else {
    ratingToItterate =  Math.round(rating);
  }
  
  for(let i=0; i < ratingToItterate; i++){
    stars += '<img src="./images/star-marker.svg" alt="star" class="marker-popup-header-title-star-item">';
  }

  
  return stars;

}

const mapShowSearch = document.getElementById('result-amount-map-search-wrapper')
const mapDashboardWrapper = document.getElementById('map-dashboard-main-wrapper-fade')
mapShowSearch.addEventListener('click', function(){
  mapDashboardWrapper.classList.toggle('active');
  initMap()
  
  loaderDiv.style.display = 'block';
})

const mapDashboardFilterWrapper = document.getElementById('map-dashboard-filter-wrapper');
const mapDashboardFilterBtn = document.getElementById('map-dashboard-filter-header-btn');
const mapDashboardCardsListWrapper = document.getElementById('map-dashboard-cards-list');
const leftSectionWrapper = document.getElementById('map-dashboard-left-section-wrapper')
mapDashboardFilterBtn.addEventListener('click', function(){
  mapDashboardFilterWrapper.classList.toggle('active')
  mapDashboardCardsListWrapper.classList.toggle('hide')
  leftSectionWrapper.classList.toggle('active')
})


const closeFilterBlockbtn = document.getElementById('filters-block-submenus-header-btn');
closeFilterBlockbtn.addEventListener('click', function(){
  mapDashboardFilterWrapper.classList.toggle('active')
  mapDashboardCardsListWrapper.classList.toggle('hide')
  leftSectionWrapper.classList.toggle('active')
})


const closeMapDashboardMainWrapperBtn = document.getElementById('map-dashboard-close-btn');
closeMapDashboardMainWrapperBtn.addEventListener('click', function(){
  mapDashboardWrapper.classList.toggle('active')
})

// initMap();




