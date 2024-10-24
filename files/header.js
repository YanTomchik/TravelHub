document.addEventListener("DOMContentLoaded", function () {
    const tabHeaders = document.querySelectorAll(".language-tab");
    const tabContents = document.querySelectorAll(".language-content");

    tabHeaders.forEach((header) => {
        header.addEventListener("click", () => {
            // Убираем класс 'active' у всех заголовков
            tabHeaders.forEach((h) => h.classList.remove("active"));
            // Добавляем класс 'active' только к выбранному заголовку
            header.classList.add("active");

            // Скрываем все контентные блоки
            tabContents.forEach((content) => {
                content.style.display = "none";
            });

            // Отображаем соответствующий контент
            const tabName = header.getAttribute("data-tab") + "-content";
            const tabContent = document.querySelector(`[data-tab="${tabName}"]`);
            tabContent.style.display = "block";
        });
    });

    const toggleButton = $(".header-language-content");
    const dropdown = $(".header-language-dropdown");
    
    // Функция для открытия/закрытия блока
    function toggleDropdown() {
        dropdown.toggleClass("active");
    }
    
    // Открытие/закрытие по клику на <span>
    toggleButton.on('click', function(e) {
        e.stopPropagation(); // Останавливаем распространение события клика, чтобы не закрывать при клике на кнопку
        toggleDropdown();
    })
    
    // Закрытие блока при клике вне блока
    $(document).mouseup(function(e) {
        // Если цель клика не toggleButton и не его потомок, и цель не является dropdown или его потомком
        if (!toggleButton.is(e.target) && toggleButton.has(e.target).length === 0 &&
            !dropdown.is(e.target) && dropdown.has(e.target).length === 0) {
            dropdown.removeClass("active"); // Закрываем dropdown
        }
    });
    


    const toggleNavDesktop = document.querySelector(".header-toggle-nav-desktop > span");
    const dropdownNavDesktop = document.querySelector(".header-dropdown-desktop");

    if(toggleNavDesktop){
        toggleNavDesktop.addEventListener("click", function (event) {
            dropdownNavDesktop.classList.toggle("active");
        })
    }
    

    document.addEventListener("click", function (event) {
        if (!dropdownNavDesktop.contains(event.target) && event.target !== toggleNavDesktop) {
            dropdownNavDesktop.classList.remove("active");
        }
    });

    //

    const desktopAvatar = document.getElementById('kt_header_user_menu_toggle');
    const mobileAvatar = document.getElementById('kt_header_mobile_user_menu_toggle');
    const desktopUserMenu = document.querySelector(".menu.menu-sub-dropdown");
    const mobileCloseUserMenu = document.querySelector(".header-account-modal-mobile-close");
    const mobileHeaderUser = document.querySelector(".header-account-mobile");

    document.addEventListener("click", function (event) {
        if (desktopAvatar) {
            if (!desktopUserMenu.contains(event.target) && !desktopAvatar.contains(event.target) && !mobileAvatar.contains(event.target)) {
                desktopUserMenu.classList.remove("show");
            }
        }
    });

    mobileHeaderUser.addEventListener("click", function (event) {
        body.classList.add("overflow");
    });

    mobileCloseUserMenu.addEventListener("click", function (event) {
        desktopUserMenu.classList.remove("show");
        body.classList.remove("overflow");
    });

    //

    const toggleNavMobile = document.querySelectorAll(".header-toggle-nav-mobile > span");
    const closeNavMobile = document.querySelector(".header-bottom-mobile-close");
    const dropdownNavMobile = document.querySelector(".header-bottom.main");
    const scrolledHeader = document.querySelector('.header-scrolled')
    const body = document.querySelector("body");

    if(toggleNavMobile){

        toggleNavMobile.forEach(elem => {
            elem.addEventListener("click", function (event) {
                scrolledHeader.classList.remove('show')
                dropdownNavMobile.classList.add("active");

                body.classList.add("overflow");
            });
        })
        
    }
    
    if(closeNavMobile){
        closeNavMobile.addEventListener("click", function (event) {
            dropdownNavMobile.classList.remove("active");
            if(window.scrollY > 300){
                scrolledHeader.classList.add('show')
            }
            
            body.classList.remove("overflow");
        })
    }

    const menuItemHeaderBottom = document.querySelectorAll('.header-bottom-left .menu-item');
    const contentSections = document.querySelectorAll('.content-section-menu-header');
    
    // Функция для проверки, является ли устройство мобильным
    function isMobile() {
        return window.innerWidth <= 768; // Мобильная версия, если ширина экрана <= 768px
    }
    
    if(menuItemHeaderBottom && isMobile()) {
        menuItemHeaderBottom.forEach(elem => {
            elem.addEventListener("click", function (event) {
                // Проверяем, есть ли у элемента класс active
                if (elem.classList.contains('active')) {
                    // Если есть, удаляем его и скрываем контент
                    elem.classList.remove('active');
                    contentSections.forEach(section => {
                        section.style.display = 'none'; // Скрываем все секции
                    });
                } else {
                    // Если нет, сначала удаляем класс у всех остальных элементов
                    menuItemHeaderBottom.forEach(item => {
                        item.classList.remove('active');
                    });
                    // Скрываем все контентные секции
                    contentSections.forEach(section => {
                        section.style.display = 'none'; // Скрываем все секции
                    });
                    // Добавляем класс только для кликнутого элемента
                    elem.classList.add('active');
                    
                    // Показываем соответствующую секцию, если есть в кликнутом элементе
                    const contentSection = elem.querySelector('.content-section-menu-header');
                    if (contentSection) {
                        contentSection.style.display = 'flex'; // Показываем нужную секцию
                    }
                }
            });
        });
    }
    
    // Слушатель для изменения размеров экрана, чтобы скрипт работал при изменении ширины
    window.addEventListener('resize', () => {
        if (!isMobile()) {
            // Очищаем классы active и скрываем все секции при переходе на десктоп
            menuItemHeaderBottom.forEach(item => {
                item.classList.remove('active');
            });
            contentSections.forEach(section => {
                section.style.display = 'none';
            });
        }
    });
    
    
    
    
    


    //

    function checkScreenWidth() {
        if (window.innerWidth < 796) {
            const dropdownToggleMobile = document.querySelectorAll(".dropdown-toggle-mobile");

            dropdownToggleMobile.forEach(function (toggle) {
                toggle.addEventListener("click", function () {
                    const subMenu = toggle.nextElementSibling; 
                    const parentItem = toggle.closest(".header-dropdown-desktop-item");

                    if (subMenu.style.display === "none" || subMenu.style.display === "") {
                        subMenu.style.display = "block";
                        parentItem.classList.add("active"); 
                    } else {
                        subMenu.style.display = "none";
                        parentItem.classList.remove("active"); 
                    }
                });
            });
        }
    }

    // Вызываем функцию проверки ширины экрана при загрузке страницы и при изменении размеров окна
    checkScreenWidth();
    window.addEventListener("resize", checkScreenWidth);

    // desktop menu

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


    // NEW

    // Функция для извлечения параметров из URL
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Получаем значение параметра currency
    const currency = getQueryParam('currency');
    const currencyHeaderText = document.querySelector('.header-language-content .currency-text')
    // Используем значение currency на странице
    if (currency) {
        currencyHeaderText.textContent = currency;
    }else{
        currencyHeaderText.textContent = 'BYN';
    }
    



});

