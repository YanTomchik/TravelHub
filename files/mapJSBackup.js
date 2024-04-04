const formData = new FormData();
formData.append("PropertySearchForm[location]", "2621");
formData.append("PropertySearchForm[checkinDate]", "03.04.2024");
formData.append("PropertySearchForm[checkoutDate]", "04.04.2024");
formData.append("PropertySearchForm[guests]", JSON.stringify([{ "adults": 2 }]));
formData.append("PropertySearchForm[partner]", "11090");
formData.append("PropertySearchForm[map]", "true");

let currentOpenMarker = null;

function initMap() {
  
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
      lat: 40.74,
      lng: -73.97,
    };
    const map = new google.maps.Map(document.getElementById("map-dashoard-wrapper"), {
      zoom: 12,
      center,
      mapId: "4504f8b37365c3d0",
    });
    
    const dataHotelsObj = result.data;
    const currencyName = result.currency;
    
    for (const property of dataHotelsObj){

      const nameHotel = property.name;
      
      const position = {
        lat: parseFloat(property.latitude),
        lng: parseFloat(property.longitude)
      }

      

      const advancedMarkerView = new google.maps.marker.AdvancedMarkerView({
        map,
        content: buildContent(property,currencyName),
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
    }
    
    

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


function buildContent(property, currencyName) {
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
                <img src="./images/star-marker.svg" alt="star" class="marker-popup-header-title-star-item">
                <img src="./images/star-marker.svg" alt="star" class="marker-popup-header-title-star-item">
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
                        ${property.priceNightly}${currencyName}
                      </div>
                    </div>
                    <div class="marker-popup-footer-description">
                      <div class="marker-popup-footer-description-main">
                        Всего (включая налоги и сборы):
                      </div>
                      <div class="marker-popup-footer-description-price">
                      ${property.priceStrike}${currencyName}
                      </div>
                    </div>
                  </div>
                  <div class="marker-popup-footer-price-wrapper">
                    <div class="marker-popup-footer-price-alert">
                      
                    </div>
                    <div class="marker-popup-footer-price">
                      за ночь ${property.priceTotal}${currencyName}
                    </div>
                    
                  </div>
                </div>
      </div>
    </div>
  `;
  return content;
}
  


  // const properties = [
  //   {
  //     address: "215 Emily St, MountainView, CA",
  //     name:"Mamma Mia",
  //     description: "Single family house with modern design",
  //     price: "$ 3,889,000",
  //     type: "home",
  //     bed: 5,
  //     bath: 4.5,
  //     size: 300,
  //     position: {
  //       lat: 37.50024109655184,
  //       lng: -122.28528451834352,
  //     },
  //   },
  //   {
  //     address: "108 Squirrel Ln &#128063;, Menlo Park, CA",
  //     name:"Mamma Mia",
  //     description: "Townhouse with friendly neighbors",
  //     price: "$ 3,050,000",
  //     type: "building",
  //     bed: 4,
  //     bath: 3,
  //     size: 200,
  //     position: {
  //       lat: 37.44440882321596,
  //       lng: -122.2160620727,
  //     },
  //   },
  //   {
  //     address: "100 Chris St, Portola Valley, CA",
  //     name:"Mamma Mia",
  //     description: "Spacious warehouse great for small business",
  //     price: "$ 3,125,000",
  //     type: "warehouse",
  //     bed: 4,
  //     bath: 4,
  //     size: 800,
  //     position: {
  //       lat: 37.39561833718522,
  //       lng: -122.21855116258479,
  //     },
  //   },
  //   {
  //     address: "98 Aleh Ave, Palo Alto, CA",
  //     name:"Mamma Mia",
  //     description: "A lovely store on busy road",
  //     price: "$ 4,225,000",
  //     type: "store-alt",
  //     bed: 2,
  //     bath: 1,
  //     size: 210,
  //     position: {
  //       lat: 37.423928529779644,
  //       lng: -122.1087629822001,
  //     },
  //   },
  //   {
  //     address: "2117 Su St, MountainView, CA",
  //     name:"Mamma Mia",
  //     description: "Single family house near golf club",
  //     price: "$ 1,700,000",
  //     type: "home",
  //     bed: 4,
  //     bath: 3,
  //     size: 200,
  //     position: {
  //       lat: 37.40578635332598,
  //       lng: -122.15043378466069,
  //     },
  //   },
  //   {
  //     address: "197 Alicia Dr, Santa Clara, CA",
  //     name:"Mamma Mia",
  //     description: "Multifloor large warehouse",
  //     price: "$ 5,000,000",
  //     type: "warehouse",
  //     bed: 5,
  //     bath: 4,
  //     size: 700,
  //     position: {
  //       lat: 37.36399747905774,
  //       lng: -122.10465384268522,
  //     },
  //   },
  //   {
  //     address: "700 Jose Ave, Sunnyvale, CA",
  //     name:"Mamma Mia",
  //     description: "3 storey townhouse with 2 car garage",
  //     price: "$ 3,850,000",
  //     type: "building",
  //     bed: 4,
  //     bath: 4,
  //     size: 600,
  //     position: {
  //       lat: 37.38343706184458,
  //       lng: -122.02340436985183,
  //     },
  //   },
  //   {
  //     address: "868 Will Ct, Cupertino, CA",
  //     name:"Mamma Mia",
  //     description: "Single family house in great school zone",
  //     price: "$ 2,500,000",
  //     type: "home",
  //     bed: 3,
  //     bath: 2,
  //     size: 100,
  //     position: {
  //       lat: 37.34576403052,
  //       lng: -122.04455090047453,
  //     },
  //   },
  //   {
  //     address: "655 Haylee St, Santa Clara, CA",
  //     name:"Mamma Mia",
  //     description: "2 storey store with large storage room",
  //     price: "$ 2,500,000",
  //     type: "store-alt",
  //     bed: 3,
  //     bath: 2,
  //     size: 450,
  //     position: {
  //       lat: 37.362863347890716,
  //       lng: -121.97802139023555,
  //     },
  //   },
  //   {
  //     address: "2019 Natasha Dr, San Jose, CA",
  //     name:"Mamma Mia",
  //     description: "Single family house",
  //     price: "$ 2,325,000",
  //     type: "home",
  //     bed: 4,
  //     bath: 3.5,
  //     size: 500,
  //     position: {
  //       lat: 37.41391636421949,
  //       lng: -121.94592071575907,
  //     },
  //   },
  // ];
  
  // window.initMap = initMap;


const mapShowSearch = document.getElementById('result-amount-map-search-wrapper')
const mapDashboardWrapper = document.getElementById('map-dashboard-main-wrapper-fade')
mapShowSearch.addEventListener('click', function(){
  mapDashboardWrapper.classList.toggle('active');
  initMap()
})

const mapDashboardFilterWrapper = document.getElementById('map-dashboard-filter-wrapper');
const mapDashboardFilterBtn = document.getElementById('map-dashboard-filter-header-btn');
const mapDashboardCardsListWrapper = document.getElementById('map-dashboard-cards-list');
mapDashboardFilterBtn.addEventListener('click', function(){
  mapDashboardFilterWrapper.classList.toggle('active')
  mapDashboardCardsListWrapper.classList.toggle('hide')
})


const closeFilterBlockbtn = document.getElementById('filters-block-submenus-header-btn');
closeFilterBlockbtn.addEventListener('click', function(){
  mapDashboardFilterWrapper.classList.toggle('active')
  mapDashboardCardsListWrapper.classList.toggle('hide')
})


const closeMapDashboardMainWrapperBtn = document.getElementById('map-dashboard-close-btn');
closeMapDashboardMainWrapperBtn.addEventListener('click', function(){
  mapDashboardWrapper.classList.toggle('active')
})


// fetch('https://travelhub.by/hotels/search-map', {
//     method: 'POST',
//     body: formData
//   })
//   .then(response => {
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     return response.json();
//   })
//   .then(result => {
//     const dataHotelsObj = result.data;

//     for (property of dataHotelsObj){

//       const position = {
//         lat: parseFloat(property.latitude),
//         lng: parseFloat(property.longitude)
//       }
//       const nameHotel = property.name;

//       // console.log(position)
//     }
//   })
//   .catch(error => {
//     // Обработка ошибок
//     console.error('There has been a problem with your fetch operation:', error);
//   });


// <div class="map-dashboard-card-item">
//                 <div class="marker-popup-header-wrapper">
//                   <div class="market-popup-header-img-wrapper">
//                   </div>
//                   <div class="marker-popup-header-info">
//                     <div class="marker-popup-header-title-wrapper">
//                       <div class="marker-popup-header-title">
//                         Mamma Mia
//                       </div>
//                       <div class="marker-popup-header-title-stars-list">
//                         <img src="./images/star-marker.svg" alt="star" class="marker-popup-header-title-star-item">
//                         <img src="./images/star-marker.svg" alt="star" class="marker-popup-header-title-star-item">
//                       </div>
//                     </div>
//                     <div class="marker-popup-header-description-wrapper">
//                       <div class="marker-popup-header-description-rate">
//                         3
//                       </div>
//                       <div class="marker-popup-header-description">
//                         Рейтинг гостей
//                       </div>
//                     </div>
//                   </div>
//                   <a href="#" class="marker-popup-header-btn">
//                     <img src="./images/arrow-right-btn.svg" alt="">
//                   </a>
//                 </div>
//                 <div class="marker-popup-footer-info">
//                   <div class="marker-popup-footer-description-wrapper">
//                     <div class="marker-popup-footer-description">
//                       <div class="marker-popup-footer-description-main">
//                         Всего (нетто цена):
//                       </div>
//                       <div class="marker-popup-footer-description-price">
//                         200$
//                       </div>
//                     </div>
//                     <div class="marker-popup-footer-description">
//                       <div class="marker-popup-footer-description-main">
//                         Всего (включая налоги и сборы):
//                       </div>
//                       <div class="marker-popup-footer-description-price">
//                         200$
//                       </div>
//                     </div>
//                   </div>
//                   <div class="marker-popup-footer-price-wrapper">
//                     <div class="marker-popup-footer-price-alert">
//                       200$
//                     </div>
//                     <div class="marker-popup-footer-price">
//                       за ночь 200$
//                     </div>
                    
//                   </div>
//                 </div>
//               </div>
//               <div class="map-dashboard-card-item">
//                 <div class="marker-popup-header-wrapper">
//                   <div class="market-popup-header-img-wrapper">
//                   </div>
//                   <div class="marker-popup-header-info">
//                     <div class="marker-popup-header-title-wrapper">
//                       <div class="marker-popup-header-title">
//                         ibis budget Nice Aeroport Promenade des Anglais
//                       </div>
//                       <div class="marker-popup-header-title-stars-list">
//                         <img src="./images/star-marker.svg" alt="star" class="marker-popup-header-title-star-item">
//                         <img src="./images/star-marker.svg" alt="star" class="marker-popup-header-title-star-item">
//                       </div>
//                     </div>
//                     <div class="marker-popup-header-description-wrapper">
//                       <div class="marker-popup-header-description-rate">
//                         3
//                       </div>
//                       <div class="marker-popup-header-description">
//                         Рейтинг гостей
//                       </div>
//                     </div>
//                   </div>
//                   <a href="#" class="marker-popup-header-btn">
//                     <img src="./images/arrow-right-btn.svg" alt="">
//                   </a>
//                 </div>
//                 <div class="marker-popup-footer-info">
//                   <div class="marker-popup-footer-description-wrapper">
//                     <div class="marker-popup-footer-description">
//                       <div class="marker-popup-footer-description-main">
//                         Всего (нетто цена):
//                       </div>
//                       <div class="marker-popup-footer-description-price">
//                         200$
//                       </div>
//                     </div>
//                     <div class="marker-popup-footer-description">
//                       <div class="marker-popup-footer-description-main">
//                         Всего (включая налоги и сборы):
//                       </div>
//                       <div class="marker-popup-footer-description-price">
//                         200$
//                       </div>
//                     </div>
//                   </div>
//                   <div class="marker-popup-footer-price-wrapper">
//                     <div class="marker-popup-footer-price-alert">
                      
//                     </div>
//                     <div class="marker-popup-footer-price">
//                       за ночь 200$
//                     </div>
                    
//                   </div>
//                 </div>
//               </div>
//               <div class="map-dashboard-card-item">
//                 <div class="marker-popup-header-wrapper">
//                   <div class="market-popup-header-img-wrapper">
//                   </div>
//                   <div class="marker-popup-header-info">
//                     <div class="marker-popup-header-title-wrapper">
//                       <div class="marker-popup-header-title">
//                         Mamma Mia
//                       </div>
//                       <div class="marker-popup-header-title-stars-list">
//                         <img src="./images/star-marker.svg" alt="star" class="marker-popup-header-title-star-item">
//                         <img src="./images/star-marker.svg" alt="star" class="marker-popup-header-title-star-item">
//                       </div>
//                     </div>
//                     <div class="marker-popup-header-description-wrapper">
//                       <div class="marker-popup-header-description-rate">
//                         3
//                       </div>
//                       <div class="marker-popup-header-description">
//                         Рейтинг гостей
//                       </div>
//                     </div>
//                     <div class="marker-popup-header-description-alert">
//                       Остался 1 номер по этой цене
//                     </div>
//                   </div>
//                   <a href="#" class="marker-popup-header-btn">
//                     <img src="./images/arrow-right-btn.svg" alt="">
//                   </a>
//                 </div>
//                 <div class="marker-popup-footer-info">
//                   <div class="marker-popup-footer-description-wrapper">
//                     <div class="marker-popup-footer-description">
//                       <div class="marker-popup-footer-description-main">
//                         Всего (нетто цена):
//                       </div>
//                       <div class="marker-popup-footer-description-price">
//                         200$
//                       </div>
//                     </div>
//                     <div class="marker-popup-footer-description">
//                       <div class="marker-popup-footer-description-main">
//                         Всего (включая налоги и сборы):
//                       </div>
//                       <div class="marker-popup-footer-description-price">
//                         200$
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div class="marker-popup-footer-price-wrapper">
//                     <div class="marker-popup-footer-price-alert">
//                       200$
//                     </div>
//                     <div class="marker-popup-footer-price">
//                       за ночь 200$
//                     </div>
                    
//                   </div>
//                 </div>
//               </div> --></div>