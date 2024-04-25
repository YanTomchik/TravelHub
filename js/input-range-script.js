let rangeMin = 100;
const range = document.querySelector("#filters .range-selected");
const rangeInput = document.querySelectorAll("#filters .range-input input");
const rangePrice = document.querySelectorAll("#filters .range-price p");

rangeInput.forEach((input) => {
    input.addEventListener("input", (e) => {
        let minRange = parseInt(rangeInput[0].value);
        let maxRange = parseInt(rangeInput[1].value);
        if (maxRange - minRange < rangeMin) {
            if (e.target.className === "min") {
                rangeInput[0].value = maxRange - rangeMin;
            } else {
                rangeInput[1].value = minRange + rangeMin;
            }
        } else {
            rangePrice[0].textContent = minRange + currencySign ?? '$';
            rangePrice[1].textContent = maxRange + currencySign ?? '$';
            range.style.left = (minRange / rangeInput[0].max) * 100 + "%";
            range.style.right = 100 - (maxRange / rangeInput[1].max) * 100 + "%";
        }
    });
});


const mapRange = document.querySelector("#map_filters .range-selected");
const mapRangeInput = document.querySelectorAll("#map_filters .range-input input");
const mapRangePrice = document.querySelectorAll("#map_filters .range-price p");

mapRangeInput.forEach((input) => {
    input.addEventListener("input", (e) => {
        let minRange = parseInt(mapRangeInput[0].value);
        let maxRange = parseInt(mapRangeInput[1].value);
        if (maxRange - minRange < rangeMin) {
            if (e.target.className === "min") {
                mapRangeInput[0].value = maxRange - rangeMin;
            } else {
                mapRangeInput[1].value = minRange + rangeMin;
            }
        } else {
            mapRangePrice[0].textContent = minRange + currencySign ?? '$';
            mapRangePrice[1].textContent = maxRange + currencySign ?? '$';
            mapRange.style.left = (minRange / mapRangeInput[0].max) * 100 + "%";
            mapRange.style.right = 100 - (maxRange / mapRangeInput[1].max) * 100 + "%";
        }
    });
});
