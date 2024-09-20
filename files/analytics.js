

document.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            // Закрываем другие открытые элементы
            document.querySelectorAll('.menu-item').forEach(el => {
                if (el !== item) el.classList.remove('open');
            });
            // Открываем выбранный элемент
            item.classList.toggle('open');
            console.log(item)
        });
    });

    const ctx = document.getElementById('expenseChart').getContext('2d');

    const data = {
        labels: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июль', 'Сентябрь', 'Октябрь', 'Ноябрь'],
        datasets: [
            {
                label: 'Авиабилеты',
                backgroundColor: '#FF4E50',
                data: [220000, 50000, 20000, 10000, 5000, 70000, 0, 20000, 10000],
                barThickness: 40
            },
            {
                label: 'ЖД билеты',
                backgroundColor: '#4682B4',
                data: [0, 30000, 0, 0, 0, 0, 0, 10000, 15000],
                barThickness: 40
            },
            {
                label: 'Отели',
                backgroundColor: '#FFD700',
                data: [0, 0, 0, 0, 0, 50000, 0, 0, 5000],
                barThickness: 40
            },
            {
                label: 'Трансферы',
                backgroundColor: '#8B4513',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 3000],
                barThickness: 40
            },
            {
                label: 'Другие',
                backgroundColor: '#008000',
                data: [0, 0, 0, 600000, 0, 0, 0, 0, 0],
                barThickness: 40
            }
        ]
    };

    const config = {
        type: 'bar',
        data: data,
        options: {
            maintainAspectRatio: false,
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 100000
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#000'
                    }
                }
            },
            interaction: {
                mode: 'nearest'
            },
            barPercentage: 1.0,
            categoryPercentage: 1.0,
            grouped: false // Отключает группировку столбцов
        }
    };

        new Chart(ctx, config);

});