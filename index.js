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

  console.log(infoHotels)

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
            00 ${currencyName}
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
          200$
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

    // const content = document.createElement("div");

    // content.classList.add("property");
    // content.innerHTML = `
    //   <div class="icon">
    //     <div class="map-marker-description">
    //       1
    //     </div>
    //   </div>`


    const marker = new google.maps.marker.AdvancedMarkerElement({
      position,
      content: buildContent(property, currencyName, countHotels, flagrRefundable, ratingDescriptionBlock, priceNetBlock, availableRoomsBlock, priceStrikeBlock, quiQuoBlock),
        position: position,
        title: nameHotel,
    });

    const element = marker.element;
      
      element.style.zIndex = '-1'
      element.addEventListener("click", () => {
        toggleContentVisibility(marker);
        // buildBottomContent(property, currencyName, countHotels, flagrRefundable, ratingDescriptionBlock, priceNetBlock, availableRoomsBlock, priceStrikeBlock, quiQuoBlock);
        // checkToClose(advancedMarkerView.position.lat, advancedMarkerView.position.lng, advancedMarkerViews)
      });

    // markers can only be keyboard focusable when they have click listeners
    // open info window when marker is clicked
    // marker.addListener("click", () => {
    //   infoWindow.setContent(position.lat + ", " + position.lng);
    //   infoWindow.open(map, marker);
    // });
    buildLeftContent(property, currencyName, countHotels, flagrRefundable, ratingDescriptionBlock, priceNetBlock, availableRoomsBlock, priceStrikeBlock, quiQuoBlock);
    return marker;
  });

  google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
    loaderDiv.style.display = 'none';
  });

  // Add a marker clusterer to manage the markers.
  new MarkerClusterer({ markers, map });
}

const locations = [
  { lat: -31.56391, lng: 147.154312 },
  { lat: -33.718234, lng: 150.363181 },
  { lat: -33.727111, lng: 150.371124 },
  { lat: -33.848588, lng: 151.209834 },
  { lat: -33.851702, lng: 151.216968 },
  { lat: -34.671264, lng: 150.863657 },
  { lat: -35.304724, lng: 148.662905 },
  { lat: -36.817685, lng: 175.699196 },
  { lat: -36.828611, lng: 175.790222 },
  { lat: -37.75, lng: 145.116667 },
  { lat: -37.759859, lng: 145.128708 },
  { lat: -37.765015, lng: 145.133858 },
  { lat: -37.770104, lng: 145.143299 },
  { lat: -37.7737, lng: 145.145187 },
  { lat: -37.774785, lng: 145.137978 },
  { lat: -37.819616, lng: 144.968119 },
  { lat: -38.330766, lng: 144.695692 },
  { lat: -39.927193, lng: 175.053218 },
  { lat: -41.330162, lng: 174.865694 },
  { lat: -42.734358, lng: 147.439506 },
  { lat: -42.734358, lng: 147.501315 },
  { lat: -42.735258, lng: 147.438 },
  { lat: -43.999792, lng: 170.463352 },
];

function toggleContentVisibility(markerView) {
  const mapDashboardCardsListWrapper = document.getElementById('map-dashboard-bottom-section-wrapper');
  markerView.classList.toggle('zindex-property');
  const content = markerView.content;
  if (currentOpenMarker && currentOpenMarker !== markerView) {
    toggleContentVisibility(currentOpenMarker);
  }
  content.classList.toggle("highlight");
  mapDashboardCardsListWrapper.classList.toggle('active');
  currentOpenMarker = content.classList.contains("highlight") ? markerView : null;


  
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

// const mapShowSearch = document.getElementById('result-amount-map-search-wrapper')
// const mapDashboardWrapper = document.getElementById('map-dashboard-main-wrapper-fade')
// mapShowSearch.addEventListener('click', function(){
//   mapDashboardWrapper.classList.toggle('active');
//   initMapHotels()
  
//   loaderDiv.style.display = 'block';
// })

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

initMap();




