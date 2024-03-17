class FlightHandler {
    constructor() {
        this.adultCountElement = document.querySelector('#adult-counter');
        this.adultPlusButtonElement = document.querySelector('#adult-plus-button');
        this.adultMinusButtonElement = document.querySelector('#adult-minus-button');

        this.childrenCountElement = document.querySelector('#children-counter');
        this.childrenPlusButtonElement = document.querySelector('#children-plus-button');
        this.childrenMinusButtonElement = document.querySelector('#children-minus-button');

        this.infantCountElement = document.querySelector('#infant-counter');
        this.infantPlusButtonElement = document.querySelector('#infant-plus-button');
        this.infantMinusButtonElement = document.querySelector('#infant-minus-button');

        this.cabinClassElement = document.querySelector('#cabin-class');
        this.cabinClassText = document.querySelector('#tourists-select #cabin-class-text');

        this.selectTitleAdultsCountElement = document.querySelector('#tourists-select #adults');
        this.selectTitleChildrensCountElement = document.querySelector('#tourists-select #children');
        this.selectTitleChildrensText = document.querySelector('#tourists-select #children-text');
        this.selectTitleAdultsText = document.querySelector('#tourists-select #adults-text');

        this.selectDropdownElement = document.querySelector('#tourists-count-select-modal');
        this.countSelectButtonElement = document.querySelector('#tourists-select');

        this.childrenAgeBlockElement = document.querySelector('#children-age-block');
        this.childrenAgeTitleElement = document.querySelector('#children-age-title');

        this.adultCount = 1;
        this.childrenCount = 0;
        this.infantsCount = 0;
        this.cabinClass = 'economy';
        this.isCountDropdownOpen = false;

        this.assignEventHandlers();
    }

    calculatePeople(count) {
        let lastDigit = count % 10;
        let lastTwoDigits = count % 100;
        let word;

        if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
            word = 'пассажиров';
        } else if (lastDigit === 1) {
            word = 'пассажир';
        } else if (lastDigit >= 2 && lastDigit <= 4) {
            word = 'пассажира';
        } else {
            word = 'пассажиров';
        }

        return word;
    }

    setAdultCount() {
        let count = this.childrenCount + this.infantsCount + this.adultCount;
        this.adultCountElement.textContent = this.adultCount;
        this.selectTitleAdultsCountElement.textContent = count.toString();
        this.selectTitleAdultsText.textContent = this.calculatePeople(count);
    }

    handlePlusAdult() {
        this.adultCount += 1;
        this.setAdultCount();
    }

    handleMinusAdult() {
        this.adultCount -= 1;
        this.setAdultCount();
    }

    setChildrenCount() {
        let count = this.childrenCount + this.infantsCount + this.adultCount;
        this.childrenCountElement.textContent = this.childrenCount.toString();
        this.selectTitleAdultsCountElement.textContent = count.toString();
        this.selectTitleAdultsText.textContent = this.calculatePeople(count);
    }

    setInfantCount() {
        let count = this.childrenCount + this.infantsCount + this.adultCount;
        this.infantCountElement.textContent = this.infantsCount.toString();
        this.selectTitleAdultsCountElement.textContent = count.toString();
        this.selectTitleAdultsText.textContent = this.calculatePeople(count);
    }

    handlePlusChildren() {
        this.childrenCount += 1;
        this.setChildrenCount();
    }

    handleMinusChildren() {
        this.childrenCount -= 1;
        this.setChildrenCount();
    }

    handlePlusInfant() {
        this.infantsCount += 1;
        this.setInfantCount();
    }

    handleMinusInfant() {
        this.infantsCount -= 1;
        this.setInfantCount();
    }

    handleChangeCabinClass() {
        let value = document.querySelector("#cabin-class").value;
        if (value === 'economy') {
            this.cabinClassText.textContent = 'эконом';
        } else {
            this.cabinClassText.textContent = 'бизнес';
        }
    }

    hideSelectDropdownElement() {
        this.selectDropdownElement.style.visibility = 'hidden';
        this.isCountDropdownOpen = false;
    }

    assignEventHandlers() {
        this.adultCount = parseInt($("#adults-input").val());
        this.childrenCount = parseInt($("#children-input").val());
        this.infantsCount = parseInt($("#infants-input").val());
        this.cabinClass = $("#cabin-class").val();

        this.adultPlusButtonElement.addEventListener("click", (e) => {
            e.preventDefault();
            this.handlePlusAdult();
            this.saveOccupancyState();
        });

        this.adultMinusButtonElement.addEventListener("click", (e) => {
            e.preventDefault();
            if (this.adultCount <= 1) {
                return;
            }
            this.handleMinusAdult();
            this.saveOccupancyState();
        });

        this.childrenPlusButtonElement.addEventListener('click', (e) => {
            e.preventDefault();
            this.handlePlusChildren();
            this.saveOccupancyState();
        });

        this.childrenMinusButtonElement.addEventListener('click', (e) => {
            e.preventDefault();
            if (this.childrenCount <= 0) {
                return;
            }
            this.handleMinusChildren();
            this.saveOccupancyState();
        });

        this.infantPlusButtonElement.addEventListener('click', (e) => {
            e.preventDefault();
            this.handlePlusInfant();
            this.saveOccupancyState();
        });

        this.infantMinusButtonElement.addEventListener('click', (e) => {
            e.preventDefault();
            if (this.infantsCount <= 0) {
                return;
            }
            this.handleMinusInfant();
            this.saveOccupancyState();
        });

        $('#cabin-class').on('change', (e) => {
            this.handleChangeCabinClass();
        });

        this.countSelectButtonElement.addEventListener("click", (e) => {
            e.preventDefault();
            if (this.isCountDropdownOpen) {
                this.hideSelectDropdownElement();
                return;
            }

            this.selectDropdownElement.style.visibility = 'visible';
            this.isCountDropdownOpen = true;
        });

        $('.flight-route').on('change', function () {
            if ($(this).val() === 'one') {
                $('.flight-date').show();
                $('.flight-period').hide();
            } else {
                $('.flight-date').hide();
                $('.flight-period').show();
            }
        })

        let body = $('body');

        body.on('click', '.more-details-button', function () {
            $(this).parents('.result-item').toggleClass('opened');
        })

        body.on('input', '#filters input[type="range"]', (e) => {
            let target = $(e.target);
            let currencySign = $('#currency-sign').val();
            switch (target.attr('name')) {
                case 'minPrice':
                    $('#min-price').text(target.val() + currencySign);
                    break;
                case 'maxPrice':
                    $('#max-price').text(target.val() + currencySign);
                    break;
                case 'departureMin':
                    $('#min-departure').text(Math.floor(target.val() / 60).toString().padStart(2, '0') + ':' + (target.val() - Math.floor(target.val() / 60) * 60).toString().padStart(2, '0'));
                    break;
                case 'departureMax':
                    $('#max-departure').text(Math.floor(target.val() / 60).toString().padStart(2, '0') + ':' + (target.val() - Math.floor(target.val() / 60) * 60).toString().padStart(2, '0'));
                    break;
                case 'durationMin':
                    $('#min-duration').text(Math.floor(target.val() / 60).toString().padStart(2, '0') + ':' + (target.val() - Math.floor(target.val() / 60) * 60).toString().padStart(2, '0'));
                    break;
                case 'durationMax':
                    $('#max-duration').text(Math.floor(target.val() / 60).toString().padStart(2, '0') + ':' + (target.val() - Math.floor(target.val() / 60) * 60).toString().padStart(2, '0'));
                    break;
                case 'returnMin':
                    $('#min-return').text(Math.floor(target.val() / 60).toString().padStart(2, '0') + ':' + (target.val() - Math.floor(target.val() / 60) * 60).toString().padStart(2, '0'));
                    break;
                case 'returnMax':
                    $('#max-return').text(Math.floor(target.val() / 60).toString().padStart(2, '0') + ':' + (target.val() - Math.floor(target.val() / 60) * 60).toString().padStart(2, '0'));
                    break;
            }
        })

        body.on('change', '#filters input[type="range"]', (e) => {
            this.updateFilter();
        })

        body.on('change', '#filters input[type="radio"]', (e) => {
            this.updateFilter();
        })

        body.on('change', '#filters input[type="checkbox"]', (e) => {
            this.updateFilter();
        })

        body.on('click', '.common-pager-link', (e) => {
            this.updateFilter($(e.target).data('page'))
        })

        /*body.on('click', '.add-flight-cart-button', function () {
            $.ajax({
                type: 'POST',
                cache: false,
                url: HOST_URL + 'flights/add-to-cart',
                data: {
                    itemId: $(this).data('item'),
                    sessionId: $('#flight-session').data('session')
                },
                success: function () {
                    location.href = HOST_URL + 'basket';
                }
            });
        })*/
    }

    updateFilter(page = 1) {
        let resultList = $('.result-list');
        let minPrice = parseFloat($('input[name="minPrice"]').val());
        let maxPrice = parseFloat($('input[name="maxPrice"]').val());
        let filters = ['transfer', 'baggage', 'airline'];
        let filterValues = {};
        let filtersRanges = ['departure', 'return', 'duration'];
        let filtersRangesValues = {};

        filters.forEach(param => {
            let key = 0;
            filterValues[param] = {};
            $('input[data-name="' + param + '"]:checked').each(function () {
                filterValues[param][key] = $(this).val();
                key++;
            })
        });
        filtersRanges.forEach(param => {
            filtersRangesValues[param + 'Min'] = $('input[name="' + param + 'Min"]').val();
            filtersRangesValues[param + 'Max'] = $('input[name="' + param + 'Max"]').val();
        });

        $([document.documentElement, document.body]).animate({
            scrollTop: $(".result-list").offset().top - 150
        }, 500);

        $.ajax({
            type: "POST",
            url: '/flights/filter',
            data: {
                sessionId: $('#flight-session').data('session'),
                minPrice: minPrice,
                maxPrice: maxPrice,
                filters: filterValues,
                filtersRanges: filtersRangesValues,
                sortBy: $('.filter-sort-select').data('type'),
                page: page
            },
            success: function (result) {
                resultList.empty();
                resultList.append(result.content);
                $('.result-amount-text').text(translationsHub.found + ' ' + result.count + ' шт.');
            }
        });
    }

    saveOccupancyState() {
        const adults = parseInt(document.querySelector("#adult-counter").textContent);
        const children = parseInt(document.querySelector("#children-counter").textContent);
        const infants = parseInt(document.querySelector("#infant-counter").textContent);

        document.querySelector("#adults-input").value = adults;
        document.querySelector("#children-input").value = children;
        document.querySelector("#infants-input").value = infants;
    }
}

