document.addEventListener('DOMContentLoaded', () => {
    const prices = [
        [597, 356, 198, 315, 377, 233, 288],
        [509, 292, 134, 252, 314, 169, 225],
        [581, 324, 166, '', 345, 201, 256],
        [509, 310, 152, 269, '', 187, 242],
        [588, 331, 173, 290, 352, 208, 263],
        [571, 313, 155, 273, 335, 190, 246],
        [537, 419, 261, 381, 389, 296, 352]
    ];

    const lowestPrice = Math.min(...prices.flat());
    const startDate = new Date(2024, 6, 7); // 7th July 2024
    let currentStartDate = new Date(startDate);
    let currentVerticalStartDate = new Date(startDate);

    const daysOfWeek = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];

    const formatDate = (date) => {
        const day = date.getDate();
        const month = date.toLocaleDateString('ru-RU', { month: 'short' });
        const dayOfWeek = daysOfWeek[date.getDay()];
        let styleWeekEnd = '';
        if(dayOfWeek == 'СБ' || dayOfWeek == 'ВС'){
            styleWeekEnd = 'red';
        }

        return `<div>${day} ${month}</div><div class="weekend ${styleWeekEnd}"> ${dayOfWeek}</div>`;
    };

    const updateTable = () => {
        const dateHeader = document.getElementById('date-header');
        const tableBody = document.getElementById('price-table-body');

        dateHeader.innerHTML = '';
        tableBody.innerHTML = '';

        // Update header dates
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(currentStartDate);
            date.setDate(date.getDate() + i);
            dates.push(date);
            const th = document.createElement('th');
            th.innerHTML = formatDate(date);
            dateHeader.appendChild(th);
        }
        const th = document.createElement('th');
        th.textContent = '';
        dateHeader.appendChild(th);

        // Update table rows
        prices.forEach((row, rowIndex) => {
            const tr = document.createElement('tr');

            row.forEach((price, colIndex) => {
                const td = document.createElement('td');
                if(price != ''){
                    td.textContent = `${price} BYN`;
                }else{
                    td.textContent = `-`;
                }

                if (price === lowestPrice) {
                    td.classList.add('lowest-price');
                } else if (price < 200) {
                    td.classList.add('low-price');
                } else if (price > 300) {
                    td.classList.add('high-price');
                }

                // Select a specific cell as highlighted if needed
                if (rowIndex === 3 && colIndex === 3) {
                    td.classList.add('selected');
                }

                // Add hover event to highlight row and column
                td.addEventListener('mouseenter', () => highlightRowAndColumn(rowIndex, colIndex, true));
                td.addEventListener('mouseleave', () => highlightRowAndColumn(rowIndex, colIndex, false));

                tr.appendChild(td);
            });

            const rowTh = document.createElement('th');
            const rowDate = new Date(currentVerticalStartDate);
            rowDate.setDate(rowDate.getDate() + rowIndex);
            rowTh.innerHTML = formatDate(rowDate);
            tr.appendChild(rowTh);

            tableBody.appendChild(tr);
        });
    };

    const highlightRowAndColumn = (rowIndex, colIndex, highlight) => {
        const tableBody = document.getElementById('price-table-body');
        const rows = tableBody.getElementsByTagName('tr');
        const dateHeader = document.getElementById('date-header');
        const headerCells = dateHeader.getElementsByTagName('th');
        const lastColIndex = headerCells.length - 2; // Index of the last data column

        // Highlight the specific row starting from the hovered column index
        for (let j = colIndex; j < rows[rowIndex].getElementsByTagName('td').length; j++) {
            rows[rowIndex].getElementsByTagName('td')[j].classList.toggle('highlighted-row', highlight);
        }

        // Highlight the specific column cell in each row up to the hovered row index
        for (let i = 0; i <= rowIndex; i++) {
            rows[i].getElementsByTagName('td')[colIndex].classList.toggle('highlighted-col', highlight);
        }

        // Highlight header columns
        headerCells[colIndex].classList.toggle('highlighted-col', highlight);

        // Highlight the topmost cell in the hovered column
        rows[0].getElementsByTagName('td')[colIndex].classList.toggle('highlighted-top', highlight);

        // Highlight the rightmost cell in the hovered row
        rows[rowIndex].getElementsByTagName('td')[lastColIndex].classList.toggle('highlighted-right', highlight);

        // Highlight the cell itself
        rows[rowIndex].getElementsByTagName('td')[colIndex].classList.toggle('highlighted-cell', highlight);
    };

    document.getElementById('prevDateBtn').addEventListener('click', () => {
        currentStartDate.setDate(currentStartDate.getDate() - 7);
        updateTable();
    });

    document.getElementById('nextDateBtn').addEventListener('click', () => {
        currentStartDate.setDate(currentStartDate.getDate() + 7);
        updateTable();
    });

    document.getElementById('prevDateVerticalBtn').addEventListener('click', () => {
        currentVerticalStartDate.setDate(currentVerticalStartDate.getDate() - 7);
        updateTable();
    });

    document.getElementById('nextDateVerticalBtn').addEventListener('click', () => {
        currentVerticalStartDate.setDate(currentVerticalStartDate.getDate() + 7);
        updateTable();
    });

    updateTable(); // Initial table update
});
