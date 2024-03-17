/**
 * Created by Matthew Patell on 2017-06-04.
 */

/**
 * Is mobile or tabled device
 * Solution on StackOverflow.
 *
 * @returns {boolean}
 */
window.mobileAndTabletCheck = function () {
    var check = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
            check = true;
        }
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

$(function () {
    $('body').on('keypress', '#days-of-week', function (e) {
        var charCode = (e.which) ? e.which : event.keyCode
        var value = $(this).val();
        var number = parseInt(String.fromCharCode(charCode));
        var valueArray = value.split("");
        if (number >= 1 && number <= 7) {
            console.log(value);
            console.log(value[number - 1]);
            if (valueArray[number - 1] === '.') {
                valueArray[number - 1] = number;
            } else {
                valueArray[number - 1] = '.';
            }
            value = valueArray.join('');

            $(this).val(value);
        }
    })

    /**
     * Checkbox user settings save
     */
    $('[data-setting]').change(function () {
        var element = $(this);

        saveUserSettings(element.data('setting'), element.prop('checked'));
    });

    /**
     * Toggle collapse left menu
     */
    $('.left-menu-collapse').click(function () {

        var checkbox = $('[data-setting="toggleLeftMenu"]');

        checkbox
            .prop('checked', !checkbox.prop('checked'))
            .change();

        $('body').toggleClass('aside-collapsed');
    });

    $('.navigation-block').on('click', function () {
        if ($(this).hasClass('navigation-toggle')) {
            $(this).removeClass('navigation-toggle');
        } else {
            $(this).addClass('navigation-toggle');
        }
    });

    if ($('#preview-comment').length) {
        $('#preview-comment').maxlength({
            threshold: 1000,
            limitReachedClass: "label label-danger label-rounded label-inline",
            warningClass: "label label-primary label-rounded label-inline"
        });
    }

    $('#kt_aside_mobile_toggle').on('click', function () {
        $('.header-menu-items').toggleClass('d-flex');
        $('.header-right-block .dropdown').toggle();
        $('.header-btn-line').toggle();
    })

    $('#kt_form').on('change', '.option-control input[type=radio]', function () {
        $('#kt_form .option').addClass('disable');
        $(this).parents('.option').removeClass('disable');
    });

    $('#kt_planner_form').on('click', '.planner-button', function () {
        var dateBlock = $('.planner-date-block');
        dateBlock.toggle();

        return false;
    });

    $('#user_update_form').on('change', '.option-control input[type=radio]', function () {
        $('#user_update_form .option').addClass('disable');
        $(this).parents('.option').removeClass('disable');
    });

    /**
     * Toggle user block
     */
    $('#user-block-toggle').click(function () {
        var value = $('#user-block').hasClass('in');

        saveUserSettings('userBlock', !value);
    });

    /**
     * Save changed user theme
     */
    $('[name="setting-theme"]').change(function () {
        var value = $('[name="setting-theme"]:checked').parent().data('load-css');

        saveUserSettings('userTheme', value, false);
    });

    $('#saveFilterSearchTours .back-btn').click(function (e) {
        $('#saveFilterSearchTours .popup').addClass('continue-popup-block');
    });

    $('.user-filter-form-preloader').click(function () {
        KTApp.block('.user-filter-form', {
            overlayColor: '#000000',
            state: 'primary',
            message: MAIN_LANGUAGE === 'en' ? 'Saving...' : 'Сохранение...'
        });

        setTimeout(function () {
            if (!$('.user-filter-form .form-group').hasClass('has-error')) {
                KTApp.block('.user-filter-form', {
                    overlayColor: '#000000',
                    state: 'primary',
                    message: MAIN_LANGUAGE === 'en' ? 'Saving...' : 'Сохранение...'
                });

                setTimeout(function () {
                    KTApp.unblock('.user-filter-form');
                }, 30000);
            } else {
                KTApp.unblock('.user-filter-form');
            }
        }, 100);
    });

    $('.user-compilation-form-preloader').click(function () {
        KTApp.block('.compilation-form', {
            overlayColor: '#000000',
            state: 'primary',
            message: MAIN_LANGUAGE === 'en' ? 'Selection...' : 'Подборка...'
        });

        setTimeout(function () {
            if (!$('.user-filter-form .form-group').hasClass('has-error')) {
                KTApp.block('.compilation-form', {
                    overlayColor: '#000000',
                    state: 'primary',
                    message: MAIN_LANGUAGE === 'en' ? 'Selection...' : 'Подборка...'
                });

                setTimeout(function () {
                    KTApp.unblock('.compilation-form');
                }, 30000);
            } else {
                KTApp.unblock('.compilation-form');
            }
        }, 100);
    });

    var i = 0;
    var intervalId;

    function moveFilterProgress() {
        if (i === 0) {
            i = 1;
            var elem = document.getElementById("myBar");
            var width = 0;
            intervalId = setInterval(frame, 200);

            function frame() {
                if (width >= 100) {
                    clearInterval(intervalId);
                    i = 0;
                    $('#myProgress span').text(MAIN_LANGUAGE === 'en' ? 'Wait a little we check the availability of goods' : 'Подождите еще немного, идёт поиск туров...').show();
                    $('#myBar').hide();
                } else {
                    width++;
                    elem.style.width = width + "%";
                    elem.innerHTML = width + "%";
                }
            }
        }
    }

    var slideIndex = 1;
    if ($('.planner-slider').length) {
        showDivs(slideIndex);
    }

    function plusDivs(n) {
        showDivs(slideIndex += n);
    }

    function showDivs(n) {
        var i;
        var x = document.getElementsByClassName("planner-slider-image");
        if (n > x.length) {
            slideIndex = 1
        }
        if (n < 1) {
            slideIndex = x.length
        }
        for (i = 0; i < x.length; i++) {
            x[i].style.display = "none";
        }
        x[slideIndex - 1].style.display = "block";
    }

    $('.planner-slider-icon').click(function () {
        if ($(this).hasClass('planner-slider-icon-left')) {
            plusDivs(-1);
        } else {
            plusDivs(1);
        }
    });

    $('.user-filter-form-check').click(function () {
        $('#myProgress span').hide();
        $('#myBar').show();

        moveFilterProgress();
    });

    $('#kt_filter_check_submit').on('click', function (e) {
        $('#filter-check').val(true);

        $(".user-filter-form").trigger('submit');

        e.preventDefault();
    })

    $('#kt_filter_submit').on('click', function (e) {
        console.log('kt-filter-submit');
        $('#filter-check').val(false);

        $(".user-filter-form").trigger('submit');

        e.preventDefault();
    })

    $('#kt_compilation_submit').on('click', function (e) {
        $(".compilation-form").trigger('submit');

        e.preventDefault();
    })

    var userFilterForm = $(".user-filter-form");
    userFilterForm.on('beforeValidate', function () {
        return false; // Если вернуть false, то форма не будет отправлена
    })
    userFilterForm.submit(function (e) {
        $(".form-group").removeClass("has-error");      //remove error class
        $(".help-block").html("");                      //remove existing error messages

        var form_data = $(this).serialize();
        var action_url = $(this).attr("action");

        $.ajax({
            method: "POST",
            url: action_url,
            data: form_data
        })
            .done(function (rawData) {
                var data = JSON.parse(rawData);
                if (data.success == true) {       //data saved successfully
                    if (data.redirect !== undefined) {
                        location.href = data.redirect;
                    } else if (data.variants !== undefined) {
                        $('#myBar').hide();
                        if (!data.variants) {
                            $('#myProgress span').text(MAIN_LANGUAGE === 'en' ? 'Looks good, but there are no products. Try changing the settings.' : 'Выглядит неплохо, но туров нет. Попробуйте изменить параметры.').show();
                        } else {
                            $('#myProgress span').text(MAIN_LANGUAGE === 'en' ? 'Everything is ok, there are more than ' + data.variants + ' products' : 'Все ок, есть больше ' + data.variants + ' туров').show();
                        }
                        clearInterval(intervalId);
                        i = 0;
                    }
                } else {
                    //validation errors occurred
                    KTApp.unblock('.user-filter-form');
                    $.each(data.error, function (ind, vl) {
                        //show errors to user
                        var field = $(".field-filter-" + ind);
                        field.addClass("has-error");
                        field.find(".help-block").html(vl[0]);
                    });
                    $('html, body').animate({
                        scrollTop: $('.has-error').offset().top
                    }, 2000);
                }
            });

        return false;
    });

    var userNewFilterForm = $(".user-new-filter-form");
    userNewFilterForm.on('beforeValidate', function () {
        return false; // Если вернуть false, то форма не будет отправлена
    })
    userNewFilterForm.submit(function (e) {
        $(".form-group").removeClass("has-error");      //remove error class
        $(".help-block").html("");                      //remove existing error messages

        var form_data = $(this).serialize();
        var action_url = $(this).attr("action");

        var showButtonsTimeout = setTimeout(function () {
            $('#saveFilterSearchTours .popup').addClass('error-popup-block');
            $('.common-mistake').hide();
        }, 20000);

        $.ajax({
            method: "POST",
            url: action_url,
            data: form_data
        })
            .done(function (rawData) {
                clearTimeout(showButtonsTimeout);
                $('#saveFilterSearchTours .popup').removeClass('error-popup-block');
                var data = JSON.parse(rawData);
                if (data.success == true) {       //data saved successfully
                    if (data.redirect !== undefined) {
                        location.href = data.redirect;
                    } else if (data.variants !== undefined) {
                        if (!data.variants) {
                            $('#saveFilterSearchTours .popup-title').text(MAIN_LANGUAGE === 'en' ? 'No products ⛔' : 'Туров нет ⛔');
                            $('#saveFilterSearchTours .popup-info').text(MAIN_LANGUAGE === 'en' ? 'Sorry, no tours were found matching your criteria. Common mistakes:' : 'К сожалению, по вашим параметрам туров не найдено. Частые ошибки:');
                            $('#saveFilterSearchTours .popup').addClass('error-popup-block');
                            $('.common-mistake').show();
                            $('#saveFilterSearchTours #loading').hide();
                        } else {
                            $('#saveFilterSearchTours .popup-title').text(MAIN_LANGUAGE === 'en' ? 'Saving... 🤓' : 'Сохранение 🤓');
                            $('#saveFilterSearchTours .popup-info').text(MAIN_LANGUAGE === 'en' ? 'Everything is great, we found more than ' + data.variants + ' products, it remains to save your autopilot settings' : 'Все отлично, мы нашли больше ' + data.variants + ' туров, осталось сохранить ваши настройки фильтра')
                            $('#myProgress span').text(MAIN_LANGUAGE === 'en' ? 'Everything is ok, there are more than  ' + data.variants + ' products' : 'Все ок, есть больше ' + data.variants + ' туров').show();
                            $('#saveFilterSearchTours .popup').removeClass('error-popup-block');
                            $('#saveFilterSearchTours #loading').show();
                            $('.common-mistake').hide();

                            $('#filter-check').val(false);
                            if (!$('#saveFilterSearchTours .popup').hasClass('continue-popup-block')) {
                                $(".user-new-filter-form").trigger('submit');
                            }
                        }
                        clearInterval(intervalId);
                        i = 0;
                    }
                } else {
                    $.each(data.error, function (ind, vl) {
                        //show errors to user
                        var field = $(".field-filter-" + ind);
                        field.addClass("has-error");
                        field.find(".help-block").html(vl[0]);
                    });
                    $('html, body').animate({
                        scrollTop: $('.has-error').offset().top
                    }, 2000);
                }
            });

        return false;
    });

    $('.preloader-theme-post').click(function () {
        KTApp.block('#colorChoosePostModal .modal-content', {
            overlayColor: '#000000',
            state: 'primary',
            message: MAIN_LANGUAGE === 'en' ? 'Saving...' : 'Сохранение...'
        });

        setTimeout(function () {
            KTApp.unblock('#colorChoosePostModal .modal-content');
        }, 30000);
    });

    $('.preloader-theme-story').click(function () {
        KTApp.block('#colorChooseStoryModal .modal-content', {
            overlayColor: '#000000',
            state: 'primary',
            message: MAIN_LANGUAGE === 'en' ? 'Saving...' : 'Сохранение...'
        });

        setTimeout(function () {
            KTApp.unblock('#colorChooseStoryModal .modal-content');
        }, 30000);
    });

    $('#kt_quick_notifications_toggle, #kt_mobile_quick_notification_toggle').click(function () {
        console.log('click-click');
        $.ajax({
            method: 'POST',
            url: '/user/save-last-read-news'
        })

        $(this).find('.symbol-badge').hide();
    });

    setInterval(function () {
        $('.button-next .t-btn_wrap-effects').css('left', '0px');
        $(".button-next .t-btn_wrap-effects").animate({
            left: "260px"
        }, 2500);
    }, 4000);

    var tourHelperCalendar = $('#tour_helper_calendar');

    tourHelperCalendar.on('click touchstart tap', '.fc-event', function (e) {
        var elem = $(this).find('.show-filter-modal');
        var modalBlock, modalBlockBodyClass, url;
        if (elem.data('id') >= 0) {
            modalBlock = $('#filterInfoModal');
            modalBlockBodyClass = '#filterInfoModal .modal-body';
            url = '/filters/info/' + elem.data('id');
        } else {
            modalBlock = $('#plannerInfoModal');
            modalBlockBodyClass = '#plannerInfoModal .modal-body';
            url = '/user/planner-info';
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

        if (elem.data('id') && document.body.offsetWidth > 1154) {
            modalBlock.addClass('desktop');
        } else {
            modalBlock.removeClass('desktop');
        }

        $.ajax({
            type: 'POST',
            cache: false,
            url: url,
            data: {
                publication_id: elem.data('publication-id'),
                view_type: document.body.offsetWidth <= 1154 ? 'mobile' : 'desktop'
            },
            success: function (response) {
                KTApp.unblock(modalBlockBodyClass);

                // Add response in Modal body
                $(modalBlockBodyClass).html(response);
            }
        });

        return false;
    });

    tourHelperCalendar.on('click', '.fc-list-item', function (e) {
        var elem = $(this).find('.show-filter-list-modal');
        var modalBlock, modalBlockBodyClass, url;
        if (elem.data('id') >= 0) {
            modalBlock = $('#filterInfoModal');
            modalBlockBodyClass = '#filterInfoModal .modal-body';
            url = '/filters/info/' + elem.data('id');
        } else {
            modalBlock = $('#plannerInfoModal');
            modalBlockBodyClass = '#plannerInfoModal .modal-body';
            url = '/user/planner-info';
        }

        KTApp.block(modalBlockBodyClass, {
            overlayColor: '#000000',
            state: 'primary',
            message: MAIN_LANGUAGE === 'en' ? 'Loading... 🤓' : 'Загрузка...'
        });

        // Add response in Modal body
        $(modalBlockBodyClass).html('');

        // Display Modal
        modalBlock.modal('show');

        if (elem.data('id') && document.body.offsetWidth > 1154) {
            modalBlock.addClass('desktop');
        } else {
            modalBlock.removeClass('desktop');
        }

        $.ajax({
            type: 'POST',
            cache: false,
            url: url,
            data: {
                publication_id: elem.data('publication-id'),
                view_type: document.body.offsetWidth <= 1154 ? 'mobile' : 'desktop'
            },
            success: function (response) {
                KTApp.unblock(modalBlockBodyClass);
                // Add response in Modal body
                $(modalBlockBodyClass).html(response);
            }
        });


        return false;
    });

    $('input[type=radio][name=comment-preview-variants]').change(function () {
        $.ajax({
            type: 'POST',
            cache: false,
            url: '/filters/default-comment/' + $('#comment-preview-variants').data('filter'),
            data: {
                hotelsCount: $(this).val()
            },
            success: function (response) {
                var preview = $('#preview-comment');
                preview.val(response);
                preview.trigger('keyup');
            }
        });
    });

    $('.template-select select').change(function () {
        $.ajax({
            type: 'POST',
            cache: false,
            url: '/filters/default-comment/' + $('#comment-preview-variants').val(),
            data: {
                hotelsCount: $(this).val()
            },
            success: function (response) {
                var preview = $('#preview-comment');
                preview.val(response);
                preview.trigger('keyup');
            }
        });
    });

    /**
     * Save user settings
     *
     * @param {string} setting
     * @param value
     * @param {bool} boolean
     */
    function saveUserSettings(setting, value, boolean) {

        if (boolean === undefined) {
            boolean = true;
        }

        $.ajax({
            method: 'POST',
            url: '/site/save-user-settings',
            data: {name: setting, value: value, boolean: boolean}
        })
    }

    /**
     * Init hint block
     *
     * @return {undefined}
     */
    var initHintBlocks = function () {
        if (!window.sizeDevice('xs') && !window.sizeDevice('sm')) {
            $('.hint-block').each(function () {
                var $hint = $(this);
                $hint.parent().find('label.control-label').addClass('help').popover({
                    html: true,
                    trigger: 'hover',
                    placement: 'right',
                    content: $hint.html(),
                });
            });
        } else {
            $('.hint-block').each(function () {
                var $hint = $(this);
                var $modalBlock = $('#filterLabelInfoModal');
                $hint
                    .parent()
                    .find('label.control-label')
                    .addClass('help')
                    .on('click', function () {
                        console.log('click label');
                        // Add response in Modal body
                        $modalBlock
                            .find('.modal-body')
                            .html($hint.html());

                        $modalBlock.modal('show');
                    });
            });
        }
    };

    initHintBlocks();

    $('#subscription-list').on('click', '.cancel-subscription', function (e) {
        var elem = $(this);
        Swal.fire({
            title: MAIN_LANGUAGE === 'en' ? 'Are you sure?' : 'Вы уверены?',
            text: MAIN_LANGUAGE === 'en' ? 'Are you sure you want to unsubscribe!' : "Вы действительно хотите отменить подписку!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: MAIN_LANGUAGE === 'en' ? 'Yes' : 'Да, отменить!',
            cancelButtonText: MAIN_LANGUAGE === 'en' ? 'Close' : "Закрыть",
        }).then(function (result) {
            if (result.value) {
                $.ajax({
                    type: 'POST',
                    cache: false,
                    url: '/pay/cancel-subscription?subscriptionId=' + elem.data('id'),
                    success: function (data) {
                        location.reload();
                    }
                });
            }
        });
    });

    $('.choose-template-filter').click(function () {
        var blockClassName = $(this).data('type') === 'post' ? '#templateChoosePostModal .modal-content' : '#templateChooseStoryModal .modal-content';
        KTApp.block(blockClassName, {
            overlayColor: '#000000',
            state: 'primary',
            message: MAIN_LANGUAGE === 'en' ? 'Saving...' : 'Сохранение...'
        });

        $.ajax({
            type: 'POST',
            cache: false,
            url: '/filters/choose-template/' + $(this).data('filter-id'),
            data: {
                templateId: $(this).data('id'),
                type: $(this).data('type')
            },
            success: function (data) {
                location.reload();
            }
        });

        setTimeout(function () {
            KTApp.unblock(blockClassName);
        }, 30000);
    });

    $('.month-box-wrapper').on('click', function () {
        var planId = $(this).data('id');

        if ($(this).hasClass('active')) {
            return true;
        }

        $('.month-box-wrapper').removeClass('active');
        $('.month-box-wrapper[data-id=' + planId + ']').addClass('active');
        $('.plan-info').removeClass('active');
        $('#start-' + planId).addClass('active');
        $('#confident-' + planId).addClass('active');
        $('#advanced-' + planId).addClass('active');
    });

    $('.main-profile-avatar-upload-input').on('change', function () {
        if ($(this).hasClass('touragency-input')) {
            $('.upload-photo-wrapper').addClass('adaptive-photo-user');
            readURLAgencyLogo(this);
        } else {
            $('.upload-photo-wrapper').addClass('adaptive-photo-user');
            readURLAvatar(this);
        }
    })

    $('.planner-post-file-input').on('change', function () {
        readURLPostPlanner(this);
    })

    $('.planner-story-file-input').on('change', function () {
        readURLStoryPlanner(this);
    })

    $('#kt_header_user_menu_toggle').on('click', function () {
        $('.menu-sub-dropdown').toggleClass('show');
        $('.header-menu-items').removeClass('d-flex');
    })

    $('#post_image .remove-video-btn, #post_image .remove-photo-btn').on('click', function () {
        $('#post_image .image-input-wrapper').removeClass('adaptive-photo-planner');
        $('#post_image .image-input-wrapper').removeClass('adaptive-video-planner');
        $('#post_image .planner-upload-photo').attr('src', '');
        $('#post_image .planner-upload-video').attr('src', '');
        $('.planner-post-file-input').val('');
        $('.checkbox-list-post input[type="checkbox"]').attr('disabled', 'disabled');
        $('.checkbox-list-post .checkbox').addClass('disabled');
    })

    $('#story_image .remove-video-btn, #story_image .remove-photo-btn').on('click', function () {
        $('#story_image .image-input-wrapper').removeClass('adaptive-photo-planner');
        $('#story_image .image-input-wrapper').removeClass('adaptive-video-planner');
        $('#story_image .planner-upload-photo').attr('src', '');
        $('#story_image .planner-upload-video').attr('src', '');
        $('.planner-story-file-input').val('');
        $('.checkbox-list-story input[type="checkbox"]').attr('disabled', 'disabled');
        $('.checkbox-list-story .checkbox').addClass('disabled');
    })

    function readURLPostPlanner(input) {
        if (input.files && input.files[0]) {
            var type = input.files[0].type.indexOf('image/') !== -1 ? 'image' : 'video';
            var reader = new FileReader();

            reader.onload = function (e) {
                $('.checkbox-list-post input[type="checkbox"]').removeAttr('disabled');
                $('.checkbox-list-post .checkbox').removeClass('disabled');
                if (type === 'image') {
                    $('#post_image .image-input-wrapper').addClass('adaptive-photo-planner');
                    $('#post_image .planner-upload-photo').attr('src', e.target.result);
                    $.ajax({
                        type: 'POST',
                        cache: false,
                        url: '/templates/upload-image',
                        data: {
                            type: 'post',
                            image: e.target.result
                        }
                    });
                } else {
                    $('#post_image .image-input-wrapper').addClass('adaptive-video-planner');
                    $('#post_image .planner-upload-video').attr('src', e.target.result);
                }
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    function readURLStoryPlanner(input) {
        if (input.files && input.files[0]) {
            var type = input.files[0].type.indexOf('image/') !== -1 ? 'image' : 'video';
            var reader = new FileReader();

            reader.onload = function (e) {
                if (type === 'image') {
                    $('#story_image .image-input-wrapper').addClass('adaptive-photo-planner');
                    $('#story_image .planner-upload-photo').attr('src', e.target.result);
                    $('.checkbox-list-story input[type="checkbox"]').removeAttr('disabled');
                    $('.checkbox-list-story .checkbox').removeClass('disabled');
                    $.ajax({
                        type: 'POST',
                        cache: false,
                        url: '/templates/upload-image',
                        data: {
                            type: 'story',
                            image: e.target.result
                        }
                    });
                } else {
                    $('#story_image .image-input-wrapper').addClass('adaptive-video-planner');
                    $('#story_image .planner-upload-video').attr('src', e.target.result);
                    $('.checkbox-list-story input[data-name="vkontakteStory"]').removeAttr('disabled');
                    $('.checkbox-list-story .checkbox-vkontakte').removeClass('disabled');
                }
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    function readURLAvatar(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('.main-profile-avatar').attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    function readURLAgencyLogo(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('.touragency-upload-photo').attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
        }
    }
});