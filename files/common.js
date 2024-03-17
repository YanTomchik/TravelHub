/**
 * Created by Yarmaliuk Mikhail on 02.08.2017.
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
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

/**
 * Get viewport width
 *
 * @return {number}
 */
window.deviceWidth = function () {
    return window.innerWidth ? window.innerWidth : screen.width;
};

/**
 * Check bootstrap window size
 *
 * @param {string} size
 * @param {number} width
 *
 * @returns {boolean}
 */
window.sizeDevice = function (size, width) {

    var outerWidth = width === undefined ? window.deviceWidth() : width;

    switch (size) {
        case 'xs':
            return outerWidth < 768;
        case 'sm':
            return outerWidth >= 768 && outerWidth < 992;
        case 'md':
            return outerWidth >= 992 && outerWidth < 1200;
        case 'lg':
            return outerWidth >= 1200;
    }
};

/**
 * Get size device suffix
 *
 * @return {string}
 */
window.sizeDeviceSuffix = function () {
    var outerWidth = window.innerWidth ? window.innerWidth : screen.width;
    var suffixes = ['xs', 'sm', 'md', 'lg'];

    for (var suffix in suffixes) {
        if (window.sizeDevice(suffixes[suffix], outerWidth)) {
            return suffixes[suffix];
        }
    }

    return null;
};

/**
 * Is element in viewport
 *
 * @param element
 * @param fullyInView
 *
 * @returns {boolean}
 */
window.isElementInView = function (element, fullyInView) {
    if (element.length) {
        var pageTop = $(window).scrollTop();
        var pageBottom = pageTop + $(window).height();
        var elementTop = $(element).offset().top;
        var elementBottom = elementTop + $(element).height();

        if (fullyInView === true) {
            return ((pageTop < elementTop) && (pageBottom > elementBottom));
        } else {
            return ((elementTop <= pageBottom) && (elementBottom >= pageTop));
        }
    }
};

/**
 * Get url param
 *
 * @param {string} param
 * @returns {*}
 */
window.getUrlParam = function (param) {
    var result = null,
        tmp = [];
    var items = location.search.substr(1).split("&");
    for (var index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === param) result = decodeURIComponent(tmp[1]);
    }
    return result;
};

/**
 * Add spinner and disabled button
 *
 * @param {jQuery}  button
 * @param {bool}    spinner
 */
window.addLoadingButton = function (button, spinner) {
    var otherIcons = button.find('.fa');

    if (otherIcons.length) {
        otherIcons.hide();
    }

    if (spinner === undefined || spinner === true) {
        button.prepend('<i class="mp-spinner fa fa-spinner fa-spin fa-fw"></i>');
    } else if (typeof spinner === 'string') {
        button.prepend('<i class="mp-spinner ' + spinner + '"></i>');
    }

    button
        .addClass('disabled')
        .attr('disabled', true);
};

/**
 * Remove disable attributes button and spinner
 *
 * @param {jQuery} button
 */
window.removeLoadingButton = function (button) {
    button
        .removeClass('disabled')
        .removeAttr('disabled')
        .find('.mp-spinner')
        .remove();

    var otherIcons = button.find('.fa');

    if (otherIcons.length) {
        otherIcons.show();
    }
};

/**
 * Check IE browser
 *
 * @return {boolean}
 */
window.isIEBrowser = function () {
    if (navigator.appName === 'Microsoft Internet Explorer' || !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/rv:11/)) || (typeof $.browser !== "undefined" && $.browser.msie == 1)) {
        return true;
    }

    return false;
};

/**
 * Base64 functions
 *
 * @type {{_keyStr: string, encode: Window.Base64.encode, decode: Window.Base64.decode, _utf8_encode: Window.Base64._utf8_encode, _utf8_decode: Window.Base64._utf8_decode}}
 */
window.Base64 = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) {
        var t = "";
        var n, r, i, s, o, u, a;
        var f = 0;
        e = Base64._utf8_encode(e);
        while (f < e.length) {
            n = e.charCodeAt(f++);
            r = e.charCodeAt(f++);
            i = e.charCodeAt(f++);
            s = n >> 2;
            o = (n & 3) << 4 | r >> 4;
            u = (r & 15) << 2 | i >> 6;
            a = i & 63;
            if (isNaN(r)) {
                u = a = 64
            } else if (isNaN(i)) {
                a = 64
            }
            t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
        }
        return t
    }, decode: function (e) {
        var t = "";
        var n, r, i;
        var s, o, u, a;
        var f = 0;
        e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (f < e.length) {
            s = this._keyStr.indexOf(e.charAt(f++));
            o = this._keyStr.indexOf(e.charAt(f++));
            u = this._keyStr.indexOf(e.charAt(f++));
            a = this._keyStr.indexOf(e.charAt(f++));
            n = s << 2 | o >> 4;
            r = (o & 15) << 4 | u >> 2;
            i = (u & 3) << 6 | a;
            t = t + String.fromCharCode(n);
            if (u != 64) {
                t = t + String.fromCharCode(r)
            }
            if (a != 64) {
                t = t + String.fromCharCode(i)
            }
        }
        t = Base64._utf8_decode(t);
        return t
    }, _utf8_encode: function (e) {
        e = e.replace(/\r\n/g, "\n");
        var t = "";
        for (var n = 0; n < e.length; n++) {
            var r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r)
            } else if (r > 127 && r < 2048) {
                t += String.fromCharCode(r >> 6 | 192);
                t += String.fromCharCode(r & 63 | 128)
            } else {
                t += String.fromCharCode(r >> 12 | 224);
                t += String.fromCharCode(r >> 6 & 63 | 128);
                t += String.fromCharCode(r & 63 | 128)
            }
        }
        return t
    }, _utf8_decode: function (e) {
        var t = "";
        var n = 0;
        var r = c1 = c2 = 0;
        while (n < e.length) {
            r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r);
                n++
            } else if (r > 191 && r < 224) {
                c2 = e.charCodeAt(n + 1);
                t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                n += 2
            } else {
                c2 = e.charCodeAt(n + 1);
                c3 = e.charCodeAt(n + 2);
                t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                n += 3
            }
        }
        return t
    }
};

/**
 * Get window scroll percen
 *
 * @return {number}
 */
window.getScrollPercent = function () {
    var h = document.documentElement,
        b = document.body,
        st = 'scrollTop',
        sh = 'scrollHeight';
    return (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight) * 100;
};

/**
 * Scroll to element
 *
 * @param {jQuery} element
 * @param {function} [complete]
 * @param {number} [speed]
 * @param {number} [offset]
 */
window.scrollToElement = function (element, complete, speed, offset) {
    if (element && element.length) {

        var windowAnimate = $('html, body');

        // Detect modal window
        if (element.closest('.modal').length) {
            windowAnimate = element.closest('.modal');
        }

        offset = offset !== undefined ? offset : 0;

        windowAnimate.animate({
            scrollTop: element.offset().top + offset,
        }, speed === undefined ? 1000 : speed, function () {
            if (typeof complete === "function") {
                complete();
            }
        });
    }
};

/**
 * Validate input text
 *
 * @param {HTMLElement} input
 * @param e
 *
 * @return {undefined}
 */
window.validateInput = function (input, e) {
    var value = input.value;

    setTimeout(function () {
        if (input.value.length > 0) {
            if ('upper' in input.dataset) {
                value = value.toUpperCase();
                input.value = input.value.toUpperCase();
            }

            if ('pattern' in input.dataset) {
                var match = input.dataset.pattern.match(new RegExp('^/(.*?)/([gimyues]*)$'));

                if (match === null) {
                    var regexp = new RegExp(input.dataset.pattern);
                } else {
                    var regexp = new RegExp(match[1], match[2]);
                }

                if (!regexp.test(input.value)) {
                    input.value = value;
                }
            }

            if ('maxlen' in input.dataset) {
                if (value.length >= input.dataset.maxlen && e.which !== 13 && e.which !== 8) {
                    input.value = value.substr(0, input.dataset.maxlen);
                }
            }
        }
    }, window.mobileAndTabletCheck() ? 50 : 0.5);
};

window.lastEvent = {};

/**
 * Animate.css
 */
$.fn.extend({
    animateCss: function (animationName, callback) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, function () {
            $(this).removeClass('animated ' + animationName);

            if (typeof callback === 'function') {
                callback(this);
            }
        });
        return this;
    }
});

/**
 * ActiveForm validator
 *
 * @param {boolean} untilFirstError
 *
 * @return {number}
 */
$.fn.yiiActiveFormValidate = function (untilFirstError) {
    var deferredArray = function () {
        var array = [];
        array.add = function (callback) {
            this.push(new $.Deferred(callback));
        };
        return array;
    };
    var findInput = function ($form, attribute) {
        var $input = $form.find(attribute.input);
        if ($input.length && $input[0].tagName.toLowerCase() === 'div') {
            // checkbox list or radio list
            return $input.find('input');
        } else {
            return $input;
        }
    };
    var getValue = function ($form, attribute) {
        var $input = findInput($form, attribute);
        var type = $input.attr('type');
        if (type === 'checkbox' || type === 'radio') {
            var $realInput = $input.filter(':checked');
            if (!$realInput.length) {
                $realInput = $form.find('input[type=hidden][name="' + $input.attr('name') + '"]');
            }

            return $realInput.val();
        } else {
            return $input.val();
        }
    };
    var validate = function (form) {
        var form = $(form);
        var errors = 0;

        if (form.yiiActiveForm !== undefined) {
            var data = form.yiiActiveForm('data');
            var deferreds = deferredArray();

            if (data !== undefined && data.attributes !== undefined && data.attributes.length > 0) {

                $.each(data.attributes, function () {
                    this.$form = form;

                    if (!$(this.input).is(":disabled")) {
                        var msg = [];

                        if (this.validate !== undefined && typeof this.validate === 'function') {
                            this.validate(this, getValue(form, this), msg, deferreds, form);

                            if (msg.length > 0) {
                                errors++;

                                if (untilFirstError) {
                                    return false;
                                }
                            }
                        }
                    }
                });
            }
        }

        return errors;
    };

    return validate(this);
};

/**
 * Outher html
 */
$.fn.extend({
    outerHTML: function () {
        return $('<div/>', {html: this}).html();
    },
});

/**
 * Window scroll width
 */
window.SCROLL_WIDTH = (function getScrollbarWidth() {
    var outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.width = "100px";
    document.body.appendChild(outer);

    var widthNoScroll = outer.offsetWidth;
    // force scrollbars
    outer.style.overflow = "scroll";

    // add innerdiv
    var inner = document.createElement("div");
    inner.style.width = "100%";
    outer.appendChild(inner);

    var widthWithScroll = inner.offsetWidth;

    // remove divs
    outer.parentNode.removeChild(outer);

    return widthNoScroll - widthWithScroll;
}());

$(function () {
    /**
     * Common handler body click
     */
    $('body').on('click', function (e) {
        window.lastEvent = e;
    });

    /**
     * Toggle element text
     */
    $('body').on('click', '[data-toggle-text]', function () {
        var el = $(this);
        var text = el.data('toggle-text');

        el
            .data('toggle-text', el.text())
            .text(text);
    });
});

String.prototype.rot13 = function () { //v1.0
    return this.replace(/[a-zA-Z]/g, function (c) {
        return String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
    });
};
