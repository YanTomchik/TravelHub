const loaderDiv = document.getElementById('loader-seatmap');
const app = document.getElementById('app-seatmap');

function initSeatMap(dataService, dataFlightId, dataOrderId, dataOrderServiceId){
    const flightId = dataFlightId;
    const service = dataService;
    const orderId = dataOrderId;
    const serviceOrderId = dataOrderServiceId;
    const bearerToken = 'AmaOk_eyJpZCI6MTYsImVtYWlsIjoibWFuYWdlcnNAaW5maW5pdHkuYnkifQ';

    fetch(`https://api.travelhub.by/flight/seatmap?flightId=${flightId}&service=${service}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
        
      const seatMap = data.result[0];
      const hashSeatMap = data.hash;
      const selectedSeats = {};
      let travelers = [];

      const displaySeats = (seatList) => {
        return seatList.map(seat => {
          const color = seat.travelerPricing[1].seatAvailabilityStatus === 'AVAILABLE' ? "#3968BF" : "#d9d9d9";
          const classType = seat.travelerPricing[1].seatAvailabilityStatus === 'AVAILABLE' ? "available" : "blocked";
          const style = `left: ${seat.coordinates.y * 4 + 2.5}em; top: ${seat.coordinates.x * 4 + 2.5}em; background-color: ${color}; color: white;`;
          return `<div class="seat ${classType}" style="${style}" data-seat-number="${seat.number}" data-seat-id="${seat.coordinates.x}-${seat.coordinates.y}" data-price="${seat.travelerPricing[0].price.total}" data-currency="${seat.travelerPricing[0].price.currency}">${seat.number}</div>`;
        }).join('');
      };

      const displayFacilities = (facilityList) => {
        return facilityList.map(facility => {
          const style = `left: ${(facility.coordinates.y * 4)+2.5}em; top: ${(facility.coordinates.x * 4)+2.5}em`;
          return `<div class="facility" style="${style}">${facility.code}</div>`;
        }).join('');
      };

      const displayExits = (exitRows) => {
        if (exitRows && exitRows.length > 0) {
          return exitRows.map(row => {
            const styleLeft = `left: -4.1em; top: ${row * 2}em;`;
            const styleRight = `left: 13.5em; top: ${row * 2}em;`;
            return `<div class="exit"><span style="${styleLeft}">EXIT</span><span style="${styleRight}">EXIT</span></div>`;
          }).join('');
        }
        return '';
      };

      const createTopPlane = (deck) => {
          const width = deck.deckConfiguration.width;
          const length = deck.deckConfiguration.length;

          const orientation = `width: ${(width * 3.8) + 5}em; height: ${length * 0.8}em;`;

          return `<div class="top-plane-wrapper" id="top-plane" style="${orientation}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 376.21 428.13" ${orientation}><path d="M371.97 422.07c-7.68-178.61-82.85-292.68-123.38-354.18-2.75-4.17-5.32-8.07-7.68-11.71-35.2-54.22-52.22-52.16-52.39-52.14l-.41-.02-.41.01c-.11-.01-17.13-2.07-52.33 52.15-2.37 3.64-4.94 7.55-7.68 11.71C87.15 129.39 11.98 243.46 4.3 422.07c-.05 1.13-.16 6.07-.17 6.09l368.15-.03c.01 0-.26-4.92-.31-6.06z" fill="#fff"></path><path d="M2.13 427.16l-1-1.04C7.84 244.3 84.98 127.23 125.17 66.24c2.74-4.16 5.31-8.06 7.67-11.7C168.23.03 186.01.74 188.13 1.06c1.4-.2 9.41-.53 24.6 14.26 8.1 7.89 18.31 20.16 30.68 39.22 2.36 3.64 4.93 7.54 7.67 11.7 40.2 60.99 117.33 178.05 124.04 359.89l-1 1.04" clip-rule="evenodd" fill="none"></path><path d="M178.22 113.54c2.93-.23 5.46 2.05 5.46 4.99v22.8c0 4.45-2.44 8.52-6.38 10.58-10.92 5.72-34.01 18.78-54.57 36.75V149.3c0-3.94 1.76-7.67 4.77-10.22 14.52-12.31 31.56-24.04 50.72-25.54zm14.22 4.99c0-2.94 2.53-5.22 5.46-4.99 19.16 1.49 36.21 13.23 50.73 25.53 3.01 2.55 4.77 6.28 4.77 10.22v39.36c-20.56-17.97-43.65-31.03-54.57-36.75-3.94-2.06-6.38-6.13-6.38-10.58v-22.79zm71.71 35.77s14.15 16.71 25.59 35c3.03 5.01 5.6 9.62 7.69 13.55 3.92 7.84 6.56 15.27 6.56 21.09 0 0-12.09 8.97-21.49-3.34-.01-.02-8.11-11.07-12.88-16.25-3.49-3.79-5.47-8.72-5.47-13.87V154.3zm-152.18 0v36.17c0 5.15-1.98 10.09-5.47 13.87-4.77 5.18-12.86 16.23-12.88 16.25-9.4 12.32-21.49 3.34-21.49 3.34 0-5.82 2.64-13.25 6.56-21.09 2.09-3.94 4.66-8.55 7.69-13.55 11.44-18.28 25.59-34.99 25.59-34.99z" fill-rule="evenodd" clip-rule="evenodd" fill="#d2d6d9"></path><path d="M376.08 424.88v-.14h-.01c-3.04-78.17-19.69-153.63-49.49-224.28-25.19-59.7-54.95-104.87-74.65-134.76-2.74-4.16-5.31-8.05-7.67-11.69-32.99-50.83-50.86-54.16-55.5-54h-1.26c-4.66-.15-22.52 3.2-55.49 54-2.36 3.64-4.93 7.53-7.67 11.69-19.7 29.89-49.47 75.06-74.65 134.76C19.79 271.35 3.13 347.06.16 425.5H.14v2.64h1.68c.1.02.2.03.31.03h2c0-.03.12-4.96.17-6.09C11.98 243.47 87.15 129.4 127.68 67.9c2.74-4.17 5.32-8.07 7.68-11.71 35.2-54.22 52.22-52.16 52.33-52.15l.41-.01.41.02c.17-.02 17.2-2.08 52.39 52.14 2.37 3.65 4.94 7.55 7.68 11.71 40.53 61.5 115.7 175.56 123.38 354.18.05 1.14.32 6.06.32 6.06l1.85.03c.11 0 .21-.02.31-.03h1.64c0-.01.02-2.86 0-3.26z" fill="#d2d6d9"></path></svg></div>`;
          

      };

      const displayWings = (start, end) => {
        const wings = [];
        ['left', 'right'].forEach(orientation => {
            const wingDiv = document.createElement('div');
            wingDiv.className = 'wing';
            wingDiv.style.left = orientation === 'left' ? "51em" : "12em";
            wingDiv.style.top = `${start*4}em`;
            wingDiv.style.height = `${(end - start)*4}em`;
            wingDiv.style.position = `relative`;
            // wingDiv.style.width = `250px`;
            wingDiv.innerHTML = orientation === 'left' ? `<img src="./images/seat-map-wing-desktop-left.svg" alt="" class='left-wing'>` : `<img src="./images/seat-map-wing-desktop-right.svg" alt="">`;
            wings.push(wingDiv);
        });
        return wings;
    };

      const renderDeck = (deck) => {
        const width = deck.deckConfiguration.width * 4.8;
        const length = deck.deckConfiguration.length * 4.5;
        const seatList = deck.seats;
        const facilities = deck.facilities;
        const exitRows = deck.deckConfiguration.exitRowsX;
        const wingStart = deck.deckConfiguration.startWingsX;
        const wingEnd = deck.deckConfiguration.endWingsX;

        return `
          <div id="deck" style="width: ${width}em; height: ${length}em;" class='deck-wrapper'>
            
            <!-- ${displayWings(wingStart, wingEnd)} -->
            ${displaySeats(seatList)}
            ${displayFacilities(facilities)}
            ${displayExits(exitRows)}
          </div>
        `;
      };

      seatMap.decks.forEach(deck => {
        const wingStart = deck.deckConfiguration.startWingsX;
        const wingEnd = deck.deckConfiguration.endWingsX;

          const topPlaneElem = createTopPlane(deck);
          const wings = displayWings(wingStart, wingEnd);
          const wingsWrapper = document.createElement('div');
          wingsWrapper.classList.add('wings-wrapper');
          
          wings.forEach(wing => wingsWrapper.appendChild(wing));

          app.appendChild(wingsWrapper)
          app.innerHTML += createTopPlane(deck);
          app.innerHTML += renderDeck(deck);
          // app.prependChild(topPlaneElem)
        
      });

      app.addEventListener('click', (e) => {
        if (e.target.classList.contains('seat')) {
          const seatNumber = e.target.dataset.seatNumber;
          const seatId = e.target.dataset.seatId;
          const seatPrice = e.target.dataset.price;
          const seatCurrency = e.target.dataset.currency;

          if (!selectedSeats[seatId]) {
            selectedSeats[seatId] = { seatNumber, seatPrice, seatCurrency };
            e.target.classList.add('active');
          } else {
            delete selectedSeats[seatId];
            e.target.classList.remove('active');
          }

          updateTravelers(selectedSeats);
        }
      });

      const updateTravelers = (selectedSeats) => {
        travelers = Object.entries(selectedSeats).map(([seatId, seatData], index) => ({
          id: `T${index + 1}`,
          segments: [
            {
              id: "S1",
              seatNumber: seatData.seatNumber,
              price: seatData.seatPrice,
              currency: seatData.seatCurrency
            }
          ]
        }
        
    ));
        
        console.log({
          orderId: orderId,
          orderServiceId: serviceOrderId,
          service: service,
          flightId: flightId,
          hash: hashSeatMap,
          flightOfferId: seatMap.flightOfferId,
          travelers: travelers
        });
        let jsonDataSeatMap = JSON.stringify(selectedSeats);
        document.getElementById('jsonDataSeatMap').value = jsonDataSeatMap;
      };
      loaderDiv.style.display = 'none';
    })
    .catch(error => {
      console.error('Error fetching seat map:', error);
    });
    
}

const bodyTag = document.body;
const chooseSeatMapBtns = document.querySelectorAll('.open-seatmap');
const modalSeatmap = document.getElementById('modal-seatmap');
chooseSeatMapBtns.forEach(btn => {
    btn.addEventListener('click', (elem) => {
        const dataService = elem.target.dataset.service;
        const dataFlightId = elem.target.dataset.flightid;
        const dataOrderId = elem.target.dataset.orderid;
        const dataOrderServiceId = elem.target.dataset.orderserviceid;
        modalSeatmap.classList.toggle('active');
        bodyTag.style.overflow = 'hidden';
        loaderDiv.style.display = 'block';

        initSeatMap(dataService, dataFlightId, dataOrderId, dataOrderServiceId)
    });
});




const closeSeatMap = document.getElementById('seatmap-close-btn');
closeSeatMap.addEventListener('click', function () {
    modalSeatmap.classList.toggle('active');
    bodyTag.style.overflow = 'scroll';
    app.innerHTML = ''
})

const submitSeatmapDataBtn = document.getElementById('submit-seatmap-data-btn');
submitSeatmapDataBtn.addEventListener('click', function () {
    modalSeatmap.classList.toggle('active');
    bodyTag.style.overflow = 'scroll';
    app.innerHTML = '';
    document.getElementById('hidden-form-seat-map').submit();
})
