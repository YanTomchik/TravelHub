// 1. Откуда

const destinationFormBtn = document.getElementById('destination_form_btn');
const destinationFormSection = document.getElementById('destination_form_section');
const destinationFormInput = document.getElementById('destination_form_input');


if (destinationFormBtn) {
    destinationFormBtn.addEventListener('click', toggleForm, true);
}

function toggleForm(event) {
    event.preventDefault();
    if (event.target === destinationFormBtn || destinationFormBtn.contains(event.target)) {
        destinationFormSection.classList.toggle('active');
        destinationFormBtn.classList.toggle('active');
    }
}

if (destinationFormBtn) {
    window.addEventListener('click', function (event) {
        if ((
                event.target !== destinationFormSection &&
                !destinationFormSection.contains(event.target) &&
                event.target !== destinationFormBtn &&
                event.target != destinationFormBtn)) {
            closeModal();
        }
    });
}

function closeModal() {
    destinationFormSection.classList.remove('active');
    destinationFormBtn.classList.remove('active');
}

//

const destinationFormClear = document.querySelector('.destination_form-clear');
const destinationFormField = document.getElementById('destination_form_field');

if (destinationFormClear) {
    destinationFormClear.addEventListener('click', function (event) {
        event.preventDefault();
        destinationFormField.value = '';
        destinationFormField.focus();
    })
}

// 

const fakeInputContent = document.querySelector('.fake-input-content');
const destDropdownItemFlex = document.querySelectorAll('.dest-dropdown-item');
const isVisuallyHidden = document.querySelector('.is-visually-hidden');

destDropdownItemFlex.forEach(element => {
    element.addEventListener('click', function (event) {
        const itemFlexElement = element.querySelector('.dest-dropdown-item-flex');

        const htmlContent = itemFlexElement.innerHTML;
        fakeInputContent.innerHTML = htmlContent;

        const ariaLabelValue = event.currentTarget.querySelector('.destination_form_field-result-item-button').getAttribute('aria-label');
        destinationFormInput.value = ariaLabelValue;

        isVisuallyHidden.style.display = 'none';
        closeModal();
    });
});


// 2. Куда

const arrivalFormBtn = document.getElementById('arrival_form_btn');
const arrivalFormSection = document.getElementById('arrival_form_section');
const arrivalFormInput = document.getElementById('arrival_form_input');

if (arrivalFormBtn) {
    arrivalFormBtn.addEventListener('click', arrivalToggleForm, true);
}

function arrivalToggleForm(event) {
    event.preventDefault();
    if (event.target === arrivalFormBtn || arrivalFormBtn.contains(event.target)) {
        arrivalFormSection.classList.toggle('active');
        arrivalFormBtn.classList.toggle('active');
        console.log('123');
    }
}

if (arrivalFormSection) {
    window.addEventListener('click', function (event) {
        if ((
                event.target !== arrivalFormSection &&
                !arrivalFormSection.contains(event.target) &&
                event.target !== arrivalFormBtn &&
                event.target != arrivalFormBtn)) {
            ArrivalCloseModal();
        }
    });
}

function ArrivalCloseModal() {
    arrivalFormSection.classList.remove('active');
    arrivalFormBtn.classList.remove('active');
}

//

const arrivalFormClear = document.querySelector('.arrival_form-clear');
const arrivalFormField = document.getElementById('arrival_form_field');

if (arrivalFormClear) {
    arrivalFormClear.addEventListener('click', function (event) {
        event.preventDefault();
        arrivalFormField.value = '';
        arrivalFormField.focus();
    })
}

// 

const arrivalfakeInputContent = document.querySelector('.arrival_fake-input-content');
const arrivalDropdownItemFlex = document.querySelectorAll('.arrival-dropdown-item');
const arrivalisVisuallyHidden = document.querySelector('.arrival-is-visually-hidden');

arrivalDropdownItemFlex.forEach(element => {
    element.addEventListener('click', function (event) {
        const itemFlexElement = element.querySelector('.arrival-dropdown-item-flex');

        const htmlContent = itemFlexElement.innerHTML;
        arrivalfakeInputContent.innerHTML = htmlContent;

        const ariaLabelValue = event.currentTarget.querySelector('.arrival_form_field-result-item-button').getAttribute('aria-label');
        arrivalFormInput.value = ariaLabelValue;

        arrivalisVisuallyHidden.style.display = 'none';
        ArrivalCloseModal();
    });
});

// 3. hide count passagers

const passangerFormBtn = document.getElementById('tourists-select');
const passangerFormSection = document.getElementById('tourists-count-select-modal');

if (passangerFormBtn) {
    window.addEventListener('click', function (event) {
        if ((
                event.target !== passangerFormSection &&
                !passangerFormSection.contains(event.target) &&
                event.target !== passangerFormBtn &&
                event.target != passangerFormBtn)) {
            passangerFormSection.style.visibility = 'hidden'
        }
    });
}

// 4. добавление числе по кнопкам + и -

const countBlocks = document.querySelectorAll('.count-block');

function updateCounters(block) {
    const counterElement = block.querySelector('.people-counter');
    const inputElement = block.querySelector('.form-control');

    const minusButton = block.querySelector('.count-button.minus');
    const plusButton = block.querySelector('.count-button.plus');

    minusButton.addEventListener('click', (e) => {
        event.preventDefault();
        let currentValue = parseInt(counterElement.textContent);
        if (currentValue > 0) {
            currentValue--;
            counterElement.textContent = currentValue;
            inputElement.value = currentValue;
        }
    });

    plusButton.addEventListener('click', (e) => {
        event.preventDefault();
        let currentValue = parseInt(counterElement.textContent);
        currentValue++;
        counterElement.textContent = currentValue;
        inputElement.value = currentValue;
    });
}

countBlocks.forEach(updateCounters);

// 5. Отображение доп. услуг

const childrenSeatsSwitch = document.getElementById('children-seats');
const childrenSeatsBlock = document.getElementById('children-seats-block');

childrenSeatsSwitch.addEventListener('change', function () {
    if (this.checked) {
        childrenSeatsBlock.style.display = 'block';
    } else {
        childrenSeatsBlock.style.display = 'none';
    }
});

if (childrenSeatsSwitch.checked) {
    childrenSeatsBlock.style.display = 'block';
}

//

const transferBackSwitch = document.getElementById('transfer-back');
const transferBackBlock = document.getElementById('transfer-back-block');

transferBackSwitch.addEventListener('change', function () {
    if (this.checked) {
        transferBackBlock.style.display = 'block';
    } else {
        transferBackBlock.style.display = 'none';
    }
});

if (transferBackSwitch.checked) {
    transferBackBlock.style.display = 'block';
}