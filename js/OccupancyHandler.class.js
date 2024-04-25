class OccupancyHandler {
    constructor() {
        this.adultCountElement = document.querySelector('#adult-counter');
        this.adultPlusButtonElement = document.querySelector('#adult-plus-button');
        this.adultMinusButtonElement = document.querySelector('#adult-minus-button');

        this.childrenCountElement = document.querySelector('#children-counter');
        this.childrenPlusButtonElement = document.querySelector('#children-plus-button');
        this.childrenMinusButtonElement = document.querySelector('#children-minus-button');

        this.selectTitleAdultsCountElement = document.querySelector('#tourists-select #adults');
        this.selectTitleChildrensCountElement = document.querySelector('#tourists-select #childrens');
        this.selectTitleChildrensText = document.querySelector('#tourists-select #childrens-text');
        this.selectTitleAdultsText = document.querySelector('#tourists-select #adults-text');

        this.selectDropdownElement = document.querySelector('#tourists-count-select-modal');
        this.countSelectButtonElement = document.querySelector('#tourists-select');

        this.childrenAgeBlockElement = document.querySelector('#children-age-block');
        this.childrenAgeTitleElement = document.querySelector('#children-age-title');

        this.findButton = document.querySelector('#search-button');

        this.adultCount = 2;
        this.childrenCount = 0;
        this.childrenList = [];
        this.isCountDropdownOpen = false;


        //this.assignEventHandlers();
        //this.restoreOccupancyState();
        //this.saveOccupancyState();
    }



    calculatePeople(count, type) {
        let lastDigit = count % 10;
        let lastTwoDigits = count % 100;
        let key;

        if (type === 'kid') {
            if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
                key = 'kidOther';
            } else if (lastDigit === 1) {
                key = 'kid1';
            } else if (lastDigit >= 2 && lastDigit <= 4) {
                key = 'kid2_4';
            } else {
                key = 'kidOther';
            }
        } else if (type === 'adult') {
            if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
                key = 'adultOther';
            } else if (lastDigit === 1) {
                key = 'adult1';
            } else {
                key = 'adultOther';
            }
        } else {
            throw new Error("Invalid type. Type should be either 'kid' or 'adult'");
        }

        return translationsHub[key];
    }

    setAdultCount(count) {
        this.adultCountElement.textContent = count;
        this.selectTitleAdultsCountElement.textContent = count;
        this.selectTitleAdultsText.textContent = this.calculatePeople(count, 'adult');
    }

    handlePlusAdult() {
        this.adultCount += 1;
        this.setAdultCount(this.adultCount);
    }

    handleMinusAdult() {
        this.adultCount -= 1;
        this.setAdultCount(this.adultCount);
    }

    handleSetChildrenAge(event) {
        const selectElement = event.target;
        const index = Number(selectElement.id.split('-')[3]);
        const age = selectElement.value;
        this.childrenList[index].age = age;
        this.saveOccupancyState();
    }

    renderChildrens() {
        const oldMappedList = document.querySelector('#mapped-list-block');

        if (oldMappedList) {
            oldMappedList.remove();
        }

        const childrenMappedList = `<div id="mapped-list-block">${this.childrenList.map((item, index) => {
            const { id, age } = item;

            return `
                <select id="children-age-select-${index}" class="children-age-select">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    <option value="13">13</option>
                    <option value="14">14</option>
                    <option value="15">15</option>
                    <option value="16">16</option>
                    <option value="17">17</option>
                </select>
            `;
        }).join('')}</div>`;

        this.childrenAgeBlockElement.insertAdjacentHTML('beforeend', childrenMappedList);

        this.childrenList.forEach((item, index) => {
            const selectElement = document.querySelector(`#children-age-select-${index}`);
            selectElement.value = item.age;
        });
    }

    setChildrenCount(count) {
        this.childrenCountElement.textContent = count;
        this.selectTitleChildrensCountElement.textContent = count;
        this.selectTitleChildrensText.textContent = this.calculatePeople(count, 'kid');
    }

    handlePlusChildren() {
        this.childrenList.push({ id: this.childrenCount, age: '1' });
        this.renderChildrens();
        this.childrenCount += 1;
        this.setChildrenCount(this.childrenCount);
    }

    handleMinusChildren() {
        this.childrenList.pop();
        this.renderChildrens();
        this.childrenCount -= 1;
        this.setChildrenCount(this.childrenCount);
    }

    hideSelectDropdownElement() {
        this.selectDropdownElement.style.visibility = 'hidden';
        this.isCountDropdownOpen = false;
    }

    // TODO: move to dataProcessorClass
    saveOccupancyState() {
        const adults = parseInt(document.querySelector("#adult-counter").textContent);
        const children = parseInt(document.querySelector("#children-counter").textContent);

        document.querySelector("#adults-input").value = adults;
        document.querySelector("#children-input").value = children;

        const childrenAgeElements = document.querySelectorAll("#children-age-block .children-age-select");
        const childrenAges = Array.from(childrenAgeElements).map(el => parseInt(el.options[el.selectedIndex].value));

        const childrenAgesJson = JSON.stringify(childrenAges);
        document.querySelector("#children-ages-json-input").value = childrenAgesJson;

        // updated state with the collected data
        const state = {
            adultCount: adults,
            childrenCount: children,
            childrenList: childrenAges
        };

        localStorage.setItem('widgetOccupancyState', JSON.stringify(state));

        let currentUrl = window.location.href;
        let url = new URL(currentUrl);

        url.searchParams.set('adultCount', adults);
        url.searchParams.set('childrenCount', children);
        url.searchParams.set('childrenList', childrenAgesJson);

        history.pushState(null, '', url);
    }

    // TODO: move to dataProcessorClass
    restoreOccupancyState() {
        let currentUrl = window.location.href;
        let url = new URL(currentUrl);

        let adultCount = url.searchParams.get('adultCount');
        let childrenCount = url.searchParams.get('childrenCount');
        let childrenList = url.searchParams.get('childrenList');

        if (!adultCount) {
            const state = JSON.parse(localStorage.getItem('widgetOccupancyState'));

            if (state) {
                adultCount = state.adultCount;
                childrenCount = state.childrenCount;
                childrenList = state.childrenList;

                childrenList = childrenList.map((item, index) => {
                    return {id: index + 1, age: item};
                });

                url.searchParams.set('adultCount', adultCount);
                url.searchParams.set('childrenCount', childrenCount);
                url.searchParams.set('childrenList', JSON.stringify(childrenList));
                history.pushState(null, '', url);
            } else {
                return;
            }
        } else {
            adultCount = Number(adultCount);
            if (childrenCount && childrenList) {
                childrenCount = Number(childrenCount);
                childrenList = JSON.parse(childrenList);

                childrenList = childrenList.map((item, index) => {
                    return {id: index + 1, age: item};
                });
            }
        }
        this.adultCount = adultCount;
        this.childrenCount = childrenCount;
        this.childrenList = childrenList;

        this.setAdultCount(this.adultCount);
        this.setChildrenCount(this.childrenCount);
        this.renderChildrens();

        this.saveOccupancyState();
    }

    assignEventHandlers() {
        this.adultPlusButtonElement.addEventListener("click", (e) => {
            e.preventDefault();
            this.handlePlusAdult();
            this.saveOccupancyState();
        });

        this.adultMinusButtonElement.addEventListener("click", (e) => {
            e.preventDefault();
            if (this.adultCount <= 1) { return; }
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

            if (this.childrenCount === 1) {
                this.childrenAgeTitleElement.style.display = 'none';
            }

            if (this.childrenCount === 0) { return; }
            this.handleMinusChildren();
            this.saveOccupancyState();
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

        document.addEventListener('change', (event) => {
            if (event.target.matches('.children-age-select')) {
                this.handleSetChildrenAge(event);
            }
        });
    }
}

const occupancyHandler = new OccupancyHandler();

