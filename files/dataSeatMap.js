const seatMap = {
    data: [
        {
            decks: [
                {
                    deckConfiguration: {
                        width: 6,
                        length: 10,
                        startWingsX: 2,
                        endWingsX: 8,
                        exitRowsX: [3, 7]
                    },
                    seats: [
                        { number: '1A', coordinates: { x: 0, y: 0 }, travelerPricing: [{ seatAvailabilityStatus: 'AVAILABLE' }] },
                        { number: '1B', coordinates: { x: 0, y: 1 }, travelerPricing: [{ seatAvailabilityStatus: 'OCCUPIED' }] },
                        // добавьте остальные места...
                    ],
                    facilities: [
                        { code: 'WC', coordinates: { x: 1, y: 1 } },
                        // добавьте остальные удобства...
                    ]
                }
            ]
        }
    ]
};
