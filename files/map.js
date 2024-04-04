const formData = new FormData();
formData.append("PropertySearchForm[location]", "2621");
formData.append("PropertySearchForm[checkinDate]", "10.04.2024");
formData.append("PropertySearchForm[checkoutDate]", "12.04.2024");
formData.append("PropertySearchForm[guests]", JSON.stringify([{ "adults": 2 }]));
formData.append("PropertySearchForm[partner]", "11090");
formData.append("PropertySearchForm[map]", "true");

// const formData = new FormData();
// formData.append("PropertySearchForm[location]", "6");
// formData.append("PropertySearchForm[checkinDate]", "10.07.2024");
// formData.append("PropertySearchForm[checkoutDate]", "20.07.2024");
// formData.append("PropertySearchForm[guests]", JSON.stringify([{ "adults": 2 }]));
// formData.append("PropertySearchForm[partner]", "11115");
// formData.append("PropertySearchForm[map]", "true");


// const getHotelsInfo = async () => {
//   try {
//     const hotelsInfo = await fetch('https://travelhub.by/hotels/search-map', {
//           method: 'POST',
//           body: formData
//         })
//         .then(response => {
//           if (!response.ok) {
//             throw new Error('Network response was not ok');
//           }
//           return response.json();
//         })
//         .then(result => {
//           console.log(result)
//           return result;
//         })
//   } catch (error) {
//     console.log(error)
//   }
// }

let currentOpenMarker = null;

const loaderDiv = document.getElementById('loader-map');

function initMapHotels() {

  fetch('https://travelhub.by/hotels/search-map', {
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

    
    let advancedMarkerViews = []
    const center = {
      lat: 40.84,
      lng: -73.97,
    };

    

    const map = new google.maps.Map(document.getElementById("map-dashoard-wrapper"), {
      zoom: 13,
      center,
      mapId: "4504f8b37365c3d0",
      // styles: customMapStyles
    });

    const dataHotelsObj = result.data;
    const currencyName = result.currency;
    const countHotels = result.count;
    
    for (const property of dataHotelsObj){

      const nameHotel = property.name;
      
      const position = {
        lat: parseFloat(property.latitude),
        lng: parseFloat(property.longitude)
      }

      

      const advancedMarkerView = new google.maps.marker.AdvancedMarkerView({
        map,
        content: buildContent(property, currencyName, countHotels),
        position: position,
        title: nameHotel,
        // optimized: true,
      });

  
      const element = advancedMarkerView.element;
      
      element.style.zIndex = '-1'
      element.addEventListener("click", () => {
        toggleContentVisibility(advancedMarkerView);
        
      });
      advancedMarkerViews.push(advancedMarkerView);

      buildLeftContent(property,currencyName, countHotels);
    }

    google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
      loaderDiv.style.display = 'none';
    });
  })
  .catch(error => {
    
    console.error('There has been a problem with your fetch operation:', error);
  });

}


function toggleContentVisibility(markerView) {
    
    markerView.classList.toggle('zindex-property')
  const content = markerView.content;
  if (currentOpenMarker && currentOpenMarker !== markerView) {
    toggleContentVisibility(currentOpenMarker);
  }

  content.classList.toggle("highlight");
  currentOpenMarker = content.classList.contains("highlight") ? markerView : null;

  
}

function buildContent(property, currencyName, countHotels) {
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
              <div class="marker-popup-header-description-rate">
                ${property.rating}
              </div>
              <div class="marker-popup-header-description">
                Рейтинг гостей
              </div>
            </div>
          </div>
          <a href="#" class="marker-popup-header-btn">
            <img src="./images/arrow-right-btn.svg" alt="">
          </a>
        </div>
        <div class="marker-popup-footer-info">
                  <div class="marker-popup-footer-description-wrapper">
                    <div class="marker-popup-footer-description">
                      <div class="marker-popup-footer-description-main">
                        Всего (нетто цена):
                      </div>
                      <div class="marker-popup-footer-description-price">
                        ${property.priceNightly} ${currencyName}
                      </div>
                    </div>
                    <div class="marker-popup-footer-description">
                      <div class="marker-popup-footer-description-main">
                        Всего (включая налоги и сборы):
                      </div>
                      <div class="marker-popup-footer-description-price">
                      ${property.priceStrike} ${currencyName}
                      </div>
                    </div>
                  </div>
                  <div class="marker-popup-footer-price-wrapper">
                    <div class="marker-popup-footer-price-alert">
                      
                    </div>
                    <div class="marker-popup-footer-price">
                      за ночь ${property.priceTotal} ${currencyName}
                    </div>
                    
                  </div>
                </div>
      </div>
    </div>
  `;
  return content;
}
 
function buildLeftContent(property, currencyName, countHotels){
  const mapDashboardCardsListWrapper = document.getElementById('map-dashboard-cards-list');
  const headerMapCountElement = document.getElementById('map-dashboard-filter-header-description');

  headerMapCountElement.innerHTML = `${countHotels} отеля в этой области`
  
  let flagrRefundable = property.refundable;
  if(flagrRefundable == true){
    flagrRefundable = 'Полный возврат'
  }else{
    flagrRefundable = '';
  }
  
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
                      <div class="marker-popup-header-description-rate">
                        ${property.rating}
                      </div>
                      <div class="marker-popup-header-description">
                        Рейтинг гостей
                      </div>
                    </div>
                    <div class="marker-popup-refundable-description">
                        ${flagrRefundable}
                      </div>
                  </div>
                  <a href="#" class="marker-popup-header-btn">
                    <img src="./images/arrow-right-btn.svg" alt="">
                  </a>
                </div>
                <div class="marker-popup-footer-info">
                  <div class="marker-popup-footer-description-wrapper">
                    <div class="marker-popup-footer-description">
                      <div class="marker-popup-footer-description-main">
                        Всего (нетто цена):
                      </div>
                      <div class="marker-popup-footer-description-price">
                      ${property.priceNightly} ${currencyName}
                      </div>
                    </div>
                    <div class="marker-popup-footer-description">
                      <div class="marker-popup-footer-description-main">
                        Всего (включая налоги и сборы):
                      </div>
                      <div class="marker-popup-footer-description-price">
                      ${property.priceStrike} ${currencyName}
                      </div>
                    </div>
                  </div>
                  <div class="marker-popup-footer-price-wrapper">
                    <div class="marker-popup-footer-price-alert">
                      
                    </div>
                    <div class="marker-popup-footer-price">
                      за ночь ${property.priceTotal} ${currencyName}
                    </div>
                    
                  </div>
                </div>
  `;
  mapDashboardCardsListWrapper.appendChild(content)
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
  initMapHotels()
  
  
  loaderDiv.style.display = 'block';
})

const mapDashboardFilterWrapper = document.getElementById('map-dashboard-filter-wrapper');
const mapDashboardFilterBtn = document.getElementById('map-dashboard-filter-header-btn');
const mapDashboardCardsListWrapper = document.getElementById('map-dashboard-cards-list');
// mapDashboardFilterBtn.addEventListener('click', function(){
//   mapDashboardFilterWrapper.classList.toggle('active')
//   mapDashboardCardsListWrapper.classList.toggle('hide')
// })


const closeFilterBlockbtn = document.getElementById('filters-block-submenus-header-btn');
closeFilterBlockbtn.addEventListener('click', function(){
  mapDashboardFilterWrapper.classList.toggle('active')
  mapDashboardCardsListWrapper.classList.toggle('hide')
})


const closeMapDashboardMainWrapperBtn = document.getElementById('map-dashboard-close-btn');
closeMapDashboardMainWrapperBtn.addEventListener('click', function(){
  mapDashboardWrapper.classList.toggle('active')
})





