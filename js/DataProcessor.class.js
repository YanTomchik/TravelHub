class DataProcessor {
    constructor() {
        this.filterInputs = document.querySelectorAll('#filters input');

        this.restoreInputedData();
        this.filterInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.saveFilterData();
                if (getComputedStyle(document.querySelector('#filter-modal')).display === 'none') {
                    this.startSearch();
                }
            });
        });
    }

    parseQueryString() {
        let queryString = window.location.search.slice(1);

        let queryParams = {};

        let pairs = queryString.split('&');

        for (let i = 0; i < pairs.length; i++) {
            let keyValuePair = pairs[i].split('=');
            let key = decodeURIComponent(keyValuePair[0]);
            let value = decodeURIComponent(keyValuePair[1] || '');

            // Check if key ends with '[]', indicating it's an array
            if (key.endsWith('[]')) {
                key = key.slice(0, -2); // Remove the '[]'
                if (queryParams.hasOwnProperty(key)) {
                    queryParams[key].push(value);
                } else {
                    queryParams[key] = [value];
                }
            } else {
                queryParams[key] = value;
            }
        }

        return queryParams;
    }

    saveDataToUrl(key, value) {
        let currentUrl = window.location.href;
        let url = new URL(currentUrl);

        url.searchParams.set(key, value);

        history.pushState(null, '', url);
    }

    saveDatePickerData() {
        const checkinDatePickerValue = document.getElementById('hotel-book-checkin-date').value;
        const checkoutDatePickerValue = document.getElementById('hotel-book-checkout-date').value;

        const datePickerData = {
            checkin: checkinDatePickerValue,
            checkout: checkoutDatePickerValue
        };

        localStorage.setItem('datePickerData', JSON.stringify(datePickerData));
        this.saveDataToUrl('checkin', checkinDatePickerValue);
        this.saveDataToUrl('checkout', checkoutDatePickerValue);
    }

    saveLocation(e) {
        const locationData = {
            id: e.params.data.id,
            name: e.params.data.name,
            partner: e.params.data.partner
        };
        localStorage.setItem('location', JSON.stringify(locationData));
        this.saveDataToUrl('location', locationData.id);
        this.saveDataToUrl('locationName', locationData.name);
        this.saveDataToUrl('partner', locationData.partner);
    }

    saveFilterData() {
        const inputData = {};
        const requiredParams = ['adultCount', 'checkin', 'checkout', 'childrenCount', 'childrenList', 'location', 'locationName', 'partner'];

        var currentParams = this.parseQueryString();

        this.filterInputs.forEach(input => {
            if (input.type === 'checkbox' || input.type === 'radio') {
                console.log('test', input.type, input.checked);
                if (input.checked) {
                    const inputName = input.name;

                    if (inputName in inputData) {
                        inputData[inputName].push(input.value);
                    } else {
                        inputData[inputName] = [input.value];
                    }
                }
            } else {
                inputData[input.name] = input.value;
            }
        });
        const encodedFilterData = JSON.stringify(inputData);
        document.getElementById('filter-data').value = encodedFilterData;

        // Process the required params
        requiredParams.forEach(param => {
            if (currentParams[param] && currentParams[param] !== '') {
                inputData[param] = currentParams[param];
            }
        });

        const queryString = new URLSearchParams();
        for (const key in inputData) {
            if (Array.isArray(inputData[key])) {
                inputData[key].forEach(value => {
                    queryString.append(`${key}[]`, value);
                });
            } else {
                queryString.set(key, inputData[key]);
            }
        }


        const urlObject = new URL(window.location.href);
        urlObject.search = queryString.toString();

        history.pushState(null, '', urlObject.toString());
    }

    startSearch() {
        $('#properties-search-form').yiiActiveForm('validate', true);
        //runHotelSearch();
    }

    async restoreInputedData() {
        let inputData = this.parseQueryString();


        await this.restoreLocation(inputData);
        await this.restoreDatePickerData(inputData);
        if (await this.restoreFilterData(inputData)) {
            this.startSearch();
        }
    }

    restoreLocation(inputData) {
        const locationInput = document.querySelector('#propertysearchform-location');

        let locationId = inputData.location || JSON.parse(localStorage.getItem('location'))?.id;
        let locationPartner = inputData.partner || JSON.parse(localStorage.getItem('location'))?.partner;
        let locationName = inputData.locationName ? decodeURIComponent(inputData.locationName.replace(/\+/g, ' ')) : JSON.parse(localStorage.getItem('location'))?.name;
        document.getElementById('partner').value = locationPartner;

        if (!locationId || !locationName) return;

        const newOption = document.createElement('option');
        newOption.value = locationId;
        newOption.partner = locationPartner;
        newOption.textContent = locationName;
        newOption.selected = true;
        locationInput.appendChild(newOption);

        const event = new Event('change');
        locationInput.dispatchEvent(event);

        if (inputData.location && inputData.locationName) {
            const locationData = {
                id: inputData.location,
                name: decodeURIComponent(inputData.locationName),
                id: inputData.locationPartner,
            };

            localStorage.setItem('location', JSON.stringify(locationData));

        } else {
            this.saveDataToUrl('location', locationId);
            this.saveDataToUrl('locationName', encodeURIComponent(locationName));
            this.saveDataToUrl('partner', locationPartner);
        }
    }

    restoreDatePickerData(inputData) {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        let checkinDate = inputData.checkin || JSON.parse(localStorage.getItem('datePickerData'))?.checkin;
        let checkoutDate = inputData.checkout || JSON.parse(localStorage.getItem('datePickerData'))?.checkout;

        if (checkinDate == 'undefined') checkinDate = '';
        if (checkoutDate == 'undefined') checkoutDate = '';


        let checkinDateF;
        let checkoutDateF;

        if (checkinDate) {
            checkinDateF = checkinDate.split('.').reverse().join('-');
        }
        if (checkoutDate) {
            checkoutDateF = checkoutDate.split('.').reverse().join('-');
        }

        const checkinDateObj = new Date(checkinDateF);
        const checkoutDateObj = new Date(checkoutDateF);


        if (checkinDate && checkinDateObj >= currentDate) {
            document.getElementById('hotel-book-checkin-date').value =  checkinDate;
            this.saveDataToUrl('checkin', checkinDate);

            /*if (!inputData.checkin) {
                this.saveDataToUrl('checkin', inputData.checkin);
            } */
        }

        if (checkoutDate && checkoutDateObj >= currentDate) {
            document.getElementById('hotel-book-checkout-date').value = checkoutDate;
            this.saveDataToUrl('checkout', checkoutDate);

            //if (!inputData.checkout) {
            //    this.saveDataToUrl('checkout', inputData.checkout);
            //}
        }

        if ((inputData.checkout && checkoutDateObj >= currentDate) || (inputData.checkin && checkinDateObj >= currentDate)) {
            this.saveDatePickerData();
        }
    }

    restoreFilterData(filterData) {
        const requiredParams = [
            'additional', 'amenityCategories', 'guestRating', 'maxPrice', 'minPrice', 'propertyCategories', 'starRating'
        ];
        const isRequiredParamPresent = requiredParams.some(param => filterData.hasOwnProperty(param));

        if (!isRequiredParamPresent) {
            return false;
        }

        const filterBlock = document.querySelector('#filters');
        filterBlock.style.display = 'block';

        let maxPriceValue = parseInt($('#max-price').text());
        let leftPercentage = (filterData.minPrice / maxPriceValue) * 100;
        let rightPercentage = (filterData.maxPrice / maxPriceValue) * 100;

        const rangeSelected = document.querySelector('.range-slider .range-selected');
        rangeSelected.style.left = leftPercentage + '%';
        rangeSelected.style.right = 100 - rightPercentage + '%';
        document.getElementById('min-price').textContent = filterData.minPrice + currencySign ?? '$';
        document.getElementById('max-price').textContent = filterData.maxPrice + currencySign ?? '$';

        const inputs = document.querySelectorAll('input');

        inputs.forEach(input => {
            const inputName = input.name;
            const inputType = input.type;

            if (inputType === 'checkbox' || inputType === 'radio') {
                if (inputName in filterData) {
                    if (Array.isArray(filterData[inputName])) {
                        if (filterData[inputName].includes(input.value)) {
                            input.checked = true;
                        } else {
                            input.checked = false;
                        }
                    } else {
                        if (filterData[inputName] === input.value) {
                            input.checked = true;
                        } else {
                            input.checked = false;
                        }
                    }
                }
            } else if (inputName in filterData) {
                input.value = filterData[inputName];
            }
        });

        this.saveFilterData();

        return true;
    }

}
