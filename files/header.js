document.addEventListener("DOMContentLoaded", function () {
    const tabHeaders = document.querySelectorAll(".language-tab");
    const tabContents = document.querySelectorAll(".language-content");

    const tabHeadersMobile = document.querySelectorAll(".language-tab");
    const tabContentsMobile = document.querySelectorAll(".language-content");

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

    const toggleButton = document.querySelector(".header-language > span");
    const toggleButtonmobile = document.querySelector(".header-right-block-sub-menu .header-language > span");
    const dropdown = document.querySelector(".header-language-dropdown");
    const dropdownMobile = document.querySelector(".header-right-block-sub-menu .header-language-dropdown");

    // Функция для открытия/закрытия блока
    function toggleDropdown() {
        dropdown.classList.toggle("active");
    }

    function toggleDropdownMobile() {
        dropdownMobile.classList.toggle("active");
    }

    // Открытие/закрытие по клику на <span>
    toggleButton.addEventListener("click", toggleDropdown);

    // Открытие/закрытие по клику на <span>
    toggleButtonmobile.addEventListener("click", toggleDropdownMobile);

    // Закрытие блока при клике вне блока
    document.addEventListener("click", function (event) {
        if (!dropdown.contains(event.target) && event.target !== toggleButton) {
            dropdown.classList.remove("active");
        }
    });


    const toggleNavDesktop = document.querySelector(".header-toggle-nav-desktop > span");
    const dropdownNavDesktop = document.querySelector(".header-dropdown-desktop");

    toggleNavDesktop.addEventListener("click", function (event) {
        dropdownNavDesktop.classList.toggle("active");
    })

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

    const toggleNavMobile = document.querySelector(".header-toggle-nav-mobile > span");
    const closeNavMobile = document.querySelector(".header-bottom-mobile-close");
    const dropdownNavMobile = document.querySelector(".header-bottom");
    const body = document.querySelector("body");

    toggleNavMobile.addEventListener("click", function (event) {
        dropdownNavMobile.classList.add("active");
        body.classList.add("overflow");
    });

    closeNavMobile.addEventListener("click", function (event) {
        dropdownNavMobile.classList.remove("active");
        body.classList.remove("overflow");
    })


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

});

