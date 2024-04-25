const body = document.querySelector('#body')
const photoModal = document.querySelector('#photo-background')
const photoInModal = document.querySelector('#photo-modal')
const roomsBlock = document.querySelector('.info-block.rooms')

const initMap = (lat, lng) => {
    const myLatLng = { lat: lat, lng: lng };

    const map = new google.maps.Map(document.getElementById('map-canvas'), {
        center: myLatLng,
        zoom: 14
    });

    new google.maps.Marker({
        position: myLatLng,
        map,
        title: '',
    });

};

const openModal = ($modal) => {
    $modal.css('top', 0);
    $modal.css('left', 0);
}

const closeModal = ($modal) => {
    $modal.css('top', 'initial');
    $modal.css('left', '-20000px');
}

const isElementInViewport = (el) => {
    const rect = el.getBoundingClientRect();
    return (
        rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom > 0 &&
        rect.left < (window.innerWidth || document.documentElement.clientWidth) &&
        rect.right > 0
    );
}

const getNightsCountText = (nights = 0, rooms = 0) => {
    if (!nights) nights = nightsCount;
    if (!rooms) rooms = roomsCount;

    const lastDigit = nights % 10;
    const lastTwoDigits = nights % 100;

    var result;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
        result = `${nights} ${translationsHub['nightOther']}`;
    } else if (lastDigit === 1) {
        result = `${nights} ${translationsHub['night1']}`;
    } else if (lastDigit >= 2 && lastDigit <= 4) {
        result = `${nights} ${translationsHub['night2_4']}`;
    } else {
        result =`${nights} ${translationsHub['nightOther']}`;
    }

    if (rooms > 1) {
        const lastDigit = rooms % 10;

        if (lastDigit < 5) {
            result += `, ${rooms} ${translationsHub['room2_4']}`;
        } else {
            result += `, ${nights} ${translationsHub['roomOther']}`;
        }
    }

    return result;
};

var roomSliderData;
const getRoomDetails = (roomId, propertyId, rates, partner) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "GET",
            url: "/hotels/get-room-details",
            data: { roomId: roomId, propertyId: propertyId, rates: rates, partner: partner },
            dataType: "json",
            success: function(response) {
                if(response.result) {
                    resolve(response);
                } else {
                    reject('Ajax Request Error');
                }
            },
            error: function() {
                reject('Ajax Request Error');
            }
        });
    });
}


const galleryBlock = document.querySelector('.gallery-block');
const photosData = JSON.parse(galleryBlock.dataset.photos);
photosData.forEach((photo, index) => {
    const element = `<a data-fancybox="main-gallery" data-src="${photo.fullsize}" data-caption=""><img class="hotel-photo" data-src="${photo.preview}"></a>`;
    galleryBlock.insertAdjacentHTML('afterbegin', element);
});

const loadImage = (imgElement) => {
    if (!imgElement.style.backgroundImage && imgElement.hasAttribute('data-src') && isElementInViewport(imgElement)) {
        imgElement.style.backgroundImage = `url(${imgElement.getAttribute('data-src')})`;
    }
};

function processVisibleImages() {
    galleryBlock.querySelectorAll('.hotel-photo[data-src]').forEach(img => {
        loadImage(img);
    });
}

function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

const bookHotel = (propertyId, roomId, rateId, mealIds, rates, roomName, partner) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'POST',
            url: '/hotels/book',
            data: {
                propertyId: propertyId,
                roomId: roomId,
                rateId: rateId,
                mealIds: mealIds,
                rates: JSON.stringify(rates),
                roomName: roomName,
                checkinDate: checkinDate,
                checkoutDate: checkoutDate,
                occupancy: occupancy,
                partner: partner,
            },
            dataType: 'json',
            success: function(response) {
                if(response.result) {
                    resolve(response);
                } else {
                    reject('Ajax Request Error');
                }
            },
            error: function() {
                reject('Ajax Request Error');
            }
        });
    });
}


galleryBlock.addEventListener('scroll', processVisibleImages);
window.addEventListener('scroll', processVisibleImages);
window.addEventListener('resize', processVisibleImages);

processVisibleImages();


$(document).ready(function() {
    $(document).on('click', '.reserve-button', function() {
        const $this = $(this);
        const card = $('.price-opened').length ? $('.price-opened') : $this.closest('.hotel-number-card');
        const selectsBlock = card.find('.selects-block');
        let rate;
        let rates;
        const mealIds = [];

        if (card.find('input[type="radio"]').length) {
            const selectedRadio = card.find('.select-block input[type=radio]:checked');
            rates = card.data('rates');
            rate = selectedRadio.closest('.select-block').data('rate-id');
        } else {
            const selectedCheckboxes = card.find('input[type=checkbox]:checked');
            rates = card.data('meals');
            rate = card.data('base-rate');

            selectedCheckboxes.each(function() {
                mealIds.push($(this).parent().data('meal-id'));
            });
        }

        const roomId = card.data('id');
        const roomName = card.find('.room-title').text();
        const propertyId = $('.hotel-info-block').data('property-id');
        const partner = $('#partner').val();
        const resultMessage = card.find('.booking-msg');

        card.removeClass('reserved');
        resultMessage.removeClass('error-text').hide();

        bookHotel(propertyId, roomId, rate, mealIds, rates, roomName, partner)
            .then(() => {
                card.addClass('reserved');
                resultMessage.text(translationsHub.addedToCart).fadeIn();
                if ($('.price-opened').length) {
                    clearAndCloseModalDetails();
                }
                window.location.href = '/basket';
            })
            .catch(error => {
                card.addClass('reserved');
                resultMessage.addClass('error-text').text(translationsHub.errorHappened).fadeIn();
                console.error(error);
            });
    });

    function clearAndCloseModalDetails() {
        $('#price-details-modal .hotel-number-card, #more-details-modal .hotel-number-card').html('');
        closeModal($('#price-details-modal'));
        $('.owl-carousel-modal').owlCarousel('destroy');
        closeModal($('#more-details-modal'));
    }

    $('.open-map').on('click', function() {
        var lat = $(this).data('lat');
        var lng = $(this).data('lng');
        $.fancybox.open({
            src: '#map-canvas',
            type: 'inline',
            opts: {
                touch: false,
                afterLoad: function(instance, current) {
                    initMap(lat, lng);
                }

            }
        });
    });

    $('.info-switch-button').click(function() {
        if ($(this).hasClass('active')) {
            return;
        }

        var tab = $(this).data('tab');

        $('.info-switch-button').removeClass('active');
        $(this).addClass('active');

        $('.info-block').stop(true, true).fadeOut(400, function() {
            $('.info-block[data-content="' + tab + '"]').stop(true, true).fadeIn(400);
        });
    });


    var $moreDetailsModal = $('#more-details-modal');
    $('.details-block .more-details-button').click(function() {

        var $card = $(this).closest('.hotel-number-card');
        $card.addClass('price-opened')
        var detailsLoader = $card.find('.more-details-loader')

        detailsLoader.addClass('-loading');


        var checkedRateId = $card.find('input[type="radio"]:checked').parent().data('rate-id');
        var checkedMealId = $card.find('input[type="radio"]:checked').parent().data('meal-id');

        var roomId = $card.data('id');
        var rates = $card.data('cachekey');

        var priceHtml = $card.find('.price-info-block').clone();
        getRoomDetails(roomId, propertyId, rates, $('#partner').val())
            .then(function(response) {
                $('#more-details-modal .hotel-number-card').html(response.content);
                $('.owl-carousel-modal').owlCarousel({
                    items: 1,
//                    margin: 10,
                    nav: true
                });

                detailsLoader.removeClass('-loading');
                openModal($moreDetailsModal)
                priceHtml.appendTo('#more-details-modal .unit-options-block');

                $('#more-details-modal .cancellation-description-block').data('modal-content', $card.find('.cancellation-description-block').data('modal-content'));

                var $elem = $('#more-details-modal .select-block[data-rate-id="' + checkedRateId + '"][data-meal-id="' + checkedMealId + '"]');
                $elem.find('input').prop('checked', true);
            })
            .catch(function(error) {
                console.error('Ajax Request Error', error);
            });

    });

    $('#more-details-modal .close-modal-button').click(function() {
        $('.price-opened').removeClass('price-opened')

        $('.owl-carousel-modal').owlCarousel('destroy');
        $('#more-details-modal .hotel-number-card').html('');
        closeModal($moreDetailsModal);
    });


    $('.owl-carousel-room').owlCarousel({
        items: 1,
        margin: 10,
        nav: true
    });

    $('.select-block').click(function() {
        var checkbox = $(this).find('.checkbox');
        if (!checkbox.prop('checked')) {
          checkbox.prop('checked', true);
        }
    });

});

$('body').on('click', '.selects-block .select-block', function() {
    var $selectBlock = $(this);

    var $roomCard = $selectBlock.closest('.hotel-number-card');

    var $price = $roomCard.find('.price-block .price-card ins');
    var $priceTotal = $roomCard.find('.price-block .total-price-card span');
    var $priceNetto = $roomCard.find('.price-block .netto-price-card span');

    if ($roomCard.find('input[type="radio"]').length) {
        var rateId = $selectBlock.data('rate-id');
        var rates = Object.values($roomCard.data('rates-converted'));
        var newRate = rates.find(element => element.id == rateId);

        if (newRate) {
            $price.text(currencySign + newRate.priceNightlyExclusive);
            $priceTotal.text(currencySign + newRate.priceTotal);
            $priceNetto.text(currencySign + newRate.priceTotalInclusive);
        }
        if ($selectBlock.closest('#more-details-modal').length) {
            $('.info-block-rooms .select-block[data-rate-id="' + rateId + '"] input').trigger('click');
        }
    } else {
        var rateId = $selectBlock.parent().data('rate-id');
        if ($selectBlock.closest('#more-details-modal').length) {
            $roomCard = $('.info-block-rooms [data-rate-id="' + rateId + '"]').closest('.hotel-number-card');
        }

        var baserate = $roomCard.data('base-rate');
        var rates = $roomCard.data('meals');


        var totalSum = 0;
        var netSum = 0;
        var nightlySum = 0;

        $selectBlock.closest('.selects-block').find('.select-block').each(function() {
            var $checkbox = $(this).find('input[type="checkbox"]:checked');
            var mealId = $(this).data('meal-id');
            var rate = rates[mealId] ?? null;

            if ($checkbox.length && rate) {
                totalSum += parseFloat(rate.price);
                netSum += parseFloat(rate.inclusivePrice);
                nightlySum += parseFloat(rate.nightlyPrice);
            }
        });

        var nightlyPrice = baserate.priceNightlyExclusive + nightlySum;
        var priceTotal = baserate.priceTotal + totalSum;
        var priceNetto = baserate.priceTotalInclusive + netSum;

        $price.text(currencySign + nightlyPrice.toFixed());
        $priceTotal.text(currencySign + priceTotal.toFixed());
        $priceNetto.text(currencySign + priceNetto.toFixed());
        if ($selectBlock.closest('#more-details-modal').length) {
            mealId = $selectBlock.data('meal-id');
            $roomCard.find('[data-meal-id="' + mealId + '"] input').trigger('click');
        }
    }

});


$('body').on('click', '.switch-photo-button.left', function() {
    $(this).parent('.img-block').find('.owl-carousel').trigger('prev.owl.carousel');
})

$('body').on('click', '.switch-photo-button.right', function() {
    $(this).parent('.img-block').find('.owl-carousel').trigger('next.owl.carousel');
})

$('body').on('click', '.price-block .details-button', function() {
    var card = $(this).closest('.hotel-number-card');
    card.addClass('price-opened')

    var nightsCountText = getNightsCountText();
    var totalMealInclusive = 0;
    var totalMealExclusive = 0;
    var totalMealServiceFee = 0;
    var totalTaxesAndFees = 0;
    var totalPrice = 0;

    if (card.find('input[type="radio"]').length) {
        var rates = card.data('rates-converted');
        var currentRateId = $(this).data('rate-id');
        var currentRate = rates.find(function(element) {
            return element.id == currentRateId;
        });
    } else {
        if (card.closest('#more-details-modal').length) {
            var rate = card.data('rates');
            var rateId = rate.code;
            card = $('.info-block-rooms [data-rate-id="' + rateId + '"]').closest('.hotel-number-card');
        }

        var rates = card.data('meals');
        var currentRate = card.data('base-rate');

        card.find('.select-block').each(function() {
            var mealId = $(this).data('meal-id');
            var rate = rates[mealId] ?? null;
            if ($(this).find('input[type="checkbox"]:checked').length && rate) {
                totalMealInclusive += parseFloat(rate.inclusivePrice);
                totalPrice += parseFloat(rate.price);
                totalMealExclusive += parseFloat(rate.exclusivePrice);
                totalMealServiceFee += parseFloat(rate.serviceFee);
                totalTaxesAndFees += parseFloat(rate.taxesAndFeesPrice);
            }
        });
    }
    var priceTotalExclusive = (parseToFloat(currentRate.priceTotalExclusive) + parseFloat(totalMealExclusive)).toFixed();
    var priceTotal = (parseToFloat(currentRate.priceTotal) + parseFloat(totalPrice)).toFixed();
    var priceNetto = (parseToFloat(currentRate.priceTotalInclusive) + parseFloat(totalMealInclusive)).toFixed();
    var priceTotalTaxes = (parseToFloat(currentRate.priceTotalTaxes) + parseFloat(totalTaxesAndFees)).toFixed();
    var serviceFee = (parseToFloat(currentRate.serviceFee) + parseFloat(totalMealServiceFee)).toFixed();

    var admin = card.data('admin');

    var propertyFee = '';
    var propertyFees = '';
    var inclusivePrice = '';
    var deposit = '';

    if (parseFloat(currentRate.pricePropertyFees) > 0) {
        propertyFees = `
            <div class="price-row">
                <p>${translationsHub['hotelFeesPayOnSpot']}:</p><p> +${currencySign}${currentRate.pricePropertyFees ?? 0}</p>
            </div>
        `;
    }

    if (admin && priceNetto > 0) {
        inclusivePrice = `
            <div class="price-info-block">
                <div class="local-tax local-tax-netto">
                    <p>${translationsHub['netTotal']}</p>
                    <p>${currencySign}${priceNetto}</p>
                </div>
            </div>
        `;
    }

    if (parseFloat(currentRate.propertyFee) > 0) {
        propertyFee = `
            <div class="price-row">
                <p>${translationsHub['hotelFeesPayNow']}</p>
                <p>+ ${currencySign}${currentRate.propertyFee ?? 0}</p>
            </div>
        `;
    }

    if (parseFloat(currentRate.deposit) > 0) {
        deposit = `
            <div class="price-row">
                <p>Возвращаемый депозит: ${currentRate.depositCurrency} ${currentRate.deposit ?? 0}</p>
            </div>
        `;
    }

    var priceDetailsHtml = `
        <div class="hotel-number-card">
            <div class="price-info-block">
                <div class="price-row">
                    <p>${nightsCountText}</p>
                    <p>+ ${currencySign}${priceTotalExclusive}</p>
                </div>
                <div class="price-row">
                    <p>${translationsHub['taxesAndFees']}</p>
                    <p>+ ${currencySign}${priceTotalTaxes}</p>
                </div>
                ` + propertyFee + `
                <div class="price-row">
                    <p>${translationsHub['serviceFee']}</p>
                    <p>+ ${currencySign}${serviceFee}</p>
                </div>` + propertyFees +
            `</div>` + inclusivePrice +  `
            <div class="local-tax">
                <p>${translationsHub['total']}</p>
                <p>${currencySign}${priceTotal}</p>
            </div>` + deposit + `
            <div class="button-block">
                <button data-rate-id="${currentRate.id}" class="btn btn-primary reserve-button">${translationsHub['addToCart']}</button>
            </div>
        </div>
    `;

    $('#price-details-modal .hotel-number-card').html(priceDetailsHtml);
    openModal($('#price-details-modal'));
});

$('body').on('click', '#price-details-modal .close-modal-button', function() {
    $('.price-opened').removeClass('price-opened')

    $('#price-details-modal .hotel-number-card').html('');
    closeModal($('#price-details-modal'));

});

$('body').on('click', '.cancellation-description-block', function() {
    var content = $(this).data('modal-content');

    $('.cancel-policies>div').html(content);
    openModal($('#cancel-policies-modal'));
});

$('body').on('click', '#cancel-policies-modal .close-modal-button', function() {
    $('.cancel-policies>div').html('');
    closeModal($('#cancel-policies-modal'));
});


$('body').on('click', '.taxes-description-block', function() {
    openModal($('#taxes-info-modal'));
});

$('body').on('click', '#taxes-info-modal .close-modal-button', function() {
    closeModal($('#taxes-info-modal'));
});


// reviews loading
let ajaxRequest;

const reviewsList = $('.reviews-list');
const reviewsLoader = $('.reviews-loader');

function getReviews() {
    if (!reviewsList.length ) {
        return null;
    }

    reviewsLoader.addClass('loading');

    ajaxRequest = $.ajax({
        url: '/hotels/get-property-reviews',
        method: 'GET',
        data: { propertyId: propertyId, offset: $('.review-block .card').length },
        success: function(result) {
            if (result.result) {
                if (result.content) {
                    reviewsList.append(result.content);
                } else {
                    $(window).off('scroll');
                }
            }

            reviewsLoader.removeClass('loading');
            ajaxRequest = null;
        },
        error: function(jqXHR, textStatus, errorThrown) {
            if (textStatus !== 'abort') {
                ajaxRequest = null;

                reviewsLoader.removeClass('loading');

                console.error('Error:', textStatus, errorThrown);
            }
        }
    });
}

function checkScrollForReviews() {
    if (ajaxRequest) {
        return;
    }

    let totalHeight = document.documentElement.scrollHeight;
    let visibleHeight = document.documentElement.clientHeight;
    let scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

    let buffer = 200;

    if (scrollPosition + visibleHeight >= totalHeight - buffer) {
        getReviews();
    }
}

//if (reviewsList.length && $('.reviews-list .card').length > 4) {
    getReviews();
    $(window).on('scroll', checkScrollForReviews);
//}


function parseToFloat(value) {
    if (typeof value === 'string') {
        value = value.replace(/,/g, '').replace('.', '.');
    }
    return parseFloat(value) || 0;
}
