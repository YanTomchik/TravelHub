const loaderDiv = document.getElementById('loader-seatmap');
const rightContainer = document.getElementById('right-seatmap-container');
const passengersListWrapper = document.getElementById('passengers-list-wrapper');
const flightDescriptionWrapper = document.getElementById('flight-description-wrapper')
const btnsActionWrapper = document.getElementById('btns-action-wrapper')
const app = document.getElementById('app-seatmap');
let currentFlightIndex = 0;
let selectedSeats = {};
let flightsData;
let hashSeatMap;
let flightOfferId;
let numTravelers;
let numFlights;
let departureName;
let arrivalName;

let dataService;
let dataFlightId;
let dataOrderId;
let dataOrderServiceId;
const grossMultiplier = 1.2;
const bearerToken = 'AmaOk_eyJpZCI6MTYsImVtYWlsIjoibWFuYWdlcnNAaW5maW5pdHkuYnkifQ';

let currentTraveler = 1; // Initialize the current traveler

function initSeatMap(dataService, dataFlightId, dataOrderId, dataOrderServiceId) {
    const flightId = dataFlightId;
    const service = dataService;
    const orderId = dataOrderId;
    const serviceOrderId = dataOrderServiceId;

    // Store the variables once in initSeatMap
    this.dataService = dataService;
    this.dataFlightId = dataFlightId;
    this.dataOrderId = dataOrderId;
    this.dataOrderServiceId = dataOrderServiceId;
    currentTraveler = 1;
    console.log(`https://api.travelhub.by/flight/seatmap?flightId=${flightId}&service=${service}&orderServiceId=${dataOrderServiceId}&orderId=${dataOrderId}&test=true&cabin=business`)
    // fetch(`http://api.travelhub.local:8085/flight/seatmap?flightId=${flightId}&service=${service}`, {
    // fetch(`https://api.travelhub.by/flight/seatmap?flightId=${flightId}&service=${service}`, {
    // fetch(`https://api.travelhub.by/flight/seatmap?flightId=${flightId}&service=${service}&orderServiceId=${dataOrderServiceId}&orderId=${dataOrderId}&test=true&cabin=business`, {
    fetch(`https://api.travelhub.by/flight/seatmap?flightId=${flightId}&service=${service}&orderServiceId=${dataOrderServiceId}&orderId=${dataOrderId}&test=true&cabin=economy`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            selectedSeats = {};
            currentFlightIndex = 0;
            flightsData = data;
            hashSeatMap = data.hash;
            flightOfferId = data.result[currentFlightIndex].flightOfferId;
            numTravelers = flightsData.result[currentFlightIndex].availableSeatsCounters.length;
            numFlights = flightsData.result.length;
            renderFlight();

            loaderDiv.style.display = 'none';
        })
        .catch(error => {
            console.error('Error fetching seat map:', error);
        });
}

function displayHeaderFlightInfo(arrivalName, departureName) {

    return `<div class="icon-flight">
                                                    <svg viewBox="0 0 19 13" xmlns="http://www.w3.org/2000/svg" height="20" width="20"><path d="M17.737 1.076c-1.21-.656-2.586-.308-3.526.1l-2.804 1.217L6.585.136 3.714.251l3.981 3.757-2.537 1.121-2.64-.935-1.768.767 1.597 1.846c-.168.188-.321.451-.182.728.18.362.717.545 1.596.545.18 0 .375-.008.584-.023.965-.071 2.012-.3 2.666-.584l10.022-4.35c.865-.375 1.296-.77 1.318-1.205.01-.226-.087-.556-.614-.842zM.75 11.533h17.602v.662H.75z"></path></svg>
                                                </div>
                                                <div class="flight-description-from">
                                                ${departureName}
                                                </div> 
                                                to
                                                <div class="flight-description-to">
                                                    ${arrivalName}
                                                </div>`;
}

function renderFlight() {
    const flight = flightsData.result[currentFlightIndex];
    const travelerIds = Array.from({ length: numTravelers }, (_, i) => `${i + 1}`);

    arrivalName = flightsData.result[currentFlightIndex].arrival.iataCode;
    departureName = flightsData.result[currentFlightIndex].departure.iataCode;

    let headerFlightsInfo = displayHeaderFlightInfo(arrivalName, departureName)
    flightDescriptionWrapper.innerHTML = headerFlightsInfo;

    app.innerHTML = '';
    passengersListWrapper.innerHTML = '';
    btnsActionWrapper.innerHTML = '';

    flight.decks.forEach(deck => {
        const wingStart = deck.deckConfiguration.startWingsX;
        const wingEnd = deck.deckConfiguration.endWingsX;

        const topPlaneElem = createTopPlane(deck);
        const topPlaneWrapper = document.createElement('div');
        topPlaneWrapper.innerHTML = topPlaneElem;
        app.appendChild(topPlaneWrapper);

        // const seatPopupElem = createSeatPopup()
        // app.appendChild(seatPopupElem);

        const wings = displayWings(wingStart, wingEnd);
        const wingsWrapper = document.createElement('div');
        wingsWrapper.classList.add('wings-wrapper');
        wings.forEach(wing => wingsWrapper.appendChild(wing));
        app.appendChild(wingsWrapper);

        const deckElement = document.createElement('div');
        deckElement.innerHTML = renderDeck(deck, travelerIds);


        app.appendChild(deckElement);

    });

    // Display textual information for each traveler
    const selectedSeatsForCurrentFlight = selectedSeats;
    const infoDiv = document.createElement('div');
    infoDiv.classList.add('seat-info');

    for (let i = 0; i < numTravelers; i++) {
        const travelerId = travelerIds[i];
        const selectedSeat = selectedSeatsForCurrentFlight[travelerId] ? selectedSeatsForCurrentFlight[travelerId][currentFlightIndex] : null;

        if (selectedSeat) {
            infoDiv.innerHTML += `
            <!--Traveler ${travelerId}, seat ${selectedSeat.seat}, total ${roundValue(selectedSeat.totalGross, seatCurrency)} ${selectedSeat.currency}<br>-->
            <div class="passenger-item-wrapper active">
                                                            <div class="passenger-info-wrapper">
                                                                <div class="passenger-icon">
                                                                    T${travelerId}
                                                                </div>
                                                                <div class="passenger-description-wrapper">
                                                                    <div class="name">
                                                                        Traveler ${travelerId}
                                                                    </div>
                                                                    <div class="extra-info">
                                                                        total ${roundValue(selectedSeat.totalGross, seatCurrency)} ${selectedSeat.currency}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="passenger-item-checkbox-wrapper green">
                                                                <div class = "number">
                                                                    ${selectedSeat.seat}
                                                                </div>
                                                            
                                                            </div>
            
                                                        </div>
            `;
        } else {
            infoDiv.innerHTML += `
            <!--Traveler ${travelerId}, seat not selected<br>-->
            <div class="passenger-item-wrapper">
                                                <div class="passenger-info-wrapper">
                                                    <div class="passenger-icon">
                                                        T${travelerId}
                                                    </div>
                                                    <div class="passenger-description-wrapper">
                                                        <div class="name">
                                                            Traveler ${travelerId}
                                                        </div>
                                                        <div class="extra-info">
                                                            seat not selected
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="passenger-item-checkbox-wrapper">

                                                </div>

                                            </div>
            `;
        }
    }

    passengersListWrapper.appendChild(infoDiv);

    // Add a "Previous Flight" button
    const previousFlightBtn = document.createElement('button');
    previousFlightBtn.id = 'previous-flight-btn';
    previousFlightBtn.textContent = 'Previous Flight';
    previousFlightBtn.disabled = currentFlightIndex === 0;
    previousFlightBtn.classList.add('btn', 'btn-primary', 'font-weight-bolder', 'mb-5', 'submit-seatmap-data-btn');

    // Show the button only if it's not the first flight
    if (currentFlightIndex > 0) {
        btnsActionWrapper.appendChild(previousFlightBtn);
    }

    previousFlightBtn.addEventListener('click', () => {
        if (currentFlightIndex > 0) {
            currentFlightIndex--;
            numTravelers = flightsData.result[currentFlightIndex].availableSeatsCounters.length;
            currentTraveler = 1;
            renderFlight();
        }
    });

    // Add a "Next Flight" button
    const nextFlightBtn = document.createElement('button');
    nextFlightBtn.id = 'next-flight-btn';
    nextFlightBtn.textContent = currentFlightIndex < flightsData.result.length - 1 ? 'Next Flight' : 'Submit Data';
    nextFlightBtn.disabled = true;
    // Add the classes
    nextFlightBtn.classList.add('btn', 'btn-primary', 'font-weight-bolder', 'mb-5', 'submit-seatmap-data-btn', 'submit');
    btnsActionWrapper.appendChild(nextFlightBtn);

    nextFlightBtn.addEventListener('click', () => {
        if (currentFlightIndex < flightsData.result.length - 1) {
            currentFlightIndex++;
            currentTraveler = 1;
            numTravelers = flightsData.result[currentFlightIndex].availableSeatsCounters.length;
            renderFlight();

        } else {
            submitData();
        }
    });

    // Restore selected seats
    for (const travelerId in selectedSeats) {
        if (selectedSeats.hasOwnProperty(travelerId)) {
            const selectedSeat = selectedSeats[travelerId][currentFlightIndex];
            if (selectedSeat) {
                const seatElement = document.querySelector(`.seat[data-seat-number="${selectedSeat.seat}"][data-flight-index="${currentFlightIndex}"]`);
                if (seatElement) {
                    seatElement.classList.add('active');
                }
            }
        }
    }

    // Update the "Next Flight" button (corrected logic)
    const expectedSelections = numTravelers;
    const selectedSeatsForCurrentFlightA = Object.values(selectedSeats).reduce((acc, travelerSeats) => acc + (travelerSeats[currentFlightIndex] ? 1 : 0), 0);
    document.getElementById('next-flight-btn').disabled = selectedSeatsForCurrentFlightA !== expectedSelections;

    // Update the "Previous Flight" button
    if (document.getElementById('previous-flight-btn')) {
        document.getElementById('previous-flight-btn').disabled = currentFlightIndex === 0;
    }

    // Update button text if it's the last flight
    document.getElementById('next-flight-btn').textContent = currentFlightIndex < flightsData.result.length - 1 ? 'Next Flight' : 'Submit Data';

}

function renderDeck(deck, travelerIds) {
    const width = deck.deckConfiguration.width * 4.8;
    const length = deck.deckConfiguration.length * 4.5;
    const seatList = deck.seats;
    const facilities = deck.facilities;
    const exitRows = deck.deckConfiguration.exitRowsX;
    const wingStart = deck.deckConfiguration.startWingsX;
    const wingEnd = deck.deckConfiguration.endWingsX;

    return `
        <div id="deck" style="width: ${width}em; height: ${length}em;" class='deck-wrapper'>
            ${displaySeats(seatList, travelerIds)}
            ${displayFacilities(facilities)}
            ${displayExits(exitRows)}
        </div>
    `;
}

function displaySeats(seatList, travelerIds) {
    return seatList.map((seat, seatIndex) => {
        const color = seat.travelerPricing.some(pricing => pricing.seatAvailabilityStatus === 'AVAILABLE') ? "#3968BF" : "#d9d9d9";
        const classType = seat.travelerPricing.some(pricing => pricing.seatAvailabilityStatus === 'AVAILABLE') ? "available" : "blocked";
        const style = `left: ${seat.coordinates.y * 4 + 2}em; top: ${seat.coordinates.x * 4 + 2.5}em; background-color: ${color}; color: white;`;

        return `<div class="seat ${classType}" style="${style}" data-seat-number="${seat.number}" data-seat-id="${seat.coordinates.x}-${seat.coordinates.y}" data-flight-index="${currentFlightIndex}" data-total="${seat.travelerPricing[0].price.total}" data-currency="${seat.travelerPricing[0].price.currency}"> ${seat.number} 
        <div class="seat-popup"><div class="seat-popup-number">${seat.number}</div><div class="seat-popup-price">${roundValue(seat.travelerPricing[0].price.total * grossMultiplier, seat.travelerPricing[0].price.currency)} ${seat.travelerPricing[0].price.currency}</div></div>
        </div>`;
    }).join('');
}

function createTopPlane(deck) {
    const width = deck.deckConfiguration.width;
    const length = deck.deckConfiguration.length;

    const orientation = `width: ${(width * 3.8) + 5}em;`;

    return `<div class="top-plane-wrapper" id="top-plane" style="${orientation}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 376.21 428.13" ${orientation}><path d="M371.97 422.07c-7.68-178.61-82.85-292.68-123.38-354.18-2.75-4.17-5.32-8.07-7.68-11.71-35.2-54.22-52.22-52.16-52.39-52.14l-.41-.02-.41.01c-.11-.01-17.13-2.07-52.33 52.15-2.37 3.64-4.94 7.55-7.68 11.71C87.15 129.39 11.98 243.46 4.3 422.07c-.05 1.13-.16 6.07-.17 6.09l368.15-.03c.01 0-.26-4.92-.31-6.06z" fill="#fff"></path><path d="M2.13 427.16l-1-1.04C7.84 244.3 84.98 127.23 125.17 66.24c2.74-4.16 5.31-8.06 7.67-11.7C168.23.03 186.01.74 188.13 1.06c1.4-.2 9.41-.53 24.6 14.26 8.1 7.89 18.31 20.16 30.68 39.22 2.36 3.64 4.93 7.54 7.67 11.7 40.2 60.99 117.33 178.05 124.04 359.89l-1 1.04" clip-rule="evenodd" fill="none"></path><path d="M178.22 113.54c2.93-.23 5.46 2.05 5.46 4.99v22.8c0 4.45-2.44 8.52-6.38 10.58-10.92 5.72-34.01 18.78-54.57 36.75V149.3c0-3.94 1.76-7.67 4.77-10.22 14.52-12.31 31.56-24.04 50.72-25.54zm14.22 4.99c0-2.94 2.53-5.22 5.46-4.99 19.16 1.49 36.21 13.23 50.73 25.53 3.01 2.55 4.77 6.28 4.77 10.22v39.36c-20.56-17.97-43.65-31.03-54.57-36.75-3.94-2.06-6.38-6.13-6.38-10.58v-22.79zm71.71 35.77s14.15 16.71 25.59 35c3.03 5.01 5.6 9.62 7.69 13.55 3.92 7.84 6.56 15.27 6.56 21.09 0 0-12.09 8.97-21.49-3.34-.01-.02-8.11-11.07-12.88-16.25-3.49-3.79-5.47-8.72-5.47-13.87V154.3zm-152.18 0v36.17c0 5.15-1.98 10.09-5.47 13.87-4.77 5.18-12.86 16.23-12.88 16.25-9.4 12.32-21.49 3.34-21.49 3.34 0-5.82 2.64-13.25 6.56-21.09 2.09-3.94 4.66-8.55 7.69-13.55 11.44-18.28 25.59-34.99 25.59-34.99z" fill-rule="evenodd" clip-rule="evenodd" fill="#d2d6d9"></path><path d="M376.08 424.88v-.14h-.01c-3.04-78.17-19.69-153.63-49.49-224.28-25.19-59.7-54.95-104.87-74.65-134.76-2.74-4.16-5.31-8.05-7.67-11.69-32.99-50.83-50.86-54.16-55.5-54h-1.26c-4.66-.15-22.52 3.2-55.49 54-2.36 3.64-4.93 7.53-7.67 11.69-19.7 29.89-49.47 75.06-74.65 134.76C19.79 271.35 3.13 347.06.16 425.5H.14v2.64h1.68c.1.02.2.03.31.03h2c0-.03.12-4.96.17-6.09C11.98 243.47 87.15 129.4 127.68 67.9c2.74-4.17 5.32-8.07 7.68-11.71 35.2-54.22 52.22-52.16 52.33-52.15l.41-.01.41.02c.17-.02 17.2-2.08 52.39 52.14 2.37 3.65 4.94 7.55 7.68 11.71 40.53 61.5 115.7 175.56 123.38 354.18.05 1.14.32 6.06.32 6.06l1.85.03c.11 0 .21-.02.31-.03h1.64c0-.01.02-2.86 0-3.26z" fill="#d2d6d9"></path></svg></div>`;
}

function displayWings(start, end) {
    const wings = [];
    ['left', 'right'].forEach(orientation => {
        const wingDiv = document.createElement('div');
        wingDiv.className = 'wing';
        wingDiv.style.left = orientation === 'left' ? "51em" : "12em";
        wingDiv.style.top = `${start * 6}em`;
        // wingDiv.style.height = `${(end - start) * 4}em`;
        wingDiv.style.position = `relative`;
        wingDiv.innerHTML = orientation === 'left' ? `<img src="./images/seat-map-wing-desktop-left.svg" alt="" class='left-wing'>` : `<img src="./images/seat-map-wing-desktop-right.svg" alt="">`;
        // wingDiv.innerHTML = orientation === 'left' ? `<img src="/images/seatmap/seat-map-wing-desktop-left.svg" alt="" class='left-wing'>` : `<img src="/images/seatmap/seat-map-wing-desktop-right.svg" alt="">`;
        wings.push(wingDiv);
    });
    return wings;
}

function displayFacilities(facilityList) {
    return facilityList.map(facility => {
        const style = `left: ${(facility.coordinates.y * 4) + 2}em; top: ${(facility.coordinates.x * 4) + 2.5}em`;
        return `<div class="facility" style="${style}">${facility.code}</div>`;
    }).join('');
}

function displayExits(exitRows) {
    if (exitRows && exitRows.length > 0) {
        return exitRows.map(row => {
            const styleLeft = `left: -4.1em; top: ${row * 2}em;`;
            const styleRight = `left: 13.5em; top: ${row * 2}em;`;
            return `<div class="exit"><span style="${styleLeft}">EXIT</span><span style="${styleRight}">EXIT</span></div>`;
        }).join('');
    }
    return '';
}

function roundValue(value, currency) {
    switch (currency) {
        case 'KZT':
            return Math.ceil(value);
        default:
            return Math.round(value * 100) / 100;
    }
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

// const submitSeatmapDataBtn = document.getElementById('submit-seatmap-data-btn');
// submitSeatmapDataBtn.addEventListener('click', async function () {
//     submitData();
// });

async function submitData() {
    const travelers = Object.entries(selectedSeats).map(([travelerId, flightSeats]) => ({
        id: travelerId,
        segments: Object.entries(flightSeats).map(([flightIndex, seatData]) => ({
            id: `${parseInt(flightIndex) + 1}`,
            seatNumber: seatData.seat,
            total: seatData.total,
            currency: seatData.currency
        }))
    }));

    const dataToSend = {
        orderId: this.dataOrderId,
        orderServiceId: this.dataOrderServiceId,
        service: this.dataService,
        flightId: this.dataFlightId,
        hash: hashSeatMap,
        flightOfferId: flightOfferId,
        travelers: travelers
    };

    showButtonLoader();

    try {
        const response = await fetch('https://api.travelhub.by/flight/seat-update', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${bearerToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        });

        if (response.ok) {
            location.reload();
        } else {
            const errorData = await response.json();
            console.log('Error submitting seat data:', errorData);
        }
    } catch (error) {
        console.error('Error submitting seat data:', error);
    } finally {
        hideButtonLoader(button);
    }
}

app.addEventListener('click', (e) => {
    if (e.target.classList.contains('seat') && !e.target.classList.contains('blocked')) {
        const seatNumber = e.target.dataset.seatNumber;
        const seatId = e.target.dataset.seatId;
        const flightIndex = parseInt(e.target.dataset.flightIndex);
        const seatPrice = parseFloat(e.target.dataset.total);
        const seatCurrency = e.target.dataset.currency;
        const action = e.target.classList.contains('active') ? 'delete' : 'add';

        let travelerId = e.target.dataset.travelerId ?? currentTraveler;

        let numSelectedSeats = 0;
        Object.values(selectedSeats).forEach(travelerSeats => {
            numSelectedSeats = numSelectedSeats + Object.keys(travelerSeats).length;
        })

        const allSeatsSelected = Object.keys(selectedSeats).length === numTravelers && numSelectedSeats === numTravelers * numFlights;

        if (!allSeatsSelected || selectedSeats[travelerId] && selectedSeats[travelerId][flightIndex] && selectedSeats[travelerId][flightIndex].seat === seatNumber) {
            if (action === 'add' && !selectedSeats[travelerId]) {
                selectedSeats[travelerId] = {};
            }

            if (action === 'add' && !selectedSeats[travelerId][flightIndex]) {
                selectedSeats[travelerId][flightIndex] = {
                    seat: seatNumber,
                    total: seatPrice,
                    totalGross: roundValue(seatPrice * grossMultiplier, seatCurrency),
                    currency: seatCurrency
                };
                e.target.classList.add('active');
                e.target.setAttribute('data-traveler-id', travelerId);
                if ((currentTraveler + 1) <= numTravelers) {
                    currentTraveler++;
                }
            } else if (action === 'delete' && selectedSeats[travelerId] && selectedSeats[travelerId][flightIndex] && selectedSeats[travelerId][flightIndex].seat === seatNumber) {
                delete selectedSeats[travelerId][flightIndex];
                e.target.classList.remove('active');
                travelerId = e.target.dataset.travelerId;
                e.target.removeAttribute('data-traveler-id');
                if (Object.keys(selectedSeats[travelerId]).length === 0) {
                    delete selectedSeats[travelerId];
                }
                // Count selected seats for the current flight
                let currentFlightSeats = 0;
                for (const traveler in selectedSeats) {
                    if (selectedSeats[traveler][flightIndex]) {
                        currentFlightSeats++;
                    }
                }

                // Update currentTraveler based on the count
                if (currentFlightSeats === 0) {
                    currentTraveler = 1;
                } else {
                    currentTraveler = travelerId;
                }
            }
            // Update the textual information after each seat selection
            const infoDiv = document.querySelector('.seat-info');
            if (infoDiv) {
                infoDiv.innerHTML = '';
                const flight = flightsData.result[currentFlightIndex];
                const travelerIds = Array.from({ length: numTravelers }, (_, i) => `${i + 1}`);

                for (let i = 0; i < numTravelers; i++) {
                    const travelerId = travelerIds[i];
                    const selectedSeat = selectedSeats[travelerId] ? selectedSeats[travelerId][currentFlightIndex] : null;

                    // if (selectedSeat) {
                    //     infoDiv.innerHTML += `Traveler ${travelerId}, seat ${selectedSeat.seat}, total ${selectedSeat.totalGross} ${selectedSeat.currency}<br>`;
                    // } else {
                    //     infoDiv.innerHTML += `Traveler ${travelerId}, seat not selected<br>`;
                    // }
                    if (selectedSeat) {
                        infoDiv.innerHTML += `
                        <!--Traveler ${travelerId}, seat ${selectedSeat.seat}, total ${roundValue(selectedSeat.totalGross, seatCurrency)} ${selectedSeat.currency}<br>-->
                        <div class="passenger-item-wrapper active">
                                                            <div class="passenger-info-wrapper">
                                                                <div class="passenger-icon">
                                                                    T${travelerId}
                                                                </div>
                                                                <div class="passenger-description-wrapper">
                                                                    <div class="name">
                                                                        Traveler ${travelerId}
                                                                    </div>
                                                                    <div class="extra-info">
                                                                        total ${roundValue(selectedSeat.totalGross, seatCurrency)} ${selectedSeat.currency}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="passenger-item-checkbox-wrapper green">
                                                                <div class = "number">
                                                                    ${selectedSeat.seat}
                                                                </div>
                                                            
                                                            </div>
            
                                                        </div>
                        `;
                    } else {
                        infoDiv.innerHTML += `
                        <!--Traveler ${travelerId}, seat not selected<br>-->
                        <div class="passenger-item-wrapper">
                                                            <div class="passenger-info-wrapper">
                                                                <div class="passenger-icon">
                                                                    T${travelerId}
                                                                </div>
                                                                <div class="passenger-description-wrapper">
                                                                    <div class="name">
                                                                        Traveler ${travelerId}
                                                                    </div>
                                                                    <div class="extra-info">
                                                                        seat not selected
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="passenger-item-checkbox-wrapper">
            
                                                            </div>
            
                                                        </div>
                        `;
                    }
                }
            }

            // Update the "Next Flight" button (corrected logic)
            const expectedSelections = numTravelers;
            const selectedSeatsForCurrentFlight = Object.values(selectedSeats).reduce((acc, travelerSeats) => acc + (travelerSeats[currentFlightIndex] ? 1 : 0), 0);
            document.getElementById('next-flight-btn').disabled = selectedSeatsForCurrentFlight !== expectedSelections;

            // Update the "Previous Flight" button
            if (document.getElementById('previous-flight-btn')) {
                document.getElementById('previous-flight-btn').disabled = currentFlightIndex === 0;
            }

            // Update button text if it's the last flight
            document.getElementById('next-flight-btn').textContent = currentFlightIndex < flightsData.result.length - 1 ? 'Next Flight' : 'Submit Data';
        } else {
            // Do nothing if all seats are already selected
            console.log('All seats are already selected.');
        }

    }
});

app.addEventListener('mouseover', (e) => {
    if (e.target.classList.contains('seat') && !e.target.classList.contains('blocked')) {
        showPopup(e.target);
    }
});

app.addEventListener('mouseout', (e) => {
    if (e.target.classList.contains('seat')) {
        hidePopup()
    }
});


function showPopup(event) {
    event.querySelector('.seat-popup').classList.add('active');
}

function hidePopup() {
    const seatPopupArr = document.querySelectorAll('.seat-popup')
    seatPopupArr.forEach(elem => {
        if (elem.classList.contains('active')) {
            elem.classList.remove('active')
        }

    })

}

// Функция для показа лоудера внутри кнопки
function showButtonLoader() {
    const button = document.querySelector('.submit-seatmap-data-btn.submit')
    const spinner = document.createElement('span');
    spinner.classList.add('spinner-submit-seatmap');
    button.appendChild(spinner);
    button.disabled = true;
}

// Функция для скрытия лоудера внутри кнопки
function hideButtonLoader() {
    const button = document.querySelector('.submit-seatmap-data-btn.submit')
    const spinner = button.querySelector('.spinner-submit-seatmap');
    if (spinner) {
        button.removeChild(spinner);
    }
    button.disabled = false;
}
