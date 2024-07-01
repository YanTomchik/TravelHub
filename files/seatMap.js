


document.addEventListener('DOMContentLoaded', () => {
    const seatMap = {
        data: [
            {
                decks: [
                    {
                        deckConfiguration: {
                            width: 6,
                            length: 5,
                            exitRowsX: [2],
                            startWingsX: 1,
                            endWingsX: 4,
                        },
                        seats: [
                            { number: '1A', coordinates: { x: 0, y: 0 }, travelerPricing: [{ seatAvailabilityStatus: 'AVAILABLE' }] },
                            { number: '1B', coordinates: { x: 0, y: 1 }, travelerPricing: [{ seatAvailabilityStatus: 'OCCUPIED' }] },
                            { number: '1C', coordinates: { x: 0, y: 2 }, travelerPricing: [{ seatAvailabilityStatus: 'AVAILABLE' }] },
                            { number: '1D', coordinates: { x: 0, y: 3 }, travelerPricing: [{ seatAvailabilityStatus: 'OCCUPIED' }] },
                            { number: '1E', coordinates: { x: 0, y: 4 }, travelerPricing: [{ seatAvailabilityStatus: 'AVAILABLE' }] },
                            { number: '1F', coordinates: { x: 0, y: 5 }, travelerPricing: [{ seatAvailabilityStatus: 'OCCUPIED' }] },
                            { number: '2A', coordinates: { x: 1, y: 0 }, travelerPricing: [{ seatAvailabilityStatus: 'AVAILABLE' }] },
                            { number: '2B', coordinates: { x: 1, y: 1 }, travelerPricing: [{ seatAvailabilityStatus: 'OCCUPIED' }] },
                            { number: '2C', coordinates: { x: 1, y: 2 }, travelerPricing: [{ seatAvailabilityStatus: 'AVAILABLE' }] },
                            { number: '2D', coordinates: { x: 1, y: 3 }, travelerPricing: [{ seatAvailabilityStatus: 'OCCUPIED' }] },
                            { number: '2E', coordinates: { x: 1, y: 4 }, travelerPricing: [{ seatAvailabilityStatus: 'AVAILABLE' }] },
                            { number: '2F', coordinates: { x: 1, y: 5 }, travelerPricing: [{ seatAvailabilityStatus: 'OCCUPIED' }] },
                            { number: '3A', coordinates: { x: 2, y: 0 }, travelerPricing: [{ seatAvailabilityStatus: 'AVAILABLE' }] },
                            { number: '3B', coordinates: { x: 2, y: 1 }, travelerPricing: [{ seatAvailabilityStatus: 'OCCUPIED' }] },
                            { number: '3C', coordinates: { x: 2, y: 2 }, travelerPricing: [{ seatAvailabilityStatus: 'AVAILABLE' }] },
                            { number: '3D', coordinates: { x: 2, y: 3 }, travelerPricing: [{ seatAvailabilityStatus: 'OCCUPIED' }] },
                            { number: '3E', coordinates: { x: 2, y: 4 }, travelerPricing: [{ seatAvailabilityStatus: 'AVAILABLE' }] },
                            { number: '3F', coordinates: { x: 2, y: 5 }, travelerPricing: [{ seatAvailabilityStatus: 'OCCUPIED' }] },
                            { number: '4A', coordinates: { x: 3, y: 0 }, travelerPricing: [{ seatAvailabilityStatus: 'AVAILABLE' }] },
                            { number: '4B', coordinates: { x: 3, y: 1 }, travelerPricing: [{ seatAvailabilityStatus: 'OCCUPIED' }] },
                            { number: '4C', coordinates: { x: 3, y: 2 }, travelerPricing: [{ seatAvailabilityStatus: 'AVAILABLE' }] },
                            { number: '4D', coordinates: { x: 3, y: 3 }, travelerPricing: [{ seatAvailabilityStatus: 'OCCUPIED' }] },
                            { number: '4E', coordinates: { x: 3, y: 4 }, travelerPricing: [{ seatAvailabilityStatus: 'AVAILABLE' }] },
                            { number: '4F', coordinates: { x: 3, y: 5 }, travelerPricing: [{ seatAvailabilityStatus: 'OCCUPIED' }] },
                            { number: '5A', coordinates: { x: 4, y: 0 }, travelerPricing: [{ seatAvailabilityStatus: 'AVAILABLE' }] },
                            { number: '5B', coordinates: { x: 4, y: 1 }, travelerPricing: [{ seatAvailabilityStatus: 'OCCUPIED' }] },
                            { number: '5C', coordinates: { x: 4, y: 2 }, travelerPricing: [{ seatAvailabilityStatus: 'AVAILABLE' }] },
                            { number: '5D', coordinates: { x: 4, y: 3 }, travelerPricing: [{ seatAvailabilityStatus: 'OCCUPIED' }] },
                            { number: '5E', coordinates: { x: 4, y: 4 }, travelerPricing: [{ seatAvailabilityStatus: 'AVAILABLE' }] },
                            { number: '5F', coordinates: { x: 4, y: 5 }, travelerPricing: [{ seatAvailabilityStatus: 'OCCUPIED' }] },
                        ],
                        facilities: [
                            { code: 'W1', coordinates: { x: 0, y: 6 } },
                            { code: 'W2', coordinates: { x: 4, y: 6 } },
                            { code: 'L1', coordinates: { x: 0, y: 3 } },
                            { code: 'L2', coordinates: { x: 4, y: 3 } },
                        ]
                    }
                ]
            }
        ]
    };
    
    
    
    
    const seatMapData = seatMap.data[0].decks;
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

    const displayExits = (exitRows) => {
        return exitRows.map((row) => {
            const exitDiv = document.createElement('div');
            exitDiv.className = 'exit';
            exitDiv.innerHTML = `
                <span style="left: -4.1em; top: ${row * 2}em;">EXIT</span>
                <span style="left: 13.5em; top: ${row * 2}em;">EXIT</span>
            `;
            return exitDiv;
        });
    };

    const displayFacilities = (facilityList) => {
        return facilityList.map((facility) => {
            const facilityDiv = document.createElement('div');
            facilityDiv.className = 'facility';
            facilityDiv.style.left = `${facility.coordinates.y * 2}em`;
            facilityDiv.style.top = `${facility.coordinates.x * 2}em`;
            facilityDiv.textContent = facility.code;
            return facilityDiv;
        });
    };

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
        const facilities = deck.facilities;
        const wingStart = deck.deckConfiguration.startWingsX;
        const wingEnd = deck.deckConfiguration.endWingsX;
        const exitRows = deck.deckConfiguration.exitRowsX;

        const deckDiv = document.createElement('div');
        deckDiv.id = 'deck';
        deckDiv.style.width = `${width * 2.2}em`;
        deckDiv.style.height = `${length * 2.1}em`;

        const seats = displaySeats(seatList);
        seats.forEach(seat => deckDiv.appendChild(seat));

        const facilitiesElements = displayFacilities(facilities);
        facilitiesElements.forEach(facility => deckDiv.appendChild(facility));

        const wings = displayWings(wingStart, wingEnd);
        wings.forEach(wing => deckDiv.appendChild(wing));

        const exits = displayExits(exitRows);
        exits.forEach(exit => deckDiv.appendChild(exit));

        return deckDiv;
    };

    seatMapData.forEach(deck => {
        const deckElement = createDeck(deck);
        app.appendChild(deckElement);
    });
});
