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

  
  const tAgentRadio = document.getElementById('t-agent');
  const companyRadio = document.getElementById('company');
  const touristRadio = document.getElementById('tourist');
  const companyNameField = document.getElementById('contactform-company-name');

  function toggleCompanyNameField() {
      if (tAgentRadio.checked || companyRadio.checked) {
          companyNameField.style.display = 'block';
      } else {
          companyNameField.style.display = 'none';
      }
  }

  tAgentRadio.addEventListener('change', toggleCompanyNameField);
  companyRadio.addEventListener('change', toggleCompanyNameField);
  touristRadio.addEventListener('change', toggleCompanyNameField);

  // Initial check
  toggleCompanyNameField();

});




