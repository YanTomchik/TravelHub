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

    const toggleButton = document.querySelector(".header-language > span");
    const dropdown = document.querySelector(".header-language-dropdown");

    // Функция для открытия/закрытия блока
    function toggleDropdown() {
        dropdown.classList.toggle("active");
    }

    if (toggleButton)
        // Открытие/закрытие по клику на <span>
        toggleButton.addEventListener("click", toggleDropdown);

    // Закрытие блока при клике вне блока
    document.addEventListener("click", function (event) {
        if (!dropdown.contains(event.target) && event.target !== toggleButton) {
            dropdown.classList.remove("active");
        }
    });


    const toggleNavDesctop = document.querySelector(".header-toggle-nav-desctop > span");
    const dropdownNavDesctop = document.querySelector(".header-dropdown-desctop");

    if (toggleNavDesctop) {
        toggleNavDesctop.addEventListener("click", function (event) {
            dropdownNavDesctop.classList.toggle("active");
        })
    }

    document.addEventListener("click", function (event) {
        if (!dropdownNavDesctop.contains(event.target) && event.target !== toggleNavDesctop) {
            dropdownNavDesctop.classList.remove("active");
        }
    });

    //

    const desctopAvatar = document.getElementById('kt_header_user_menu_toggle');
    const desctopUserMenu = document.querySelector(".menu.menu-sub-dropdown");
    const mobileCloseUserMenu = document.querySelector(".header-account-modal-mobile-close");
    const mobileHeaderUser = document.querySelector(".header-account-mobile");

    document.addEventListener("click", function (event) {
        if (!desctopUserMenu.contains(event.target) && !desctopAvatar.contains(event.target)) {
            desctopUserMenu.classList.remove("show");
        }
    });

    if (mobileHeaderUser) {
        mobileHeaderUser.addEventListener("click", function (event) {
            body.classList.add("overflow");
        });
    }

    if (mobileCloseUserMenu) {
        mobileCloseUserMenu.addEventListener("click", function (event) {
            desctopUserMenu.classList.remove("show");
            body.classList.remove("overflow");
        });
    }
    //

    const toggleNavMobile = document.querySelector(".header-toggle-nav-mobile > span");
    const closeNavMobile = document.querySelector(".header-bottom-mobile-close");
    const dropdownNavMobile = document.querySelector(".header-bottom");
    const body = document.querySelector("body");

    if (toggleNavMobile) {
        toggleNavMobile.addEventListener("click", function (event) {
            dropdownNavMobile.classList.add("active");
            body.classList.add("overflow");
        });
    }

    if (closeNavMobile) {
        closeNavMobile.addEventListener("click", function (event) {
            dropdownNavMobile.classList.remove("active");
            body.classList.remove("overflow");
        })
    }
    

    //

    function checkScreenWidth() {
        if (window.innerWidth < 796) {
            const dropdownToggleMobile = document.querySelectorAll(".dropdown-toggle-mobile");

            dropdownToggleMobile.forEach(function (toggle) {
                toggle.addEventListener("click", function () {
                    const subMenu = toggle.nextElementSibling; 
                    const parentItem = toggle.closest(".header-dropdown-desctop-item"); 

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

    // desctop menu

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

