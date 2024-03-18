const phoneInput = $('.phone-input');
var ajaxMaskCall = false;
var maskExist = false;

function performAjaxCall(_this, countryCode, callback) {
    if (countryCode[0] != '+') {
        countryCode = '+' + countryCode;
    }

    $.ajax({
        url: '/get-phone-mask',
        type: 'GET',
        data: { countryCode: countryCode },
        success: function(response) {
            handleAjaxResponse(response, _this, countryCode);
            callback(response, _this);
        },
        error: function(xhr, status, error) {
            console.error('Произошла ошибка при получении маски: ', error);
        }
    });
}

function handleAjaxResponse(response, _this, countryCode) {
    if (response.mask) {
        var countryCodeLength = countryCode.length;
        var maskWithoutCountryCode = response.mask.substring(countryCodeLength);
        var newMask = countryCode + maskWithoutCountryCode;
        _this.inputmask('remove');
        _this.inputmask(newMask);
        console.log('mask setted' + newMask);
        _this.attr('placeholder', '+');
        countryCodeError('hide', _this);
        maskExist = true;
    } else if (response.error && countryCode.length == 4) {
        if (!maskExist) {
            countryCodeError('show', _this, response.error);
        }
    }
}

function resetMask(_this) {
    _this.val('');
    _this.inputmask('remove');
    setTimeout(function() {
        _this.inputmask({
            'mask': '+9{1,12}',
            'greedy': false,
            'clearIncomplete': false,
            'placeholder': '',
            'definitions': {
                '9': {
                    'validator': '[0-9]',
                    'cardinality': 1,
                    'definitionSymbol': '*'
                }
            }
        });
        _this.attr('placeholder', '+');
        countryCodeError('hide', _this);
        maskExist = false;
    }, 0);
}

function countryCodeError(action, _this, message = '') {
    var parentCont = _this.closest('.form-group');
    var phoneInputError = parentCont.find('.phone-input + .help-block');
    if (action == 'show') {
        parentCont.addClass('has-error');
        phoneInputError.text(message);
    } else {
        parentCont.removeClass('has-error');
        phoneInputError.text('');
    }
}

function triggerKeyDownEvent(element, key) {
    var event = new KeyboardEvent('keydown', {
        key: key,
        bubbles: true
    });
    element.dispatchEvent(event);
}

function handlePaste(e) {
    var clipboardData, pastedData;

    e.stopPropagation();
    e.preventDefault();

    clipboardData = e.clipboardData || window.clipboardData;
    pastedData = clipboardData.getData('Text');
    reinitMaskFromValue(pastedData, $(e.target));
}

function reinitMaskFromValue(pastedData, _this) {
    pastedData = pastedData.replace(/\D/g, '');
    console.log('test', pastedData);
    var chars = Array.from(pastedData).filter(char => char != '+');
    var index = 0;
    var countryCode = '+';
    function processNextChar() {
        if (index < chars.length && !maskExist) {
            countryCode += chars[index];
            performAjaxCall(_this, countryCode, function(response, target) {
                if (response.mask) {
                    var remainingChars = chars.slice(index + 1).join('');
                    setTimeout(function() {
                        remainingChars.split('').forEach(function(char) {
                            var event = new KeyboardEvent('keydown', {
                                key: char,
                                keyCode: char.charCodeAt(0),
                                which: char.charCodeAt(0),
                                bubbles: true
                            });

                            target[0].dispatchEvent(event);
                        });
                    }, 500);

                } else {
                    index++;
                    processNextChar();
                }
            });
        }
    }
    processNextChar();
}

var elements = document.getElementsByClassName('phone-input');
for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener('paste', handlePaste);
}

phoneInput.on('keydown', function(e) {
    if (ajaxMaskCall) {
        return;
    }

    var _this = $(this);

    var isDelete = (e.key === 'Delete' || e.key === 'Backspace');
    var isCut = (e.key === 'x' && e.ctrlKey) || (e.key === 'Delete' && e.shiftKey);
    var isNumber = (e.key >= '0' && e.key <= '9');

    var currentValue = _this.val();
    var spaceIndex = currentValue.indexOf(' ');
    if ((currentValue == '' || currentValue == '+') && e.key == '0') {
        e.preventDefault();
        resetMask(_this);
        return false;
    }
    if (isNumber && spaceIndex < 0) {
        /*if (_this.closest('.form-group').hasClass('has-error')) {
            e.preventDefault();
            return false;
        } */
        var countryCode = currentValue.split(' ')[0] + e.key;
        performAjaxCall(_this, countryCode, function(response, _this) {
        });

    } else if (isDelete || isCut) {

        var cursorPosition = _this[0].selectionStart;

        if (cursorPosition == 1 && e.key === 'Backspace') {
            e.preventDefault();
            return false;
        }

        if (e.key == 'Backspace' && cursorPosition - 1 <= spaceIndex && /\d/.test(currentValue.substring(spaceIndex))) {
            e.preventDefault();
            _this[0].setSelectionRange(currentValue.length, currentValue.length);
            return false;
        } else if ((cursorPosition - 1 <= spaceIndex || spaceIndex < 0 ) || cursorPosition == 1 && isCut) {
            resetMask(_this);
            e.preventDefault();
            return false;
        }
    }
});

// this is for autocomplete handling
phoneInput.on('change', function(e) {
    var _this = $(this);
    var currentValue = _this.val();
    var previousValue = _this.data('prev');
    if (!currentValue) {
        resetMask(_this);
    }

    var lengthDifference = Math.abs(currentValue.length - previousValue.length);
    if (lengthDifference > 1 && currentValue.length > 2) {
        reinitMaskFromValue(currentValue, _this);
    }
    _this.data('prev', currentValue);
});

setTimeout(function() {
    phoneInput.trigger('change');
}, 500);
