class FilterMenu {
    constructor(selector) {
        this.filters = document.querySelectorAll(selector);
        this.init();
    }

    init() {
        this.filters.forEach(item => {
            const options = item.querySelectorAll('.filter-item:not(.no-filter)');
            const optionsCount = options.length;

            const hasSelectedAfterThird = Array.from(options).slice(3).some(option => option.querySelector('input').checked);

            if (optionsCount > 3 && !hasSelectedAfterThird) {
                options.forEach((option, index) => {
                    if (index > 2) {
                        option.classList.add('hidden');
                    }
                });

                const seeMoreButton = `<button class="see-more-button">` + translationsHub.seeMoreButton + `</button>`;
                item.insertAdjacentHTML('beforeend', seeMoreButton);
                const seeMoreButtonInDom = item.querySelector(`.see-more-button`);
                seeMoreButtonInDom.addEventListener('click', () => {
                    options.forEach(option => {
                        option.classList.remove('hidden');
                    });

                    seeMoreButtonInDom.remove();
                });
            }
        });
    }
}
