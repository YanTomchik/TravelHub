"use strict";
// Class definition
var searchDatatable = $('#search_datatable');
var KTDatatableSearch = function () {
    // basic demo
    var dt;
    var options = {
        // datasource definition
        data: {
            type: 'remote',
            source: {
                read: {
                    url: HOST_URL + 'tours/search-tours',
                    map: function (raw) {
                        // sample data mapping
                        var dataSet = raw;
                        if (typeof raw.data !== 'undefined') {
                            dataSet = raw.data;
                        }
                        return dataSet;
                    },
                },
            },
            pageSize: 50,
            saveState: false,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
        },

        layout: {
            scroll: true
        },

        // column sorting
        sortable: false,

        pagination: true,

        // columns definition
        columns: [
            {
                field: 'tour',
                title: translationsHub.tour,
                overflow: 'visible',
                width: 150,
                autoHide: false,
                template: function (row) {
                    return '<span>' + row.tour + '</span>';
                }
            }, {
                field: 'departure',
                title: translationsHub.dates,
                overflow: 'visible',
                width: 140,
                autoHide: false,
                template: function (row) {
                    return '<div>' + row.departure + '</div>' +
                        '<div>' + row.arrival + '</div>';
                }
            }, {
                field: 'nights',
                title: translationsHub.nights,
                overflow: 'visible',
                width: 50,
                autoHide: false,
                template: function (row) {
                    return '<span>' + row.nights + '</span>';
                }
            }, {
                field: 'allocation',
                title: translationsHub.hotel,
                overflow: 'visible',
                width: 250,
                autoHide: false,
                template: function (row) {
                    return '<div>' +
                        '<span class="tour-dot tour-dot-green"></span>' + row.allocation +
                        '</div>';
                }
            }, {
                field: 'meal',
                title: translationsHub.roomAndMeal,
                overflow: 'visible',
                width: 180,
                autoHide: false,
                template: function (row) {
                    return '<div>' + row.roomType + '</div> ' +
                        (row.meal.length ? '<div><span class="tour-breakfast">' + row.meal + '</span></div>' : '');
                }
            }, {
                field: 'regular',
                title: translationsHub.fly,
                overflow: 'visible',
                width: 130,
                autoHide: false,
                template: function (row) {
                    return '<div class="tour-table-td-center"><span class="tour-dot ' + row.regularClass + '"></span>' +
                        '<a style="width: 100%;" class="tour-fly-info" data-variants="' + row.variants + '" href="#">' + row.regular + '</a>' +
                        '</div>';
                }
            }/*, {
                field: 'discount',
                title: translationsHub.discount,
                overflow: 'visible',
                width: 80,
                autoHide: false,
                template: function (row) {
                    return '<div class="tour-table-td-center"></div>';
                }
            }*/, {
                field: 'quiquo',
                title: '',
                overflow: 'visible',
                width: 50,
                autoHide: false,
                template: function (row) {
                    var variants = atob(row.variants);
                    var variantsJson = JSON.parse(variants);
                    var adultsCount = variantsJson.adults || 0;
                    var childrenCount = variantsJson.childrenCount || 0;
                    var childAges = row.childAges;
                    var region = row.region || "";
                    var country = row.country || "";

                    var dates = $('#toursearchform-fixperiod').val().split(' - ');
                    var startDate = dates[0] ?? '';
                    var endDate = dates[1] ?? '';

                    return '<div class="qq-btn-place" data-value=\'{' +
                        '"nights":"' + row.nights +
                        '","hotelName":"' + row.allocation +
                        '", "checkinDt":"' + variantsJson.tourDate +
                        '", "roomType":"' + row.roomType +
                        '", "boardType":"' + row.meal +
                        '", "operator":"Travelhub", "price":' + parseInt(row.price.replace(/,/g, "")) +
                        ', "currency":"' + row.currency + '", "cityFrom":"' + row.cityFrom +
                        '", "adultsCount":' + adultsCount +
                        ', "childrenCount":' + childrenCount +
                        ', "childAges":"' + childAges +
                        '", "region":"' + region +
                        '", "country":"' + country +
                        '", "flight":' + JSON.stringify(row.flightInfo) +
                        '}\'></div>';
                }
            }, {
                field: 'action',
                title: translationsHub.prices,
                overflow: 'visible',
                width: 160,
                autoHide: false,
                template: function (row) {
                    return '<a style="width: 100%;" class="btn btn-primary search-variants" data-nights="' + row.nights + '" data-variants="' + row.variants + '" href="#">от ' + row.price + '</a>';
                }
            },
        ],

    };
    var tours = function () {
        dt = searchDatatable.KTDatatable(options);

        $('.search-btn').on('click', function (e) {
            var childrenCount = parseInt($('#children-count').val());
            var childAges = [];
            if (childrenCount > 0) {
                for (var i = 1; i <= childrenCount; i++) {
                    childAges.push($('.children-age-select[name="TourSearchForm[childAges][' + i + ']"').val());
                }
            }

            var hotels = [];
            $('.option-hotel input:checked').each(function () {
                hotels.push($(this).val());
            });

            var resorts = [];
            $('.option-resort input:checked').each(function () {
                resorts.push($(this).val());
            });

            searchDatatable.search({
                cities: $('#cities').val(),
                countryId: $('#country-id').val(),
                nights: $('#nights').val(),
                fixPeriod: $('#toursearchform-fixperiod').val(),
                adults: $('#adults-count').val(),
                children: childrenCount,
                childAges: childAges,
                priceFrom: $('#toursearchform-pricefrom').val(),
                priceTo: $('#toursearchform-priceto').val(),
                currency: $('#toursearchform-currency').val(),
                resorts: resorts,
                hotels: hotels,
                category: $('#toursearchform-category').val(),
                meal: $('#toursearchform-meal').val(),
                tourType: $('#toursearchform-tourtype').val(),
                noRegular: $('#toursearchform-noregular').val()
            }, 'data');
        })

        dt.on('datatable-on-ajax-done', function (e, data) {
            $('.search-preloader').hide();
            $('.search-results').show();
        });
    };

    return {
        // public functions
        init: function () {
            tours();
        },
        reload: function () {
            $('#search_datatable').KTDatatable().reload();
        },
        redraw: function () {
            $('#search_datatable').KTDatatable().redraw();
        }
    };
}();

jQuery(document).ready(function () {
    var body = $('body');

    if (searchDatatable.length) {
        KTDatatableSearch.init();
    }

    body.on('click', '#show-my-cards', function () {
        $('#payments-list-cards').addClass("active");
        $('#payment-add-new').removeClass("active");
        $('#show-my-cards').hide();
        $('#show-form-new-card').css('display', 'flex');
    })

    body.on('click', '#show-form-new-card', function () {
        $('#payment-add-new').addClass("active");
        $('#payments-list-cards').removeClass("active");
        $('#show-form-new-card').hide();
        $('#show-my-cards').css('display', 'flex');
    })

    body.on('click', '.copy-search-link', function () {
        var childrenCount = parseInt($('#children-count').val());
        var childAges = [];
        if (childrenCount > 0) {
            for (var i = 1; i <= childrenCount; i++) {
                childAges.push($('.children-age-select[name="TourSearchForm[childAges][' + i + ']"').val());
            }
        }

        var hotels = [];
        $('.option-hotel input:checked').each(function () {
            hotels.push($(this).val());
        });

        var resorts = [];
        $('.option-resort input:checked').each(function () {
            resorts.push($(this).val());
        });

        $('#search-link').val(HOST_URL
            + '?cityId=' + $('#cities').val()
            + '&countryId=' + $('#country-id').val()
            + '&nights=' + $('#nights').val().join(',')
            + '&fixPeriod=' + $('#toursearchform-fixperiod').val().replace(' - ', ';')
            + '&adults=' + $('#adults-count').val()
            + '&children=' + childrenCount
            + '&childAges=' + childAges.join(',')
            + '&priceFrom=' + $('#toursearchform-pricefrom').val()
            + '&priceTo=' + $('#toursearchform-priceto').val()
            + '&currency=' + $('#toursearchform-currency').val()
            + '&hotels=' + hotels.join(',')
            + '&resorts=' + resorts.join(',')
            + '&category=' + $('#toursearchform-category').val().join(',')
            + '&meal=' + $('#toursearchform-meal').val().join(',')
            + '&tourType=' + $('#toursearchform-tourtype').val().join(',')
        )

        $('#copySearchLinkModal').modal('show');

        return false;
    })

    var searchCopyTimeout;
    body.on('click', '#search-copy', function () {
        clearTimeout(searchCopyTimeout);
        $('#search-link').select();
        $('#search-copy').addClass('btn-success');
        document.execCommand('copy');
        document.getSelection().removeAllRanges();
        $('#search-copy span').text(translationsHub.linkCopied);
        searchCopyTimeout = setTimeout(function () {
            $('#search-copy span').text(translationsHub.linkCopy);
            $('#search-copy').removeClass('btn-success');
        }, 6000);
    })

    body.on('change', 'input[name="accommodation"]', function () {
        location.href = HOST_URL + $(this).val();
    })

    body.on('change', 'input.flight-rate-change', function () {
        $.ajax({
            type: 'POST',
            cache: false,
            url: HOST_URL + 'flights/change-rate',
            data: {
                id: $(this).data('id'),
                rateId: $(this).val()
            },
            success: function (response) {
                location.reload();
            }
        });
    })

    body.on('click', '.search-variants', function () {
        var modalBlock, modalBlockBodyClass, url, id;
        modalBlock = $('#priceVariantsFormModal');
        modalBlockBodyClass = '#priceVariantsFormModal .modal-body';

        if ($(this).data('id') && document.body.offsetWidth > 1154) {
            modalBlock.addClass('desktop');
        } else {
            modalBlock.removeClass('desktop');
        }

        KTApp.block(modalBlockBodyClass, {
            overlayColor: '#000000',
            state: 'primary',
            message: 'Загрузка...'
        });

        // Add response in Modal body
        $(modalBlockBodyClass).html('');

        // Display Modal
        modalBlock.modal('show');

        $.ajax({
            type: 'POST',
            cache: false,
            url: HOST_URL + 'tours/variants',
            data: {
                variants: $(this).data('variants'),
                nights: $(this).data('nights')
            },
            success: function (response) {
                KTApp.unblock(modalBlockBodyClass);

                // Add response in Modal body
                $(modalBlockBodyClass).html(response);
            }
        });

        return false;
    })

    body.on('click', '.tour-fly-info', function () {
        var modalBlock, modalBlockBodyClass, url, id;
        modalBlock = $('#priceFlyInfoModal');
        modalBlockBodyClass = '#priceFlyInfoModal .modal-body';

        if ($(this).data('id') && document.body.offsetWidth > 1154) {
            modalBlock.addClass('desktop');
        } else {
            modalBlock.removeClass('desktop');
        }

        KTApp.block(modalBlockBodyClass, {
            overlayColor: '#000000',
            state: 'primary',
            message: 'Загрузка...'
        });

        // Add response in Modal body
        $(modalBlockBodyClass).html('');

        // Display Modal
        modalBlock.modal('show');

        $.ajax({
            type: 'POST',
            cache: false,
            url: HOST_URL + 'tours/fly-info',
            data: {
                variants: $(this).data('variants')
            },
            success: function (response) {
                KTApp.unblock(modalBlockBodyClass);

                // Add response in Modal body
                $(modalBlockBodyClass).html(response);
            }
        });

        return false;
    })

    body.on('change', '#children', function () {
        var childCount = parseInt($(this).val());

        $('.child-ages-item').hide();

        if (childCount > 0) {
            $('.child-ages-items').show();
            for (var i = 1; i <= childCount; i++) {
                $('.child-ages-item[data-children="' + i + '"]').show();
            }
        } else {
            $('.child-ages-items').hide();
        }
    })

    body.on('change', '#agent_discount', function () {
        if (parseInt($(this).val()) >= 0 && parseInt($(this).val()) <= 8) {
            var agentCommission = parseInt($('.agent-commission').data('commission'));
            var agentDiscount = parseInt($(this).val());
            var price = parseInt($('.tour-price').data('value'));
            var priceNet = parseInt($('.tour-price-net').data('value'));
            var newAgentCommission = Math.floor(price * (agentCommission - agentDiscount) / 100);
            $('.agent-commission span').text(newAgentCommission);
            $('.tour-price span').text(Math.round(priceNet + newAgentCommission));
        }
    })

    $('.search-btn').click(function () {
        var loader = $('.search-preloader');
        loader.show();
        $('.landing-top-route').hide();
        $('.langing-about').hide();
        $('.search-results').hide();
        $('.langing-subscribe').hide();
        $('.landing-mobile-apps').hide();
        moveTourSearchProgress();
        $([document.documentElement, document.body]).animate({
            scrollTop: loader.offset().top - 100
        }, 100);
    });

    $('.tour-search-form').on('submit', function (e) {
        e.preventDefault();
    })

    $('.service-basket-form-submit').on('click', function (e) {
        e.preventDefault();

        $('.basket-preloader-wrapper').show();

        $.ajax({
            type: 'POST',
            cache: false,
            url: HOST_URL + 'site/check-actual-cart',
            success: function (response) {
                var data = JSON.parse(response);
                $('.basket-preloader-wrapper').hide();
                if (data.error) {
                    $('#basketActualChangeModal .modal-body').html(data.view);
                    $('#basketActualChangeModal').modal('show');
                } else {
                    $('.basket-preloader-booking-wrapper').show();

                    $('#service-basket-form').trigger('submit');
                }
            }
        });
    })

    body.on('click', '.cart-hotel-checkin-info', function () {
        $('.cartCheckinInfoModal[data-id=' + $(this).data('id') + ']').modal('show');
    })

    body.on('click', '.cart-fly-rate-info', function (e) {
        e.preventDefault();
        $('.cartRateInfoModal[data-id=' + $(this).data('id') + ']').modal('show');
    })

    body.on('click', '.cart-accordion-row', function () {
        $(this).toggleClass('active')
    })

    var cartTimer = $('.cart-timer-value');
    if (cartTimer.length) {
        var expired = cartTimer.data('value');
        var timestamp = cartTimer.data('now');

        setInterval(function () {
            timestamp++;
            var time = expired - timestamp;

            if (time <= 0) {
                $.ajax({
                    type: 'POST',
                    cache: false,
                    url: HOST_URL + 'site/clear-cart',
                    success: function (response) {
                        location.reload();
                    }
                });
            }

            var minutes = Math.floor(time / 60);
            var seconds = time - minutes * 60;
            cartTimer.text(minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0'));
        }, 1000);
    }

    $('.basket-actual-change-approve').on('click', function (e) {
        ('#service-basket-form').trigger('submit');
    });

    body.on('click', '.basket-item-info-link', function () {
        if ($(this).parent().parent().find('.basket-item-info-block').hasClass('active')) {
            $(this).text(translationsHub.moreDetails);
        } else {
            $(this).text(translationsHub.collapse);
        }
        $(this).parent().parent().find('.basket-item-info-block').toggleClass('active');
    });

    body.on('click', '.clear-basket', function () {
        $.ajax({
            type: 'POST',
            cache: false,
            url: HOST_URL + 'site/clear-cart',
            success: function () {
                location.reload();
            }
        });
    })
});

var i = 0;
var intervalId;

function moveTourSearchProgress() {
    i = 1;
    var elem = document.getElementById("progress");
    var width = 0;
    if (intervalId) {
        clearInterval(intervalId);
        elem.innerHTML = width + "%";
    }
    intervalId = setInterval(frame, 300);

    function frame() {
        if (width >= 100) {
            clearInterval(intervalId);
            $('.search-preloader').hide();
            $('.search-results').show();
            i = 0;
        } else {
            width++;
            elem.innerHTML = width + "%";
        }
    }
}
