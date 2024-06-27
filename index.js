$(document).ready(function () {

  var $slider = $('.landing-banner-list');
  var $sliderBtnsWrapper = $('.slider-btns-main-page-wrapper');

  // Инициализация слайдера
  $slider.slick({
    dots: true,
    infinite: true,
    speed: 500,
    fade: true,
    cssEase: 'linear',
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    appendDots: $sliderBtnsWrapper,
    customPaging: function (slider, i) {
      return '<div class="slider-btn"></div>';
    }
  });

  // Добавление активного класса при перелистывании слайдов
  $slider.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
    $sliderBtnsWrapper.find('.slider-btn').removeClass('active');
    $sliderBtnsWrapper.find('.slider-btn').eq(nextSlide).addClass('active');
  });

  // Установка активного класса на первую кнопку
  $sliderBtnsWrapper.find('.slider-btn').eq(0).addClass('active');

  $('.slider-offer-of-day').slick({
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    variableWidth: true,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          arrows: true,
        }
      }
    ]
  });

  // $('.news-digest-list').slick({
  //   dots: false,
  //   infinite: true,
  //   speed: 300,
  //   slidesToShow: 1,
  //   variableWidth: true,
  //   responsive: [
  //     {
  //       breakpoint: 992,
  //       settings: {
  //         arrows: true,
  //       }
  //     }
  //   ]
  // });


  // $('.move-logos-remaster').slick({
  //   dots: false,
  //   allows: false,
  //   slidesToShow: 1,
  //   variableWidth: true,
  //   autoplay: true,
  //   autoplaySpeed: 1500,
  //   pauseOnFocus: false,
  //   pauseOnHover: false,
  //   responsive: [
  //     {
  //       breakpoint: 480,
  //       settings: {
  //         variableWidth: true,
  //         centerMode: true,
  //       }
  //     }
  //   ]
  // });
  // const slideLogosItems = document.querySelectorAll('.logos-item');

  // let maxLogosHeight = 0;

  // slideLogosItems.forEach((item) => {
  //   const itemLogosHeight = item.clientHeight;
  //   console.log(itemLogosHeight);
  //   if (itemLogosHeight > maxLogosHeight) {
  //     maxLogosHeight = itemLogosHeight;
  //   }
  // });

  // slideLogosItems.forEach((item) => {
  //   item.style.height = `100px`;
  // });

  const dropdownToggle = document.querySelectorAll(".dropdown-toggle");
  
  dropdownToggle.forEach(function (toggle) {
    toggle.addEventListener("click", function () {
      const subMenu = toggle.nextElementSibling;

      if (subMenu.style.display === "none" || subMenu.style.display === "") {
        subMenu.style.display = "block";
        toggle.classList.add("active");
      } else {
        subMenu.style.display = "none";
        toggle.classList.remove("active");
      }
    });
  });

});




