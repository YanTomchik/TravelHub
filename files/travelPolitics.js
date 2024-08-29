document.addEventListener('DOMContentLoaded', function () {

    document.querySelectorAll('.custom-select-politics').forEach(select => {
        
        const selectBox = select.querySelector('.select-box-politics');
        const options = select.querySelector('.select-options-politics');
        const label = select.querySelector('.select-label-politics');
        
        selectBox.addEventListener('click', function (event) {
            event.stopPropagation(); 
            
            const isOptionsVisible = options.style.display === 'block';
                        
            document.querySelectorAll('.select-options-politics').forEach(opt => {
                opt.style.display = 'none';
            });
            
            if (!isOptionsVisible) {
                options.style.display = 'block';
            }
        });

        options.querySelectorAll('.option-politics').forEach(option => {
            option.addEventListener('click', function () {
                label.textContent = this.textContent; 
                options.style.display = 'none'; 
            });
        });
    });


    document.querySelectorAll('.info-politics-item').forEach(infoItem => {
        // Находим заголовок и иконку внутри каждого элемента
        const header = infoItem.querySelector('.header-info-politics-item');
        const chevronContainer = header.querySelector('.header-title-chevron'); // Найти контейнер иконки
        const chevron = chevronContainer.querySelector('img'); // Найти иконку внутри контейнера

        header.addEventListener('click', function () {
            // Проверяем текущее состояние видимости блоков
            const isAnyGroupVisible = Array.from(infoItem.querySelectorAll('.group-info-politics-item'))
                .some(group => group.style.display !== 'none');

            // Переключаем видимость всех блоков .group-info-politics-item внутри текущего info-politics-item
            infoItem.querySelectorAll('.group-info-politics-item').forEach(group => {
                // Если хотя бы один блок видим, скрываем все, иначе показываем все
                group.style.display = isAnyGroupVisible ? 'none' : 'block';
            });

            // Переключение класса для вращения иконки
            chevron.classList.toggle('rotate-180', !isAnyGroupVisible);

            // Скрываем блоки и сбрасываем вращение в других .info-politics-item
            document.querySelectorAll('.info-politics-item').forEach(otherItem => {
                if (otherItem !== infoItem) {

                    const otherChevron = otherItem.querySelector('.header-title-chevron img');
                    if (otherChevron) {
                        otherChevron.classList.remove('rotate-180');
                    }
                }
            });
        });
    });

    const popupOverlay = document.getElementById('popupOverlay');
    const closePopupBtn = document.getElementById('popupClose');
    const bodyTag = document.body;

    document.querySelectorAll('.politics-edit-btn').forEach(elem=>{
        elem.addEventListener('click',()=>{
            popupOverlay.style.display = 'flex';
            bodyTag.style.overflow = 'hidden';
        })
    })
    
    closePopupBtn.addEventListener('click', function () {
        popupOverlay.style.display = 'none';
        bodyTag.style.overflow = 'auto';
    });

    popupOverlay.addEventListener('click', function (e) {
        if (e.target === popupOverlay) {
            popupOverlay.style.display = 'none';
            bodyTag.style.overflow = 'auto';
        }
    });

});
