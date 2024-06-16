// alert()

// Пример JSON данных
const dataX = {
    "payout": 1000,
    "current": {
        "id": 5,
        "type": 0,
        "title": "Серебряный",
        "tier": "2",
        "rewardType": "discount",
        "rewardValue": "5.00",
        "purchaseThreshold": "5000.00"
    },
    "next": {
        "id": 6,
        "type": 0,
        "title": "Золотой",
        "tier": "3",
        "rewardType": "discount",
        "rewardValue": "7.00",
        "purchaseThreshold": "10000.00"
    },
    "all": [
        {
            "id": 1,
            "type": 1,
            "title": "Бронзовый",
            "tier": "1",
            "rewardType": "commission",
            "rewardValue": "0.50",
            "purchaseThreshold": "20000.00"
        },
        {
            "id": 2,
            "type": 1,
            "title": "Серебряный",
            "tier": "2",
            "rewardType": "commission",
            "rewardValue": "0.75",
            "purchaseThreshold": "50000.00"
        },
        {
            "id": 3,
            "type": 1,
            "title": "Золотой",
            "tier": "3",
            "rewardType": "commission",
            "rewardValue": "1.00",
            "purchaseThreshold": "100000.00"
        }
    ]
};

function formatNumber(value) {
    return parseFloat(value).toString();
}

// Функция для обновления блока
function updateRewardsBlock(data) {
    const currentStatus = data.current;
    const nextStatus = data.next;
    let currentStatusToDraw = null;
    let nextStatusToDraw = null;

    if (currentStatus.title == "Бронзовый") {
        currentStatusToDraw = 'bronze';
    } else if (currentStatus.title == "Серебряный") {
        currentStatusToDraw = 'silver';
    } else if (currentStatus.title == "Золотой") {
        currentStatusToDraw = 'gold';
    } else {
        currentStatusToDraw = 'default-style';
    }

    if (nextStatus.title == "Бронзовый") {
        nextStatusToDraw = 'bronze';
    } else if (nextStatus.title == "Серебряный") {
        nextStatusToDraw = 'silver';
    } else if (nextStatus.title == "Золотой") {
        nextStatusToDraw = 'gold';
    } else {
        nextStatusToDraw = 'default';
    }

    if (currentStatusToDraw != 'default-style') {
        // Обновление заголовка статуса
        document.getElementById('user-status-title').textContent = currentStatus.title.toUpperCase();

        // Обновление описания награды
        document.getElementById('reward-description').innerHTML = `+<b>${formatNumber(nextStatus.purchaseThreshold)}</b> usd до`;

        // Обновление статуса
        let statusWrapper = document.getElementById('rewards-status-wrapper');
        statusWrapper.innerHTML = `${nextStatus.title.toUpperCase()}`;
        statusWrapper.classList.add(nextStatusToDraw);

        // Обновление прогресс-бара
        let progressBar = document.getElementById('progress-bar-main');
        // progressBar.className = `progress-bar-main ${statusToDraw}`;
        progressBar.style.width = `${Math.min(100, (data.payout / nextStatus.purchaseThreshold) * 100)}%`;
        progressBar.classList.add(currentStatusToDraw)


        // Обновление изображения
        let rewardIcon = document.getElementById('reward-icon');

        rewardIcon.src = `./images/${currentStatusToDraw}-plane-reward.svg`;

        let rewardsUserMiddle = document.getElementById('rewards-user-middle');
        rewardsUserMiddle.classList.add(currentStatusToDraw)
    }else{
        document.getElementById('rewards-user-container').classList.add('default-style')
    }


}

// Вызов функции для обновления блока
updateRewardsBlock(dataX);

