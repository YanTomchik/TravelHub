document.addEventListener('DOMContentLoaded', () => {
    $('#country-id').select2();
    let selectElement = document.getElementById('country-id');
    

    const tokenDaData = "dad0ce47c0043f8e93e60bfccf2170303f5a5c3b";
    const tokenIpInfo = '0c80f44623564d';
    const apiKeySwiftIban = 'd9579d0c90msh3add6dd8c3cea82p156010jsn3c2d9bccd9f7';

    const setCountryByIP = async () => {
        try {
            const response = await fetch(`https://ipinfo.io/json?token=${tokenIpInfo}`);
            const data = await response.json();
            const countryCode = data.country;
    
            if (countryCode) {
                const $countrySelect = $('#country-id');
                const $matchingOption = $countrySelect.find(`option[data-country-code="${countryCode}"]`);
    
                if ($matchingOption.length > 0) {
                    // Устанавливаем значение option, соответствующего атрибуту data-country-code
                    $countrySelect.val($matchingOption.val()).trigger('change.select2');
                } else {
                    // console.log("Country code not found in select options.");
                }
            }

            updateFieldsBasedOnCountry();
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };    

    const fetchCompanyInfo = async (country, taxId) => {
        let apiUrl, options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Token ${tokenDaData}`
            },
            body: JSON.stringify({ query: taxId })
        };

        switch (country) {
            case 'BY':
                apiUrl = `https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party_by`;
                break;
            case 'KZ':
                apiUrl = `https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party_kz`;
                break;
            case 'RU':
                apiUrl = `https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party`;
                break;
        }

        try {
            const response = await fetch(apiUrl, options);
            return await response.json();
        } catch (error) {
            console.log("error", error);
        }
    };

    const autofillCompanyInfo = (data) => {
        if (data) {
            // const country = $('#country-id').val();
            let selectedOption = selectElement.options[selectElement.selectedIndex];
            let country = selectedOption.getAttribute('data-country-code');
            const dataCompany = (country === 'BY' || country === 'RU' || country === 'KZ') ? data.suggestions[0].data : data.results.company;

            const fieldsMapping = {
                'BY': {
                    unp: 'unp',
                    name: 'short_name_ru',
                    address: 'address',
                    zipCode: 0,
                    cityName: 1,
                    streetName: 2,
                    streetNumber: 3,
                    managerName: '',
                    managerPosition: ''
                },
                'RU': {
                    unp: 'inn',
                    name: 'name.short_with_opf',
                    address: 'address.unrestricted_value',
                    zipCode: 0,
                    cityName: 1,
                    streetName: 3,
                    streetNumber: 4,
                    managerName: 'management.name',
                    managerPosition: 'management.post'
                },
                'KZ': {
                    unp: 'bin',
                    name: 'name_ru',
                    address: 'address_ru',
                    zipCode: '',
                    cityName: 0,
                    streetName: 2,
                    streetNumber: 3,
                    managerName: 'fio',
                    managerPosition: ''
                },
                'default': {
                    unp: 'company_number',
                    name: 'name',
                    address: 'registered_address_in_full',
                    zipCode: '',
                    cityName: 0,
                    streetName: 1,
                    streetNumber: '',
                    managerName: dataCompany.directors && dataCompany.directors.length > 0 ? dataCompany.directors[0].name : '',
                    managerPosition: 'Director'
                }
            };

            const mapping = fieldsMapping[country] || fieldsMapping['default'];

            const getNestedValue = (obj, path) => path.split('.').reduce((acc, part) => acc && acc[part], obj);

            document.getElementById('useragencyupdateform-legalname').value = getNestedValue(dataCompany, mapping.name) || '';
            document.getElementById('useragencyupdateform-supervisorname').value = getNestedValue(dataCompany, mapping.managerName) || '';
            document.getElementById('useragencyupdateform-supervisorjobtitle').value = getNestedValue(dataCompany, mapping.managerPosition) || '';
            document.getElementById('useragencyupdateform-taxidentificationnumber').value = getNestedValue(dataCompany, mapping.unp) || '';

            const addressComponents = (getNestedValue(dataCompany, mapping.address) || '').split(',');
            document.getElementById('useragencyupdateform-legaladdress').value = addressComponents[mapping.streetName] || '';
            document.getElementById('useragencyupdateform-zipcode').value = addressComponents[mapping.zipCode] || '';
            document.getElementById('useragencyupdateform-suit').value = addressComponents[mapping.streetNumber] || '';
            document.getElementById('useragencyupdateform-city').value = addressComponents[mapping.cityName] || '';
        }
    };

    const handleTaxIdChange = async (event) => {
        
        const taxId = event.target.value;
        let selectedOption = selectElement.options[selectElement.selectedIndex];
        let countryCode = selectedOption.getAttribute('data-country-code');
        const data = await fetchCompanyInfo(countryCode, taxId);
        // console.log(data)
        autofillCompanyInfo(data);
    };

    document.getElementById('useragencyupdateform-taxidentificationnumber').addEventListener('change', handleTaxIdChange);

    function updateFieldsBasedOnCountry() {
        const selectElement = document.getElementById('country-id');
        let selectedOption = selectElement.options[selectElement.selectedIndex];
        let countryCode = selectedOption.getAttribute('data-country-code');

        const elementsToToggle = {
            US: ['.field-useragencyupdateform-state', '.field-useragencyupdateform-routingnumber', '.field-useragencyupdateform-accountnumber'],
            others: ['.field-useragencyupdateform-bankidentificationcode', '.field-useragencyupdateform-bankaccount', '.field-useragencyupdateform-bankname']
        };

        elementsToToggle.US.forEach(el => $(el).toggle(countryCode === 'US'));
        elementsToToggle.others.forEach(el => $(el).toggle(countryCode !== 'US'));

        const bankInfoClassList = $('#bank-info-state-change').removeClass('inputs-boarding-wrapper two');
        if (countryCode === 'US') {
            bankInfoClassList.add('inputs-boarding-wrapper', 'two');
        }
    }
  
    $('#country-id').on('change', updateFieldsBasedOnCountry);

    const validateAndFetch = async (input, type) => {
        if (!input) return;
    
        let url;
        if (type === 'swift') {
            url = `https://iban-and-swift-details.p.rapidapi.com/api/v1/swift/validate?swift_code=${input}`;
        } else if (type === 'iban') {
            url = `https://iban-and-swift-details.p.rapidapi.com/api/v1/iban/validate?iban_code=${input}`;
        }
    
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': apiKeySwiftIban,
                'X-RapidAPI-Host': 'iban-and-swift-details.p.rapidapi.com'
            }
        };
    
        try {
            const response = await fetch(url, options);
            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (error) {
                console.error(`Error parsing JSON: ${text}`);
                return;
            }
    
            if (type === 'swift') {
                handleValidation(data, swiftInput);
                fetchSwiftInfo(input); // Fetch additional SWIFT info
            } else if (type === 'iban') {
                handleValidation(data, ibanInput);
            }
        } catch (error) {
            console.error(`Error validating ${type}:`, error);
        }
    };
    
    
    const handleValidation = (data, input) => {
        if (data.Status === 'Valid') {
            input.classList.remove('is-invalid')
            input.classList.add('is-valid')
        } else {
            input.classList.add('is-invalid')
            input.classList.remove('is-valid')
        }
        
    };

    const insertSwiftInfo = (data) => {
        if (data.bank_details.bank_name != null) {
            bankNameInput.value = data.bank_details.bank_name;
        }
    };
    
    const fetchSwiftInfo = async (swift) => {
        if (!swift) return;
    
        const url = `https://iban-and-swift-details.p.rapidapi.com/api/v1/swift?swift_code=${swift}`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': apiKeySwiftIban,
                'X-RapidAPI-Host': 'iban-and-swift-details.p.rapidapi.com'
            }
        };
    
        try {
            const response = await fetch(url, options);
            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (error) {
                console.error(`Error parsing JSON: ${text}`);
                return;
            }
            insertSwiftInfo(data);
        } catch (error) {
            console.error('Error fetching SWIFT info:', error);
        }
    };
    

    const swiftInput = document.getElementById('useragencyupdateform-bankidentificationcode');
    const ibanInput = document.getElementById('useragencyupdateform-bankaccount');
    const bankNameInput = document.getElementById('useragencyupdateform-bankname');


    swiftInput.addEventListener('blur', () => validateAndFetch(swiftInput.value, 'swift'));
    ibanInput.addEventListener('blur', () => validateAndFetch(ibanInput.value, 'iban'));

    const resultsContainer = document.getElementById('autocomplete-results');

    const fetchAutocomplete = async (input, sessionToken) => {
        const response = await fetch(`${HOST_URL}locations-autocomplete?q=${input}&sessionToken=${sessionToken}&raw=1`);
        return await response.json();
    };

    const fetchPlaceDetails = async (sessionToken, placeId,lang) => {
        try {
            const response = await fetch(`${HOST_URL}place-details?sessionToken=${sessionToken}&placeId=${placeId}&lang=${lang}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        }
    };
    

    const createAutocompleteItem = (prediction) => {
        const div = document.createElement('div');
        div.className = 'autocomplete-result';
        div.textContent = prediction.description;
        div.dataset.placeId = prediction.place_id;
        div.addEventListener('click', async () => {
            document.getElementById('useragencyupdateform-legaladdress').value = prediction.description;
            let lang = 'ru'
            if (/[\u0400-\u04FF]/.test(prediction.description)) {
                lang = 'ru'
                // console.log('ru')
                
            } else if (/[a-zA-Z]/.test(prediction.description)) {
                lang = 'en'
                // console.log('en')
            }
            resultsContainer.classList.remove('active');

            const sessionToken = document.getElementById('location-from-token').value;
            const placeDetails = await fetchPlaceDetails(sessionToken, prediction.place_id,lang);

            // console.log(placeDetails)

            fillFormFields(placeDetails);
            clearAutocompleteResults();
        });
        return div;
    };

    const fillFormFields = (details) => {
        // console.log(details)
        const addressComponents = details.address;
        const addressMapping = {
            street_number: '',
            route: '',
            locality: '',
            administrative_area_level_1: '',
            postal_code: ''
        };

        addressComponents.forEach(component => {
            const type = component.types[0];
            if (addressMapping[type] !== undefined) {
                addressMapping[type] = component.long_name;
            }
        });

        document.getElementById('useragencyupdateform-legaladdress').value = addressMapping.route;
        document.getElementById('useragencyupdateform-suit').value = addressMapping.street_number;
        document.getElementById('useragencyupdateform-city').value = addressMapping.locality;
        document.getElementById('useragencyupdateform-state').value = addressMapping.administrative_area_level_1;
        document.getElementById('useragencyupdateform-zipcode').value = addressMapping.postal_code;
    };

    const clearAutocompleteResults = () => {
        resultsContainer.innerHTML = '';
    };

    document.getElementById('useragencyupdateform-legaladdress').addEventListener('input', async function () {
        const input = this.value;
        
        if (input.length > 2) {
            const sessionToken = document.getElementById('location-from-token').value;
            const data = await fetchAutocomplete(input, sessionToken);

            resultsContainer.classList.add('active');
            clearAutocompleteResults();
            if (data.predictions.length > 0) {
                data.predictions.forEach(prediction => {
                    const item = createAutocompleteItem(prediction);
                    resultsContainer.appendChild(item);
                });
            }
        } else {
            clearAutocompleteResults();
        }
    });

    setCountryByIP();

    const fieldIds = [
        'useragencyupdateform-taxidentificationnumber',
        'useragencyupdateform-legalname',
        'useragencyupdateform-supervisorname',
        'useragencyupdateform-supervisorjobtitle',
        'useragencyupdateform-legaladdress',
        'useragencyupdateform-suit',
        'useragencyupdateform-city',
        'useragencyupdateform-state',
        'useragencyupdateform-zipcode',
        'useragencyupdateform-bankidentificationcode',
        'useragencyupdateform-bankname',
        'useragencyupdateform-bankaccount',
        'useragencyupdateform-routingnumber',
        'useragencyupdateform-accountnumber',
        'useragencyupdateform-website',
        'useragencyupdateform-travelbudget'
    ];

    function isVisible(element) {
        return window.getComputedStyle(element).display !== 'none';
    }

    function areFieldsFilled() {

        for (let id of fieldIds) {
            const field = document.getElementById(id);
            if (field) {

                if (isVisible(field.parentElement)) {
                    if (field.value.trim() === '') {
                        return false;
                    }
                }


            }
        }
        return true;
    }

    function toggleSubmitButton() {
        const submitButton = document.getElementById('user_update_submit');
        if (submitButton) {
            if (areFieldsFilled()) {
                submitButton.disabled = false;
            } else {
                submitButton.disabled = true;
            }
        }
    }

    fieldIds.forEach(id => {
        const field = document.getElementById(id);
        if (field) {
            field.addEventListener('input', toggleSubmitButton);
        }
    });

    toggleSubmitButton();

});
