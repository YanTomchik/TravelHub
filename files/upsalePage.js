document.querySelectorAll('.list-sidebar-item').forEach(item => {
    // Переменные для хранения активных элементов
    let activeItem = null;
    let activePricingTable = null;

    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
        // Добавляем обработчик события click на каждый элемент .list-sidebar-item
        item.addEventListener('click', function () {
            // Находим родительский элемент wrapper
            const wrapper = this.closest('.list-sidebar-item-wrapper');

            // Находим pricing-table внутри этого wrapper
            const pricingTable = wrapper.querySelector('.pricing-table');

            // Ищем кнопку "Показать еще 20" внутри текущего wrapper
            const showMoreButton = wrapper.querySelector('.show-more-button-esim');

            // Закрываем предыдущий активный элемент и его таблицу, если они существуют и отличаются от текущего
            if (activeItem && activeItem !== this) {
                activeItem.classList.remove('active');
                if (activePricingTable) {
                    activePricingTable.classList.remove('active');
                    if (showMoreButton) {
                        showMoreButton.style.display = 'none'; // Скрываем кнопку, связанную с предыдущим активным элементом
                    }
                }
            }

            // Переключаем класс active на текущем элементе
            this.classList.toggle('active');

            // Если таблица найдена, переключаем ее видимость
            if (pricingTable) {
                pricingTable.classList.toggle('active');
            }

            // Если текущий элемент был активным и стал неактивным, скрываем кнопку "Показать еще 20"
            if (!this.classList.contains('active') && showMoreButton) {
                showMoreButton.style.display = 'none'; // Скрываем кнопку
            }

            // Обновляем ссылки на активные элементы
            activeItem = this.classList.contains('active') ? this : null;
            activePricingTable = this.classList.contains('active') ? pricingTable : null;

            // Логика отображения первых 20 элементов и добавления кнопки "Показать еще 20"
            if (pricingTable && this.classList.contains('active')) {
                const items = pricingTable.querySelectorAll('.pricing-item'); // Получаем все элементы .pricing-item внутри таблицы

                // Устанавливаем видимость первых 20 элементов
                items.forEach((item, index) => {
                    if (index < 20) {
                        item.classList.add('visible'); // Добавляем класс visible первым 20 элементам
                    } else {
                        item.classList.remove('visible'); // Удаляем класс visible с остальных элементов
                    }
                });

                if (items.length > 20) {
                    // Показываем кнопку, если элементов больше 20
                    showMoreButton.style.display = 'block';
                } else {
                    // Скрываем кнопку, если элементов меньше или равно 20
                    showMoreButton.style.display = 'none';
                }

                let visibleCount = 20; // Количество отображаемых элементов

                // Обработчик события для кнопки "Показать еще 20"
                showMoreButton.addEventListener('click', function () {
                    const nextItems = Array.from(items).slice(visibleCount, visibleCount + 20); // Следующие 20 элементов

                    // Делаем следующие 20 элементов видимыми
                    nextItems.forEach(item => item.classList.add('visible'));

                    visibleCount += 20; // Обновляем количество отображаемых элементов

                    // Если больше нечего показывать, скрываем кнопку
                    if (visibleCount >= items.length) {
                        showMoreButton.style.display = 'none';
                    }
                });
            }
        });
    }else{
        item.addEventListener('click', function (event) {
            // Получаем значение атрибута data-name для определения соответствующей таблицы
            const nameBlock = item.dataset.name;
        
            // Проверяем, имеет ли текущий элемент класс 'active'
            const isActive = this.classList.contains('active');
        
            // Убираем класс active у всех list-sidebar-item и скрываем все таблицы
            document.querySelectorAll('.list-sidebar-item').forEach(sidebarItem => {
              sidebarItem.classList.remove('active');
            });
        
            const pricingTableList = document.querySelectorAll('.right-block-upsale .pricing-table');
            pricingTableList.forEach(elem => {
              elem.style.display = 'none'; // Скрываем все таблицы
            });
        
            // Если элемент не был активным, делаем его активным и показываем соответствующую таблицу
            if (!isActive) {
              this.classList.add('active'); // Добавляем класс active на текущий кликнутый элемент
        
              // Показать соответствующую таблицу
              pricingTableList.forEach(elem => {
                const tableId = elem.getAttribute('id');
                if (tableId === nameBlock) {
                  elem.style.display = 'block'; // Показываем соответствующую таблицу
                }
              });
            }
          });
    }

});

// Добавляем обработчики ко всем элементам с классом .flight-mobile-popup-info-card
document.querySelectorAll('.extra-bottom-popup-btn').forEach((popupTrigger) => {
    
    const popupId = popupTrigger.getAttribute('data-popup-target'); // Получаем id целевого попапа
    
    const popup = document.querySelector(popupId); // Находим соответствующий попап
    const popupContent = popup.querySelector('.extra-bottom-popup-wrapper'); // Находим контент внутри попапа

    // Обработчик для открытия попапа при нажатии на враппер
    popupTrigger.addEventListener('click', function () {
        openPopup(popup);
    });

    // Закрыть по клику на пустую область
    popup.addEventListener('click', function (e) {
        if (e.target === popup) {
            closePopup(popup);
        }
    });

    // Переменные для отслеживания свайпа
    let startY, currentY, isDragging = false;

    popupContent.addEventListener('touchstart', function (e) {
        startY = e.touches[0].clientY;
        isDragging = true;
        popupContent.style.transition = 'none'; // Отключаем анимацию во время свайпа
    });

    popupContent.addEventListener('touchmove', function (e) {
        if (!isDragging) return;

        currentY = e.touches[0].clientY;
        let translateY = Math.max(0, currentY - startY); // Ограничиваем только положительные значения (движение вниз)
        popupContent.style.transform = `translateY(${translateY}px)`; // Перемещаем элемент вниз
    });

    popupContent.addEventListener('touchend', function () {
        isDragging = false;
        popupContent.style.transition = 'transform 0.3s ease'; // Включаем анимацию для плавного возврата

        if (currentY - startY > 100) { // Если свайп вниз больше 100 пикселей, закрываем попап
            closePopup(popup);
        } else {
            popupContent.style.transform = 'translateY(0)'; // Возвращаем в исходное положение
        }
    });
});

// Функция открытия попапа
function openPopup(popup) {
    popup.classList.remove('hidden'); // Убираем класс hidden, чтобы показать попап
}

// Функция закрытия попапа
function closePopup(popup) {
    const popupContent = popup.querySelector('.extra-bottom-popup-wrapper');
    popupContent.style.transform = 'translateY(100%)'; // Анимация закрытия вниз
    setTimeout(() => {
        popup.classList.add('hidden');
        popupContent.style.transform = 'translateY(0)'; // Сброс позиции
    }, 300); // Ждем завершения анимации
}

const backBtnFlightPopup = document.querySelectorAll('.flight-mobile-popup-btn-back')

backBtnFlightPopup.forEach(elem=>{
    elem.addEventListener('click', ()=>{      
        elem.parentElement.parentElement.classList.remove('opened')
    })
})

const addFlightOpenPopupBtn = document.querySelectorAll('.add-flight');

addFlightOpenPopupBtn.forEach(elem=>{
    elem.addEventListener('click', ()=>{      
        elem.nextElementSibling.classList.add('opened')
    })
})