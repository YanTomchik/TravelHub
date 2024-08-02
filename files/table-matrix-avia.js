document.addEventListener('DOMContentLoaded', async () => {
    const todayDate = new Date(); // Current date
    const extratextSearchMatrix = document.getElementById('extratextSearchMatrix');

    let tableData, departureDates, returnDates;
    const maxColumns = 7; // Number of columns to display at once

    const theadRow = document.querySelector('thead tr');
    const tbody = document.querySelector('tbody');

    let selectedDepartureDate = null;
    let selectedReturnDate = null;

    let currentStartDate = null;
    let currentEndDate = null;

    async function fetchDataMatrix() {
        document.getElementById('loader-compare-table').style.display = 'block';
        
        let locationFrom = $('#flightsearchform-locationfrom').val();
        let locationTo = $('#flightsearchform-locationto').val();
        const dateFromFetch = formatDate(currentStartDate);
        const dateToFetch = currentEndDate ? formatDate(currentEndDate) : null;

        let apiUrl;
        if (dateToFetch) {
            apiUrl = `https://api.travelhub.by/flight/comparison-table?route=trip&locationFrom=${locationFrom}&locationTo=${locationTo}&adults=1&period=${dateFromFetch};${dateToFetch}&currency=${USER_CURRENCY}`;
        } else {
            apiUrl = `https://api.travelhub.by/flight/comparison-table?route=one&locationFrom=${locationFrom}&locationTo=${locationTo}&adults=1&currency=${USER_CURRENCY}&date=${dateFromFetch}`;
        }

        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': 'Bearer AmaOk_eyJpZCI6MTYsImVtYWlsIjoibWFuYWdlcnNAaW5maW5pdHkuYnkifQ'
            }
        });

        const data = await response.json();
        tableData = data.result;

        if (dateToFetch) {
            departureDates = [...new Set(tableData.map(item => item.from))].sort((a, b) => new Date(a.split('.').reverse().join('-')) - new Date(b.split('.').reverse().join('-')));
            returnDates = [...new Set(tableData.map(item => item.to))].sort((a, b) => new Date(a.split('.').reverse().join('-')) - new Date(b.split('.').reverse().join('-')));

            // Add missing dates to make sure there are at least maxColumns dates
            while (departureDates.length < maxColumns) {
                const lastDate = new Date(departureDates[departureDates.length - 1].split('.').reverse().join('-'));
                lastDate.setDate(lastDate.getDate() + 1);
                departureDates.push(formatDate(lastDate));
            }
            while (returnDates.length < maxColumns) {
                const lastDate = new Date(returnDates[returnDates.length - 1].split('.').reverse().join('-'));
                lastDate.setDate(lastDate.getDate() + 1);
                returnDates.push(formatDate(lastDate));
            }
        } else {
            departureDates = [...new Set(tableData.map(item => item.from))].sort((a, b) => new Date(a.split('.').reverse().join('-')) - new Date(b.split('.').reverse().join('-')));
        }

        renderTable();
        document.getElementById('loader-compare-table').style.display = 'none';
    }

    function getGuests() {
        return document.getElementById('guests').value;
    }

    function renderTable() {
        theadRow.innerHTML = '';
        tbody.innerHTML = '';

        let locationFrom = $('#flightsearchform-locationfrom').val();
        let locationTo = $('#flightsearchform-locationto').val();

        // Insert Departure Dates into the table header
        const visibleDepartureDates = departureDates.slice(0, maxColumns);
        visibleDepartureDates.forEach(date => {
            const th = document.createElement('th');
            const formattedDateToDisplay = formatDisplayDate(date);

            if (['Sat', 'Sun', 'сб', 'вс'].includes(formattedDateToDisplay.split(',')[0])) {
                th.innerHTML = `<div><span class='red'>${formattedDateToDisplay.split(',')[0]}</span>${formattedDateToDisplay.split(',')[1]}</div>`;
            } else {
                th.innerHTML = `<div><span>${formattedDateToDisplay.split(',')[0]}</span>${formattedDateToDisplay.split(',')[1]}</div>`;
            }

            theadRow.appendChild(th);
        });

        if (!currentEndDate) { // One-way flight case
            const priceRow = document.createElement('tr');
            let minPrice = Infinity;
            let minPriceCell = null;

            visibleDepartureDates.forEach(depDate => {
                const td = document.createElement('td');
                const priceData = tableData.find(item => item.from === depDate && item.to === null);

                if (priceData) {
                    const priceUrl = `${HOST_URL}flights?departure=${locationFrom}&arrival=${locationTo}&date=${depDate}&guests=${getGuests()}&run=1`;
                    td.innerHTML = `<a href="${priceUrl}" target="_blank" class='compare-cell-search-link'>${priceData.price.toFixed(2)} ${priceData.currency}</a>`;
                    td.classList.add('price');

                    if (priceData.price < minPrice) {
                        minPrice = priceData.price;
                        minPriceCell = td;
                    }
                } else {
                    td.textContent = '-';
                }

                td.addEventListener('click', () => {
                    selectedDepartureDate = depDate;

                    datepicker.selectDate([parseDate(selectedDepartureDate)]);
                    extratextSearchMatrix.classList.add('active');
                });

                priceRow.appendChild(td);
            });

            tbody.appendChild(priceRow);

            // Highlight the cell with the minimum price
            if (minPriceCell) {
                minPriceCell.classList.add('cheap');
            }
            document.querySelector('.vertical-controls').style.opacity = '0';
        } else {
            // Insert Return Dates and corresponding Prices
            const visibleReturnDates = returnDates.slice(0, maxColumns);
            let minPrice = Infinity;
            let minPriceCell = null;

            visibleReturnDates.forEach(retDate => {
                const tr = document.createElement('tr');

                visibleDepartureDates.forEach(depDate => {
                    
                    const td = document.createElement('td');
                    const priceData = tableData.find(item => item.from === depDate && item.to === retDate);

                    if (priceData) {
                        const priceUrl = `${HOST_URL}flights?departure=${locationFrom}&arrival=${locationTo}&date=${depDate}&dateEnd=${retDate}&guests=${getGuests()}&run=1`;
                        td.innerHTML = `<a href="${priceUrl}" target="_blank">${priceData.price.toFixed(2)} ${priceData.currency}</a>`;
                        td.classList.add('price');

                        if (priceData.price < minPrice) {
                            minPrice = priceData.price;
                            minPriceCell = td;
                        }
                    } else {
                        td.textContent = '-';
                    }

                    // Add click event listener to each cell
                    td.addEventListener('click', () => {
                        selectedDepartureDate = depDate;
                        selectedReturnDate = retDate;

                        datepicker.selectDate([parseDate(selectedDepartureDate), parseDate(selectedReturnDate)]);
                        extratextSearchMatrix.classList.add('active');
                    });

                    tr.appendChild(td);
                });

                const th = document.createElement('th');
                const formattedDateRetToDisplay = formatDisplayDate(retDate);

                if (['Sat', 'Sun', 'сб', 'вс'].includes(formattedDateRetToDisplay.split(',')[0])) {
                    th.innerHTML = `<div><span class='red'>${formattedDateRetToDisplay.split(',')[0]}</span>${formattedDateRetToDisplay.split(',')[1]}</div>`;
                } else {
                    th.innerHTML = `<div><span>${formattedDateRetToDisplay.split(',')[0]}</span>${formattedDateRetToDisplay.split(',')[1]}</div>`;
                }

                tr.appendChild(th);
                tbody.appendChild(tr);
            });

            // Highlight the cell with the minimum price
            if (minPriceCell) {
                minPriceCell.classList.add('cheap');
            }

            document.querySelector('.vertical-controls').style.opacity = '100';
        }

        // Add hover effect
        const cells = document.querySelectorAll('td, th');

        cells.forEach(cell => {
            cell.addEventListener('mouseover', () => {
                const cellIndex = cell.cellIndex;
                const rowIndex = cell.parentElement.rowIndex;

                highlightCell(cellIndex, rowIndex);
            });

            cell.addEventListener('mouseout', () => {
                removeHighlights();
            });
        });
    }

    function highlightCell(cellIndex, rowIndex) {
        const rows = document.querySelectorAll('tr');

        // Highlight column up to the current cell
        for (let i = 0; i <= rowIndex; i++) {
            const cell = rows[i].cells[cellIndex];
            if (cell && cell.tagName !== 'TH') {
                cell.classList.add('highlight-column');
            } else if (cell) {
                cell.classList.add('highlight-header');
            }
        }

        // Highlight row from the current cell to the right
        const row = rows[rowIndex];
        for (let j = cellIndex; j < row.cells.length; j++) {
            const cell = row.cells[j];
            if (cell && cell.tagName !== 'TH') {
                cell.classList.add('highlight-row');
            } else if (cell) {
                cell.classList.add('highlight-header');
            }
        }

        // Highlight the current cell
        const cell = row.cells[cellIndex];
        if (cell && cell.tagName !== 'TH') {
            cell.classList.add('highlight-cell');
        } else if (cell) {
            cell.classList.add('highlight-header');
        }
    }

    function removeHighlights() {
        const highlightedCells = document.querySelectorAll('.highlight-column, .highlight-row, .highlight-cell, .highlight-header');
        highlightedCells.forEach(cell => {
            cell.classList.remove('highlight-column', 'highlight-row', 'highlight-cell', 'highlight-header');
        });
    }

    document.getElementById('prev-departure').addEventListener('click', async (elem) => {
        const newStartDate = new Date(currentStartDate);
        newStartDate.setDate(newStartDate.getDate() - 1);

        if (newStartDate > todayDate) {
            currentStartDate = newStartDate;
            await fetchDataMatrix();
        }
    });

    document.getElementById('next-departure').addEventListener('click', async () => {
        currentStartDate.setDate(currentStartDate.getDate() + 1);
        await fetchDataMatrix();
    });

    document.getElementById('prev-return').addEventListener('click', async () => {
        const newEndDate = new Date(currentEndDate);
        newEndDate.setDate(newEndDate.getDate() - 1);

        if (newEndDate > todayDate) {
            currentEndDate = newEndDate;
            await fetchDataMatrix();
        }
    });

    document.getElementById('next-return').addEventListener('click', async () => {
        currentEndDate.setDate(currentEndDate.getDate() + 1);
        await fetchDataMatrix();
    });

    function formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }

    function formatDisplayDate(dateString) {
        const [day, month, year] = dateString.split('.').map(Number);
        const date = new Date(year, month - 1, day);
        let formattedDate = date.toLocaleDateString('ru-RU', { weekday: 'short', month: 'short', day: 'numeric' });
        if (MAIN_LANGUAGE == 'ru') {
            formattedDate = date.toLocaleDateString('ru-RU', { weekday: 'short', month: 'short', day: 'numeric' });
        } else if (MAIN_LANGUAGE == 'en') {
            formattedDate = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        }

        return formattedDate;
    }

    const topControlsHeader = document.getElementById('topControlsHeader');
    const rightControlsHeader = document.getElementById('rightControlsHeader');
    if (MAIN_LANGUAGE == 'ru') {
        topControlsHeader.textContent = 'Туда';
        rightControlsHeader.textContent = 'Обратно';
    } else if (MAIN_LANGUAGE == 'en') {
        topControlsHeader.textContent = 'Departure';
        rightControlsHeader.textContent = 'Return';
    }

    document.querySelector('.compare-table-tickets').addEventListener('click', () => {
        document.getElementById('compare-table-avia-container').classList.toggle('active');
    });

    document.querySelector('.compare-table-avia-header-wrapper .close-btn').addEventListener('click', () => {
        document.getElementById('compare-table-avia-container').classList.toggle('active');
    });

    function parseDate(dateString) {
        const [day, month, year] = dateString.split('.').map(Number);
        return new Date(year, month - 1, day);
    }

    document.querySelector('.btn.btn-primary.search-btn').addEventListener('click', async () => {
        currentStartDate = new Date(parseDate(datepickerInputFrom.value));  // Example start date
        if (datepickerInputTo.value != '') {
            currentEndDate = new Date(parseDate(datepickerInputTo.value));    // Example end date
        } else {
            currentEndDate = null;
        }
        await fetchDataMatrix();
    })
});
