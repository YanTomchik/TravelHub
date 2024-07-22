document.addEventListener('DOMContentLoaded', () => {
    // Инициализация select2
    $('#country-id').select2();

    const token = "dad0ce47c0043f8e93e60bfccf2170303f5a5c3b";
    const openCorporatesApiToken = "YOUR_OPENCORPORATES_API_KEY"; // Замените на ваш ключ API OpenCorporates

    const setCountryByIP = () => {
        fetch('https://ipinfo.io/json?token=0c80f44623564d')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                const countryCode = data.country;

                if (countryCode) {
                    const $countrySelect = $('#country-id');
                    if ($countrySelect.find(`option[value="${countryCode}"]`).length > 0) {
                        $countrySelect.val(countryCode).trigger('change.select2');
                        console.log("Country set to:", countryCode);
                    } else {
                        console.log("Country code not found in select options.");
                    }
                }
            })
            .catch(error => {
                console.error('Ошибка:', error);
            });
    };

    const fetchCompanyInfo = (country, taxId) => {
        let apiUrl;
        let options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            }
        };

        switch (country) {
            case 'BY':
                apiUrl = `https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party_by`;
                options.method = "POST";
                options.headers["Authorization"] = "Token " + token;
                options.body = JSON.stringify({query: taxId});
                break;
            case 'KZ':
                apiUrl = `https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party_kz`;
                options.method = "POST";
                options.headers["Authorization"] = "Token " + token;
                options.body = JSON.stringify({query: taxId});
                break;
            case 'RU':
                apiUrl = `https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party`;
                options.method = "POST";
                options.headers["Authorization"] = "Token " + token;
                options.body = JSON.stringify({query: taxId});
                break;
        }

        return fetch(apiUrl, options)
            .then(response => response.json())
            .then(result => result)
            .catch(error => console.log("error", error));
    };

    const autofillCompanyInfo = (data) => {
        if (data) {
            console.log(data);
            const country = $('#country-id').val();
            let dataCompany;

            if (country === 'BY' || country === 'RU' || country === 'KZ') {
                dataCompany = data.suggestions[0].data;
            } else {
                dataCompany = data.results.company;
            }

            let unpCompany;
            let addressCompany;
            let addressZipCode;
            let addressCityName;
            let addressStreetName;
            let addressStreetNumber;
            let companyName;
            let managerName;
            let managerPosition;

            if (country === 'BY') {
                unpCompany = dataCompany.unp;
                companyName = dataCompany.short_name_ru || '';
                addressCompany = dataCompany.address || '';
                addressZipCode = addressCompany.split(',')[0];
                addressCityName = addressCompany.split(',')[1];
                addressStreetName = addressCompany.split(',')[2];
                addressStreetNumber = addressCompany.split(',')[3];
                managerName = '';
                managerPosition = '';
            } else if (country === 'RU') {
                unpCompany = dataCompany.inn;
                companyName = dataCompany.name.short_with_opf || '';
                addressCompany = dataCompany.address.value || '';
                addressZipCode = addressCompany.split(',')[0];
                addressCityName = addressCompany.split(',')[1];
                addressStreetName = addressCompany.split(',')[2];
                addressStreetNumber = addressCompany.split(',')[3];
                managerName = dataCompany.management.name;
                managerPosition = dataCompany.management.post;
            } else if (country === 'KZ') {
                unpCompany = dataCompany.bin;
                companyName = dataCompany.name_ru || '';
                addressCompany = dataCompany.address_ru || '';
                addressZipCode = '';
                addressCityName = addressCompany.split(',')[0];
                addressStreetName = addressCompany.split(',')[2];
                addressStreetNumber = addressCompany.split(',')[3];
                managerName = dataCompany.fio;
                managerPosition = '';
            } else {
                unpCompany = dataCompany.company_number;
                companyName = dataCompany.name || '';
                addressCompany = dataCompany.registered_address_in_full || '';
                addressZipCode = '';
                addressCityName = addressCompany.split(',')[0];
                addressStreetName = addressCompany.split(',')[1];
                addressStreetNumber = '';
                managerName = dataCompany.directors.length > 0 ? dataCompany.directors[0].name : '';
                managerPosition = 'Director';
            }

            document.getElementById('useragencyupdateform-legalname').value = companyName;
            document.getElementById('useragencyupdateform-supervisorname').value = managerName;
            document.getElementById('useragencyupdateform-supervisorjobtitle').value = managerPosition;
            document.getElementById('useragencyupdateform-taxidentificationnumber').value = unpCompany;
            document.getElementById('useragencyupdateform-legaladdress').value = addressStreetName;
            document.getElementById('useragencyupdateform-zipcode').value = addressZipCode;
            document.getElementById('useragencyupdateform-suit').value = addressStreetNumber;
            document.getElementById('useragencyupdateform-cityname').value = addressCityName;
        }
    };

    setCountryByIP();

    document.getElementById('useragencyupdateform-taxidentificationnumber').addEventListener('change', (event) => {
        console.log(event.target.value);
        const taxId = event.target.value;
        const country = $('#country-id').val();
        fetchCompanyInfo(country, taxId).then(autofillCompanyInfo);
    });

    $('#country-id').on('change', function() {
        var selectedValue = $(this).val();
        console.log(selectedValue);
        if (selectedValue === 'US') {
            $('#stateField').show();
            $('#routingnumber').show();
            $('#accountnumber').show();

            $('#bank-swift').hide();
            $('#bank-iban').hide();
            $('#bank-name').hide();
            // $('#bank-info-state-change').classList
            // document.getElementById('bank-info-state-change').classList.remove('two');
            document.getElementById('bank-info-state-change').classList.add('inputs-boarding-wrapper')
            document.getElementById('bank-info-state-change').classList.add('two')
        } else {
            $('#stateField').hide();
            $('#routingnumber').hide();
            $('#accountnumber').hide();

            $('#bank-swift').show();
            $('#bank-iban').show();
            $('#bank-name').show();
            document.getElementById('bank-info-state-change').classList.remove('inputs-boarding-wrapper');
            document.getElementById('bank-info-state-change').classList.remove('two');
            // document.getElementById('bank-info-state-change').classList.add('two')
        }
    });

    const swiftInput = document.getElementById('useragencyupdateform-bankidentificationcode');
    const ibanInput = document.getElementById('useragencyupdateform-bankaccount');
    const bankNameInput = document.getElementById('useragencyupdateform-bankname');
    
    const apiKey = '90f49a0aedmsha80e2a2ae15e579p19e4aejsn88e68c780782';

    swiftInput.addEventListener('blur', () => validateSwift(swiftInput.value));
    swiftInput.addEventListener('blur', () => swiftInfo(swiftInput.value));
    ibanInput.addEventListener('blur', () => validateIban(ibanInput.value));

    async function validateSwift(swift) {
        if (swift) {
            const url = `https://iban-and-swift-details.p.rapidapi.com/api/v1/swift/validate?swift_code=${swift}`;
            
            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': apiKey,
                    'X-RapidAPI-Host': 'iban-and-swift-details.p.rapidapi.com'
                }
            };

            try {
                const response = await fetch(url, options);
                const data = await response.json();
                console.log(data)
                handleSwiftValidation(data);
            } catch (error) {
                console.error('Error validating SWIFT:', error);
            }
        }
    }

    async function swiftInfo(swift) {
        if (swift) {
            const url = `https://iban-and-swift-details.p.rapidapi.com/api/v1/swift?swift_code=${swift}`;
            
            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': apiKey,
                    'X-RapidAPI-Host': 'iban-and-swift-details.p.rapidapi.com'
                }
            };

            try {
                const response = await fetch(url, options);
                const data = await response.json();
                console.log(data)
                insertSwiftInfo(data);
            } catch (error) {
                console.error('Error validating SWIFT:', error);
            }
        }
    }

    async function validateIban(iban) {
        if (iban) {
            const url = `https://iban-and-swift-details.p.rapidapi.com/api/v1/iban/validate?iban_code=${iban}`;
            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': apiKey,
                    'X-RapidAPI-Host': 'iban-and-swift-details.p.rapidapi.com'
                }
            };

            try {
                const response = await fetch(url, options);
                const data = await response.json();
                handleIbanValidation(data);
            } catch (error) {
                console.error('Error validating IBAN:', error);
            }
        }
    }

    function insertSwiftInfo(data) {
        if(data.bank_name!=null){
            bankNameInput.value = data.bank_name    
        }
    }

    function handleSwiftValidation(data) {
        const feedback = swiftInput.nextElementSibling;
        console.log(feedback)
        console.log(data)
        if (data.Status == 'Valid') {
            feedback.textContent = 'SWIFT code is valid.';
            feedback.style.color = 'green';
            feedback.style.display = 'block';
        } else {
            feedback.textContent = 'SWIFT code is invalid.';
            feedback.style.color = 'red';
            feedback.style.display = 'block';
        }
    }

    function handleIbanValidation(data) {
        console.log(data)
        const feedback = ibanInput.nextElementSibling;
        if (data.Status == 'Valid') {
            feedback.textContent = 'IBAN is valid.';
            feedback.style.color = 'green';
            feedback.style.display = 'block';
        } else {
            feedback.textContent = 'IBAN is invalid.';
            feedback.style.color = 'red';
            feedback.style.display = 'block';
        }
    }

    function initAutocomplete() {
        var addressInput = document.getElementById('useragencyupdateform-legaladdress');
        var countrySelect = document.getElementById('country-id');
        var autocomplete = new google.maps.places.Autocomplete(addressInput);

        function setCountryRestriction() {
            var country = countrySelect.value;
            if (country) {
                autocomplete.setComponentRestrictions({'country': [country]});
            } else {
                autocomplete.setComponentRestrictions({'country': []});
            }
        }

        countrySelect.addEventListener('change', setCountryRestriction);
        setCountryRestriction();

        autocomplete.addListener('place_changed', function() {
            var place = autocomplete.getPlace();
            var addressComponents = place.address_components;
            console.log(addressComponents)

            var street_number = '';
            var city = '';
            var state = '';
            var zip = '';
            var street_name = '';

            for (var i = 0; i < addressComponents.length; i++) {
                var component = addressComponents[i];
                var types = component.types;

                if (types.includes('street_number')) {
                    street_number = component.long_name;
                }

                if (types.includes('route')) {
                    street_name = component.long_name;
                }

                if (types.includes('locality')) {
                    city = component.long_name;
                }

                if (types.includes('administrative_area_level_1')) {
                    state = component.short_name;
                }

                if (types.includes('postal_code')) {
                    zip = component.long_name;
                }
            }

            document.getElementById('useragencyupdateform-legaladdress').value = street_name;
            document.getElementById('useragencyupdateform-suit').value = street_number;
            
            document.getElementById('useragencyupdateform-cityname').value = city;
            document.getElementById('useragencyupdateform-state').value = state;
            document.getElementById('useragencyupdateform-zipcode').value = zip;
        });
    }

    google.maps.event.addDomListener(window, 'load', initAutocomplete);

});
