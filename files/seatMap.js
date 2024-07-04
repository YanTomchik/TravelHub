document.addEventListener('DOMContentLoaded', () => {
    const flightId = 'eJzTd9c3cjIxDvMDAAoKAiU%3D'; // Ваш flightId
    const service = 'amadeus_us'; // Ваш serviceName
    const bearerToken = 'AmaOk_eyJpZCI6MTYsImVtYWlsIjoibWFuYWdlcnNAaW5maW5pdHkuYnkifQ'; // Ваш статичный bearerToken

    fetch(`https://api.travelhub.by/flight/seatmap?flightId=${flightId}&service=${service}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.message !== 'success') {
            console.error('Error: ', data.message);
            return;
        }

        const seatMap = data.result[0]; // Обновляем seatMap с полученными данными
        
        const seatMapData = seatMap.decks;
        console.log(seatMapData)
        const app = document.getElementById('app');

        const displaySeats = (seatList) => {
            return seatList.map((seat) => {
                const color = seat.travelerPricing[0].seatAvailabilityStatus === 'AVAILABLE' ? "#499167" : "#FE5F55";
                const seatDiv = document.createElement('div');
                seatDiv.className = 'seat';
                seatDiv.style.left = `${seat.coordinates.y * 2}em`;
                seatDiv.style.top = `${seat.coordinates.x * 2}em`;
                seatDiv.style.backgroundColor = color;
                seatDiv.textContent = seat.number;
                return seatDiv;
            });
        };

        // const displayExits = (exitRows) => {
        //     return exitRows.map((row) => {
        //         const exitDiv = document.createElement('div');
        //         exitDiv.className = 'exit';
        //         exitDiv.innerHTML = `
        //             <span style="left: -4.1em; top: ${row * 2}em;">EXIT</span>
        //             <span style="left: 13.5em; top: ${row * 2}em;">EXIT</span>
        //         `;
        //         return exitDiv;
        //     });
        // };

        // const displayFacilities = (facilityList) => {
        //     return (facilityList || []).map((facility) => {
        //         const facilityDiv = document.createElement('div');
        //         facilityDiv.className = 'facility';
        //         facilityDiv.style.left = `${facility.coordinates.y * 2}em`;
        //         facilityDiv.style.top = `${facility.coordinates.x * 2}em`;
        //         facilityDiv.textContent = facility.code;
        //         return facilityDiv;
        //     });
        // };

        const displayWings = (start, end) => {
            const wings = [];
            ['left', 'right'].forEach(orientation => {
                const wingDiv = document.createElement('div');
                wingDiv.className = 'wing';
                wingDiv.style.left = orientation === 'left' ? "-252px" : "15.5em";
                wingDiv.style.top = `${start * 2}em`;
                wingDiv.style.height = `${(end - start) * 2}em`;
                wings.push(wingDiv);
            });
            return wings;
        };

        const createDeck = (deck) => {
            const width = deck.deckConfiguration.width;
            const length = deck.deckConfiguration.length;
            const seatList = deck.seats;
            // const facilities = deck.facilities || [];
            const wingStart = deck.deckConfiguration.startWingsX;
            const wingEnd = deck.deckConfiguration.endWingsX;
            // const exitRows = deck.deckConfiguration.exitRowsX;

            console.log(length)
            console.log(seatList)
            // console.log(facilities)
            console.log(wingStart)
            console.log(wingEnd)
            // console.log(exitRows)

            const deckDiv = document.createElement('div');
            deckDiv.id = 'deck';
            deckDiv.style.width = `${width * 2.2}em`;
            deckDiv.style.height = `${length * 2.1}em`;

            const seats = displaySeats(seatList);
            seats.forEach(seat => deckDiv.appendChild(seat));

            // // const facilitiesElements = displayFacilities(facilities);
            // // facilitiesElements.forEach(facility => deckDiv.appendChild(facility));

            const wings = displayWings(wingStart, wingEnd);
            wings.forEach(wing => deckDiv.appendChild(wing));

            // const exits = displayExits(exitRows);
            // exits.forEach(exit => deckDiv.appendChild(exit));

            return deckDiv;
        };

        seatMapData.forEach(deck => {
            console.log(deck)
            const deckElement = createDeck(deck);
            app.appendChild(deckElement);
        });
    })
    .catch(error => {
        console.error('Error fetching seat map:', error);
    });
});
