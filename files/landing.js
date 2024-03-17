$(document).ready(function(){
  $('.slider').each(function() {
    $(this).show()
  });
});

$('.slider-countries').slick({
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

$('.mice-feedbacks-slider').slick({
  dots: false,
  infinite: true,
  arrows: true,
  speed: 300,
  slidesToShow: 1,
});

$('.country-main-slider').slick({
  dots: false,
  allows: true,
  centerMode: true,
  centerPadding: '60px',
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

$('.excursion-slider').slick({
  dots: false,
  allows: true,
  centerMode: true,
  centerPadding: '0px',
  slidesToShow: 3,
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

$('.move-logos').slick({
  dots: false,
  allows: false,
  slidesToShow: 1,
  variableWidth: true,
  autoplay:true,
  autoplaySpeed:1500,
  pauseOnFocus: false,
  pauseOnHover: false,
  responsive: [
    {
      breakpoint: 480,
      settings: {
        variableWidth: true,
        centerMode: true,
      }
    }
  ]
});
const slideLogosItems = document.querySelectorAll('.logos-item');

let maxLogosHeight = 0;

slideLogosItems.forEach((item) => {
  const itemLogosHeight = item.clientHeight; 
  console.log(itemLogosHeight);
  if (itemLogosHeight > maxLogosHeight) {
    maxLogosHeight = itemLogosHeight; 
  }
});

slideLogosItems.forEach((item) => {
  item.style.height = `100px`;
});

//

$('.excursion-gallery-row').slick({
  dots: false,
  infinite: true,
  speed: 300,
  slidesToShow: 8,
  responsive: [
      {
        breakpoint: 1200,
        settings: {
          arrows: true,
          slidesToShow: 6,
        }
      },
      {
        breakpoint: 992,
        settings: {
          arrows: true,
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 768,
        settings: {
          arrows: true,
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 480,
        settings: {
          arrows: true,
          slidesToShow: 2,
        }
      }
    ]
});

$('.b2b-slider').slick({
  dots: false,
  allows: true,
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

//

$('.b2b-tour-slider').slick({
  dots: false,
  allows: true,
  slidesToShow: 2,
  responsive: [
    {
      breakpoint: 480,
      settings: {
        arrows: true,
        slidesToShow: 1,
      } 
    }
  ]
});

//

const slideItems = document.querySelectorAll('.b2b-slide-item');

let maxHeight = 0;

slideItems.forEach((item) => {
  const itemHeight = item.clientHeight; 
  if (itemHeight > maxHeight) {
    maxHeight = itemHeight; 
  }
});

slideItems.forEach((item) => {
  item.style.height = `${maxHeight}px`;
});

$('.b2b-conf-slider').slick({
  dots: false,
  allows: true,
  slidesToShow: 3,
  responsive: [
    {
      breakpoint: 992,
      settings: {
        arrows: true,
        slidesToShow: 2,
      } 
    },
    {
      breakpoint: 768,
      settings: {
        arrows: true,
        slidesToShow: 1,
      } 
    }
  ]
});


//

$('.gallery').slick({
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  fade: true,
  asNavFor: '.gallery-nav'
});

$('.gallery-nav').slick({
  slidesToShow: 3,
  slidesToScroll: 1,
  asNavFor: '.gallery',
  dots: true,
  focusOnSelect: true
});

//

$(document).ready(function() {
  $(".excursion-days-title").click(function() {
    $(".excursion-days-item").not($(this).closest(".excursion-days-item")).removeClass("active");
    $(".excursion-days-content").not($(this).siblings(".excursion-days-content")).slideUp();

    $(this).closest(".excursion-days-item").toggleClass("active");
    $(this).siblings(".excursion-days-content").slideToggle();
  });

  $('#modal-4').on('shown.bs.modal', function () {
    // Переинициализация Slick Slider при открытии модального окна
    $('.gallery').slick('refresh');
    $('.gallery-nav').slick('refresh');
  });

  //

  $(".faq-title").click(function() {
    var content = $(this).next(".faq-content");
    if (content.is(":hidden")) {
      $(".faq-content").slideUp("fast");
      content.slideDown("fast");
    } else {
      content.slideUp("fast");
    }
  });
});

//

$('.team-slider').slick({
  dots: false,
  allows: true,
  centerMode: true,
  centerPadding: '0px',
  slidesToShow: 3,
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