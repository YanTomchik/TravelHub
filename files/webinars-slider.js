function initializeSlick() {
    setTimeout(function() {
        const $upcomingWebinars = $('#upcoming-webinars');
        if ($upcomingWebinars.length && $upcomingWebinars.children().length > 0) {
            $upcomingWebinars.slick({
                vertical: true,
                slidesToShow: 3,
                slidesToScroll: 1,
                infinite: true,
                dots: true,
                arrows: true,
                autoplay: true,
                autoplaySpeed: 3000,
            });
            
        } else {
            
            console.error('Slick Slider не был инициализирован: контейнер пуст или не найден.');
        }
    }, 500); // 500ms задержка
    console.log('TIMEOUT')
}

initializeSlick()