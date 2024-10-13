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
      autoplaySpeed: 3000, /* Скорость авто воспроизведения */
      prevArrow: '<button type="button" class="slick-prev">←</button>',
      nextArrow: '<button type="button" class="slick-next">→</button>',
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
        autoplaySpeed: 3000,
        arrows: false,
        infinite: true,
        rtl: false // Обычная прокрутка
    });

    // Нижний слайдер - справа налево
    $('.logos-slider-bottom').slick({
        slidesToShow: 8,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false,
        infinite: true,
        rtl: true // Прокрутка справа налево
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
  $('.team-cards-list').slick({
    slidesToShow: 4, /* Количество видимых слайдов */
    slidesToScroll: 1, /* Количество слайдов для пролистывания */
    autoplay: false, /* Автоматическое воспроизведение */
    autoplaySpeed: 3000, /* Скорость авто воспроизведения */
    // variableWidth: true, 
    prevArrow: '<button type="button" class="slick-prev">←</button>',
    nextArrow: '<button type="button" class="slick-next">→</button>',
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

const rangeSlider = document.getElementById('bookingAmount');
const bookingDisplay = document.getElementById('bookingDisplay');
const commissionResult = document.getElementById('commissionResult');
const bonusResult = document.getElementById('bonusResult');
const totalResult = document.getElementById('totalResult');
const commissionRate = document.getElementById('commissionRate');
const bonusRate = document.getElementById('bonusRate');

if(rangeSlider){
  rangeSlider.addEventListener('input', function() {
    const bookingAmount = parseFloat(this.value);
    const formattedBookingAmount = new Intl.NumberFormat('ru-RU').format(bookingAmount);
    bookingDisplay.textContent = formattedBookingAmount;

    // Комиссия
    let commissionPercentage = bookingAmount >= 20000 ? 0.12 : 0.10; // 12% если сумма >= 20000, иначе 10%
    const commission = bookingAmount * commissionPercentage;
    commissionResult.textContent = `$ ${new Intl.NumberFormat('ru-RU').format(commission.toFixed(2))}`;

    // Бонус по программе лояльности
    const bonusPercentage = 0.0025; // 0.25%
    const bonus = bookingAmount * bonusPercentage;
    bonusResult.textContent = `$ ${new Intl.NumberFormat('ru-RU').format(bonus.toFixed(2))}`;

    // Итого
    const total = commission + bonus;
    totalResult.textContent = `$ ${new Intl.NumberFormat('ru-RU').format(total.toFixed(2))}`;

    // Обновляем ставку комиссии
    commissionRate.textContent = commissionPercentage * 100 + '%';
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


  