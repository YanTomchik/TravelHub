const adultCountElement = document.querySelector('#adult-counter')
const adultPlusButtonElement = document.querySelector('#adult-plus-button')
const adultMinusButtonElement = document.querySelector('#adult-minus-button')

const childrenCountElement = document.querySelector('#children-counter')
const childrenPlusButtonElement = document.querySelector('#children-plus-button')
const childrenMinusButtonElement = document.querySelector('#children-minus-button')

const selectTitleAdultsCountElement = document.querySelector('#adults')

const selectDropdownElement = document.querySelector('#tourists-count-select-modal')
const countSelectButtonElement = document.querySelector('#tourists-select')

const childrenAgeBlockElement = document.querySelector('#children-age-block')
const childrenAgeTitleElement = document.querySelector('#children-age-title')

const extendButton = $('#extended-search-button')
const extendBlock = $('.extended-search-block')

let adultsField = $('#adults-count')
let childrenField = $('#children-count')
let adultCount = parseInt(adultsField.val())
let childrenCount = parseInt(childrenField.val())
let childrenList = []

// Adults logic start
const setAdultCount = (count) => {
    adultCountElement.textContent = count
    selectTitleAdultsCountElement.textContent = count
    adultsField.val(count);
}

const handlePlusAdult = () => {
    adultCount += 1
    console.log(adultCount);
    setAdultCount(adultCount)
}

const handleMinusAdult = () => {
    adultCount -= 1
    setAdultCount(adultCount)
}

adultPlusButtonElement.addEventListener("click", (e) => {
    e.preventDefault()
    handlePlusAdult()
})

adultMinusButtonElement.addEventListener("click", (e) => {
    e.preventDefault()
    if (adultCount === 0) {
        return
    }
    handleMinusAdult()
})

extendButton.on("click", (e) => {
    e.preventDefault()

    extendBlock.toggleClass('show');

    if (extendBlock.hasClass('show')) {
        extendButton.text('Скрыть расширенный поиск');
    } else {
        extendButton.text('Расширенный поиск');
    }
})
// Adults logic end

const handleSetChildrenAge = (id, age) => {
    childrenList[id].age = age
}

// Children logic start
const renderChildrens = () => {
    const oldMapppedList = document.querySelector('#mapped-list-block')

    if (oldMapppedList) {
        oldMapppedList.remove()
    }

    const childrenMappedList = `<div id="mapped-list-block">${childrenList.map((item, index) => {
        const {id, age} = item

        return `
                    <select onchange="${handleSetChildrenAge(id, age)}" id="children-age-select-${index}" name="TourSearchForm[childAges][${index + 1}]" data-children="${index + 1}" class="children-age-select">
                        <option ${age === 0 ? "selected" : ""} value="0">0</option>
                        <option ${age === 1 ? "selected" : ""} value="1">1</option>
                        <option ${age === 2 ? "selected" : ""} value="2">2</option>
                        <option ${age === 3 ? "selected" : ""} value="3">3</option>
                        <option ${age === 4 ? "selected" : ""} value="4">4</option>
                        <option ${age === 5 ? "selected" : ""} value="5">5</option>
                        <option ${age === 6 ? "selected" : ""} value="6">6</option>
                        <option ${age === 7 ? "selected" : ""} value="7">7</option>
                        <option ${age === 8 ? "selected" : ""} value="8">8</option>
                        <option ${age === 9 ? "selected" : ""} value="9">9</option>
                        <option ${age === 10 ? "selected" : ""} value="10">10</option>
                        <option ${age === 11 ? "selected" : ""} value="11">11</option>
                        <option ${age === 12 ? "selected" : ""} value="12">12</option>
                        <option ${age === 13 ? "selected" : ""} value="13">13</option>
                        <option ${age === 14 ? "selected" : ""} value="14">14</option>
                        <option ${age === 15 ? "selected" : ""} value="15">15</option>
                        <option ${age === 16 ? "selected" : ""} value="16">16</option>
                        <option ${age === 17 ? "selected" : ""} value="17">17</option>
                    </select>
                `
    }).join('')}</div`

    childrenAgeBlockElement.insertAdjacentHTML('beforeend', childrenMappedList)
}

const setChildrenCount = (count) => {
    childrenCountElement.textContent = count;
    $('#childrens').text(count);
    childrenField.val(count);
    console.log(childrenField.val());
}

const handlePlusChildren = () => {
    childrenList.push({id: childrenCount, age: null})
    renderChildrens()
    childrenCount += 1
    setChildrenCount(childrenCount)
}

const handleMinusChildren = () => {
    childrenList.pop()
    renderChildrens()
    childrenCount -= 1
    setChildrenCount(childrenCount)
}

childrenPlusButtonElement.addEventListener("click", (e) => {
    e.preventDefault()

    handlePlusChildren()

    if (childrenCount === 1) {
        childrenAgeTitleElement.style.display = 'block'
    }
})

childrenMinusButtonElement.addEventListener("click", (e) => {
    e.preventDefault()

    if (childrenCount === 1) {
        childrenAgeTitleElement.style.display = 'none'
    }

    if (childrenCount === 0) {
        return
    }

    handleMinusChildren()
})
// Children logic end

let isCountDropdownOpen = false

countSelectButtonElement.addEventListener("click", (e) => {
    e.preventDefault()
    if (isCountDropdownOpen) {
        selectDropdownElement.style.visibility = 'hidden'
        isCountDropdownOpen = false
        return
    }

    selectDropdownElement.style.visibility = 'visible'
    isCountDropdownOpen = true
})

$.expr[":"].contains = $.expr.createPseudo(function (arg) {
    return function (elem) {
        return $(elem).attr('data-title').toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
});

$(".list-block-header-input").keyup(function () {
    var val = $.trim(this.value);
    if (val === "") {
        $('.option-hotel').show();
    } else {
        $('.option-hotel').hide();
        $(".option-hotel:contains(" + val + ")").show();
    }
});

$('body').on('change', '.option-hotel input', function () {
    $('.list-block-header-selected span').text($('.option-hotel input:checked').length);
});

$('.list-block-header-reset').on('click', function () {
    $('.option-hotel input:checked').each(function () {
        $(this).removeAttr('checked');
        $(this).trigger('change');
    });
});

$('.list-block-header-all').on('click', function () {
    $('.option-hotel input').each(function () {
        $(this).attr('checked', 'checked');
        $(this).trigger('change');
    });
});

$('#country-id').on('change', function () {
    $.ajax({
        type: 'POST',
        cache: false,
        url: '/data/render-hotels/' + $(this).val(),
        success: function (response) {
            $('.hotels-list').html(response);
        }
    });

    $.ajax({
        type: 'POST',
        cache: false,
        url: '/data/render-resorts/' + $(this).val(),
        success: function (response) {
            $('.resorts-list').html(response);
        }
    });
});

$('body').on('click', '.option-hotel .option-title', function () {
    if ($(this).parent().find('input').attr('checked') === 'checked') {
        $(this).parent().find('input').removeAttr('checked').trigger('change');
    } else {
        $(this).parent().find('input').attr('checked', 'checked').trigger('change');
    }
})