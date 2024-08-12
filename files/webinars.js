let currentPage = 1;
const itemsPerPage = 9;
let pastWebinars = [];

async function fetchEvents() {
    const response = await fetch('https://rss.app/feeds/v1.1/MkGhxZTbPrg1vxwK.json');
    const data = await response.json();
    const webinars = data.items;

    const upcomingContainer = document.getElementById('upcoming-webinars');
    const liveShedule = document.getElementById('liveShedule');
    const lastContainer = document.getElementById('last-webinars');
    const currentDate = new Date();

    pastWebinars = webinars.filter(webinar => new Date(webinar.date_published) < currentDate);
    const upcomingWebinars = webinars.filter(webinar => new Date(webinar.date_published) >= currentDate);

    renderUpcomingWebinars(upcomingWebinars, upcomingContainer, liveShedule, lastContainer);
    renderPastWebinars();
    createPaginationControls();
}

function renderUpcomingWebinars(upcomingWebinars, upcomingContainer, liveShedule, lastContainer) {
    upcomingWebinars.forEach(webinar => {
        const webinarElement = document.createElement('div');
        webinarElement.className = 'b2b-slide-item';
        webinarElement.innerHTML = `
            <div class="b2b-slide-item-nom">${formatDate(webinar.date_published)}</div>
            <h3>${webinar.title}</h3>
            <p>${webinar.description}</p>
        `;
        upcomingContainer.appendChild(webinarElement);
    });

    if (upcomingContainer.children.length === 0) {
        liveShedule.style.display = 'none';
        lastContainer.style.margin = '0';
    } else {
        $(upcomingContainer).slick({
            dots: false,
            arrows: true,
            infinite: true,
            centerMode: false,
            centerPadding: '0px',
            slidesToShow: 2,
            vertical: true,
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        arrows: true,
                        slidesToShow: 1,
                    }
                }
            ]
        });
    }
}

function renderPastWebinars() {
    const pastContainer = document.getElementById('past-webinars');
    pastContainer.innerHTML = ''; // Clear previous content

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const webinarsToShow = pastWebinars.slice(startIndex, endIndex);

    webinarsToShow.forEach(webinar => {
        const webinarElement = document.createElement('div');
        webinarElement.className = 'col-lg-4 col-md-6 col-xs-12';
        webinarElement.innerHTML = `
            <a href="${webinar.url}" class="tour-item" target='blank'>
                <div class="tour-img"><img src="${webinar.image}" alt=""></div>
                <div class="tour-text">
                    <div class="icon-youtube"><img src="./files/events-youtube-icon.svg" alt=""></div>
                    <h3>${webinar.title}</h3>
                    <p class="date">${formatDate(webinar.date_published)}</p>
                </div>
            </a>
        `;
        pastContainer.appendChild(webinarElement);
    });
}

function createPaginationControls() {
    const totalPages = Math.ceil(pastWebinars.length / itemsPerPage);
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = ''; // Clear previous pagination

    const ulElement = document.createElement('ul');
    ulElement.className = 'pagination';

    // First button
    const firstLi = document.createElement('li');
    firstLi.innerHTML = `<a href="#"><span class="pag-first ${currentPage === 1 ? 'disabled' : ''}"></span></a>`;
    firstLi.addEventListener('click', () => {
        if (currentPage !== 1) {
            currentPage = 1;
            renderPastWebinars();
            createPaginationControls();
        }
    });
    ulElement.appendChild(firstLi);

    for (let i = 1; i <= totalPages; i++) {
        const pageLi = document.createElement('li');
        pageLi.className = i === currentPage ? 'active' : '';
        pageLi.innerHTML = `<a href="#">${i}</a>`;
        pageLi.addEventListener('click', () => {
            currentPage = i;
            renderPastWebinars();
            createPaginationControls();
        });
        ulElement.appendChild(pageLi);
    }

    const lastLi = document.createElement('li');
    lastLi.innerHTML = `<a href="#"><span class="pag-last ${currentPage === totalPages ? 'disabled' : ''}"></span></a>`;
    lastLi.addEventListener('click', () => {
        if (currentPage !== totalPages) {
            currentPage = totalPages;
            renderPastWebinars();
            createPaginationControls();
        }
    });
    ulElement.appendChild(lastLi);

    paginationContainer.appendChild(ulElement);
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', options);
}

document.addEventListener("DOMContentLoaded", fetchEvents);
