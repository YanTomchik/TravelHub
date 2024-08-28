const tabs = document.querySelectorAll('.payment-header-btn');
    const contents = document.querySelectorAll('.payment-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            // Удаляем класс active у всех табов
            tabs.forEach(t => t.classList.remove('active'));
            // Добавляем класс active к текущему табу
            this.classList.add('active');

            // Скрываем все контенты
            contents.forEach(content => content.classList.remove('active'));

            // Находим и показываем соответствующий контент по data-target атрибуту
            const targetId = this.getAttribute('data-target');
            const targetContent = document.getElementById(targetId);

            // Добавляем класс active только нужному контенту
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });