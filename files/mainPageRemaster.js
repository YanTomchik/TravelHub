window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    const headerScrolled = document.querySelector('.header-scrolled');
    if (window.scrollY > 100) { // Если прокрутка больше 50px
        headerScrolled.classList.add('show')
        header.classList.add('hide')
        headerScrolled.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)';
    } else {
        headerScrolled.classList.remove('show')
        header.classList.remove('hide')
        headerScrolled.style.boxShadow = 'none';
    }
  });

  $(document).ready(function(){
    $('.news-cards-list').slick({
      slidesToShow: 3, /* Количество видимых слайдов */
      slidesToScroll: 1, /* Количество слайдов для пролистывания */
      autoplay: false, /* Автоматическое воспроизведение */
      prevArrow: '<button type="button" class="slick-prev">←</button>',
      nextArrow: '<button type="button" class="slick-next">→</button>',
      // variableWidth: true, 
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          }
        }
      ]
    });
  });

  $(document).ready(function() {
    $('.feedback-wrapper-list').slick({
      slidesToShow: 3,  /* Показываем 3 карточки одновременно */
      slidesToScroll: 1, /* Прокручиваем по 1 карточке */
      centerMode: true,  /* Центрируем активную карточку */
      centerPadding: '0px', /* Без отступов по краям */
      autoplay: false,   /* Отключаем авто-прокрутку */
      arrows: true,      /* Стрелки для переключения */
      dots: false, 
      variableWidth: true, 
      focusOnSelect: true, /* Карточки выбираются по клику */
      responsive: [
        {
          breakpoint: 770,
          settings: {
            slidesToShow: 1, /* Для мобильных экранов показываем одну карточку */
            slidesToScroll: 1
          }
        }
      ]
    });


  });

  $(document).ready(function(){
    // Верхний слайдер - слева направо
    $('.logos-slider-top').slick({
        slidesToShow: 8,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        arrows: false,
        infinite: true,
        rtl: false, // Обычная прокрутка
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 6,
              slidesToScroll: 1,
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
            }
          }
        ] 
    });

    // Нижний слайдер - справа налево
    $('.logos-slider-bottom').slick({
        slidesToShow: 8,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        arrows: false,
        infinite: true,
        rtl: true, // Прокрутка справа налево
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 6,
              slidesToScroll: 1,
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
            }
          }
        ] 
    });
});

$(document).ready(function(){
  // Верхний слайдер - слева направо
  $('.landing-banner-footer-logos-list').slick({
      slidesToShow: 8,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      arrows: false,
      infinite: true,
      variableWidth: true,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 6,
            slidesToScroll: 1,
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          }
        }
      ] 
  });
});

$(document).ready(function(){
  $('#operator-department').slick({
    slidesToShow: 4, /* Количество видимых слайдов */
    slidesToScroll: 1, /* Количество слайдов для пролистывания */
    autoplay: false, /* Автоматическое воспроизведение */
    autoplaySpeed: 3000, /* Скорость авто воспроизведения */
    // variableWidth: true, 
    prevArrow: '<button type="button" class="slick-prev">←</button>',
    nextArrow: '<button type="button" class="slick-next">→</button>',
    variableWidth: true,
  });
});

const highlightsItems = document.querySelectorAll('.highlight-item')

if(highlightsItems){
  highlightsItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        // Удаляем класс active у всех highlight-item и highlights-content-item
        document.querySelectorAll('.highlight-item').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.highlights-content-item').forEach(el => el.classList.remove('active', 'fade-in'));
        
        // Добавляем active только выбранному элементу
        item.classList.add('active');
        const contentItem = document.querySelectorAll('.highlights-content-item')[index];
        contentItem.classList.add('active', 'fade-in'); // Добавляем класс fade-in для анимации
    });
});
}

const elements = {
  rangeSlider: document.getElementById('bookingAmount'),
  bookingDisplay: document.getElementById('bookingDisplay'),
  commissionResult: document.getElementById('commissionResult'),
  bonusResult: document.getElementById('bonusResult'),
  totalResult: document.getElementById('totalResult'),
  commissionRate: document.getElementById('commissionRate'),
  bonusRate: document.getElementById('bonusRate'),
  calculatorWrapper: document.querySelector('.calculate-profit'),
};

if(elements.rangeSlider){
  elements.rangeSlider.addEventListener('input', function(event) {
    const bookingAmount = parseFloat(event.target.value);
    const formattedBookingAmount = new Intl.NumberFormat('ru-RU').format(bookingAmount);
    elements.bookingDisplay.textContent = formattedBookingAmount;

    // Комиссия
    let commissionPercentage = 0.10; // 12% если сумма >= 20000, иначе 10%
    const commission = bookingAmount * commissionPercentage;
    elements.commissionResult.textContent = `$ ${new Intl.NumberFormat('ru-RU').format(commission.toFixed(2))}`;

    let bonusPercentage;

    if(elements.calculatorWrapper.classList.contains('business')){
      // Бонус по программе лояльности
      bonusPercentage = 0; // 0.25% по умолчанию
      if (bookingAmount >= 100000) {
        bonusPercentage = 0.07; // 1% для суммы >= 100 000
      } else if (bookingAmount >= 50000) {
        bonusPercentage = 0.05; // 0.75% для суммы >= 50 000
      } else if (bookingAmount >= 20000) {
        bonusPercentage = 0.03; // 0.25% для суммы >= 20 000
      }
    }else{
      // Бонус по программе лояльности
      bonusPercentage = 0; // 0.25% по умолчанию
      if (bookingAmount >= 100000) {
        bonusPercentage = 0.01; // 1% для суммы >= 100 000
      } else if (bookingAmount >= 50000) {
        bonusPercentage = 0.0075; // 0.75% для суммы >= 50 000
      } else if (bookingAmount >= 20000) {
        bonusPercentage = 0.005; // 0.25% для суммы >= 20 000
      }
    }
    
    
    const bonus = bookingAmount * bonusPercentage;
    elements.bonusResult.textContent = `$ ${new Intl.NumberFormat('ru-RU').format(bonus.toFixed(2))}`;

    // Итого
    const total = commission + bonus;
    elements.totalResult.textContent = `$ ${new Intl.NumberFormat('ru-RU').format(total.toFixed(2))}`;

    // Обновляем ставку комиссии и бонуса
    elements.commissionRate.textContent = commissionPercentage * 100 + '%';
    if(elements.calculatorWrapper.classList.contains('business')){
        elements.bonusRate.textContent = (bonusPercentage * 100).toFixed(0) + '%';
    }  else{
      elements.bonusRate.textContent = (bonusPercentage * 100).toFixed(2) + '%';
    }
    // Обновляем фон прогрессбара
    const progress = (bookingAmount / elements.rangeSlider.max) * 100;
    elements.rangeSlider.style.background = `linear-gradient(to right, #306DDE ${progress}%, #D9D9D9 ${progress}%)`;
  });
}

// Функция, которая будет добавлять класс "visible", когда элемент попадет в область видимости
let observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
      if (entry.isIntersecting) {
          entry.target.classList.add('visible'); // Добавляем класс при попадании в зону видимости
      }
  });
}, { threshold: 0.1 }); // 0.1 означает, что элемент считается видимым, когда хотя бы 10% его области находится в зоне просмотра

// Наблюдаем за всеми секциями с классом "section"
document.querySelectorAll('.section-block').forEach(section => {
  observer.observe(section);
});

const tabsTeam = document.querySelectorAll('.landing-card-tab-item.our-team');
const tabsPartnership = document.querySelectorAll('.landing-card-tab-item.partnership');
const contentsTeam = document.querySelectorAll('.team-cards-list');
const contentsPartnership = document.querySelectorAll('.tab-pane');

if(tabsTeam) {
  tabsTeam.forEach(tab => {
    tab.addEventListener('click', function () {
      // Убираем активные классы у всех табов и контента
      tabsTeam.forEach(t => t.classList.remove('active'));
      contentsTeam.forEach(c => c.classList.remove('active'));

      // Добавляем активный класс к выбранной вкладке
      tab.classList.add('active');

      // Находим соответствующий контент и показываем его
      const activeTabContent = document.getElementById(tab.getAttribute('data-tab'));
      if (activeTabContent) {
        activeTabContent.classList.add('active');

        // Проверка, инициализирован ли слайдер для текущей вкладки
        if (!$(activeTabContent).hasClass('slick-initialized')) {
          // Инициализация слайдера для активной вкладки
          $(activeTabContent).slick({
            slidesToShow: 4,
            slidesToScroll: 1,
            autoplay: false,
            autoplaySpeed: 3000,
            variableWidth: true,
            prevArrow: '<button type="button" class="slick-prev">←</button>',
            nextArrow: '<button type="button" class="slick-next">→</button>',
            infinite: false, // Отключаем бесконечную прокрутку, если нужно
            responsive: [
              {
                breakpoint: 1024,
                settings: {
                  slidesToShow: 3,
                  slidesToScroll: 1,
                }
              },
              {
                breakpoint: 500,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1,
                }
              }
            ] 
          });
        }

        // Обновляем позицию слайдера
        $(activeTabContent).slick('setPosition');
      }
    });
  });
}


if(tabsPartnership){
  tabsPartnership.forEach(tab => {
    tab.addEventListener('click', function () {
      // Убираем активные классы у всех табов и контента
      tabsPartnership.forEach(t => t.classList.remove('active'));
      contentsPartnership.forEach(c => c.classList.remove('active'));
      contentsPartnership.forEach(c => c.classList.remove('show'));
  
      // Добавляем активный класс к выбранной вкладке
      tab.classList.add('active');
  
      // Находим соответствующий контент и показываем его
      const activeTabContent = document.getElementById(tab.getAttribute('data-tab'));
      if (activeTabContent) {
        activeTabContent.classList.add('active');
        activeTabContent.classList.add('show');
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  const dateList = document.getElementById('date-list');
  const prevButton = document.querySelector('.calendar-arrow.prev');
  const nextButton = document.querySelector('.calendar-arrow.next');
  let currentMonth = 9; // Октябрь (месяцы в JS начинаются с 0)
  let currentYear = 2024;

  const daysOfWeek = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

  function generateCalendar(month, year) {
      const daysInMonth = new Date(year, month + 1, 0).getDate(); // Количество дней в месяце
      const firstDay = new Date(year, month, 1).getDay(); // День недели первого дня месяца
      
      dateList.innerHTML = ''; // Очистка списка перед рендерингом

      for (let i = 1; i <= daysInMonth; i++) {
          const dayOfWeek = daysOfWeek[new Date(year, month, i).getDay()];
          const li = document.createElement('li');
          li.classList.add('calendar-day');
          if (dayOfWeek === 'Сб' || dayOfWeek === 'Вс') {
              li.classList.add('weekend'); // Подсветка выходных
          }

          li.innerHTML = `<span class="date-of-week">${i < 10 ? '0' + i : i}</span><span class="day-of-week">${dayOfWeek}</span>`;
          dateList.appendChild(li);
      }
  }

  function updateCalendarTitle(month, year) {
      const calendarTitle = document.querySelector('.calendar-header h2');
      const months = [
          'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 
          'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
      ];
      calendarTitle.textContent = `${months[month]}, ${year}`;
  }

  prevButton.addEventListener('click', function() {
      currentMonth--;
      if (currentMonth < 0) {
          currentMonth = 11;
          currentYear--;
      }
      updateCalendarTitle(currentMonth, currentYear);
      generateCalendar(currentMonth, currentYear);
  });

  nextButton.addEventListener('click', function() {
      currentMonth++;
      if (currentMonth > 11) {
          currentMonth = 0;
          currentYear++;
      }
      updateCalendarTitle(currentMonth, currentYear);
      generateCalendar(currentMonth, currentYear);
  });

  // Инициализация календаря
  updateCalendarTitle(currentMonth, currentYear);
  generateCalendar(currentMonth, currentYear);
});

function toggleCard(elem) {

  elem.closest('.card-useful-item').classList.toggle('expanded')

  if (elem.closest('.card-useful-item').classList.contains('expanded')) {
      elem.closest('.more-btn-text').textContent = 'Скрыть';
  } else {
    elem.closest('.more-btn-text').textContent = 'Еще';
  }

  console.log(elem.closest('.card-useful-item'))
}

const dropdownCityDest = document.querySelectorAll('.dropdown-icon-city-dest');

if(dropdownCityDest){
  dropdownCityDest.forEach(icon => {
    icon.addEventListener('click', function () {
      
        const card = this.closest('.city-card')
        card.classList.toggle('collapsed');
        this.classList.toggle('rotated');
    });
  });
}

function toggleDropdown() {
  var menu = document.querySelector(".dropdown-menu-avia");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}









  