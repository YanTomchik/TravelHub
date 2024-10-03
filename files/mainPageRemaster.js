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
  
  
  
  