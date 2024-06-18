
function formatNumber(value) {
    return parseFloat(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function updateRewardsBlock(data) {
    console.log(data)
    const currentStatus = data.current;
    const nextStatus = data.next;

    const tierStyles = {
        "1": "bronze",
        "2": "silver",
        "3": "gold"
    };

    const currentStatusToDraw = null !== currentStatus ? tierStyles[currentStatus.tier] : 'default-style';
    const nextStatusToDraw = null !== nextStatus ? tierStyles[nextStatus.tier] : 'default';

    // Обновление описания награды
    const progressBar = document.getElementById('progress-bar-main');
    if (null !== nextStatus) {
        progressBar.style.width = `${Math.min(100, (data.payout / parseFloat(nextStatus.purchaseThreshold)) * 100)}%`;
        document.getElementById('reward-description').innerHTML = `+<b>${formatNumber(nextStatus.purchaseThreshold - data.payout)}</b> USD до`;
    } else if (currentStatus.tier === '3') {
        progressBar.style.width = `100%`;
    }
    progressBar.classList.add(currentStatusToDraw);

    if (currentStatusToDraw != 'default-style') {
        const statusWrapper = document.getElementById('rewards-status-wrapper');
        if(currentStatus.tier != '3'){


            statusWrapper.textContent = nextStatus.title.toUpperCase();
            statusWrapper.classList.add(nextStatusToDraw);
        }else{
            statusWrapper.style.display = 'none';
            document.getElementById('reward-description').style.display = 'none';
            document.querySelector('.rewards-header-more-btn').style.display = 'none';
            document.querySelector('.gold-reward-wrapper').style.display = 'block';
            document.querySelector('.rewards-header-wrapper').style.justifyContent = 'space-around';

        }

        document.getElementById('user-status-title').textContent = currentStatus.title.toUpperCase();

        const rewardIcon = document.getElementById('reward-icon');
        rewardIcon.src = `/images/reward/${currentStatusToDraw}-plane-reward.svg`;

        const rewardsUserMiddle = document.getElementById('rewards-user-middle');
        rewardsUserMiddle.classList.add(currentStatusToDraw);

        //header info
        const descriptionInfoDesktopAccountWrapper = document.querySelector('.description-info-desktop-account-wrapper');
        descriptionInfoDesktopAccountWrapper.classList.add(currentStatusToDraw)

        const descriptionInfoDesktopAccount = document.querySelector('.description-info-desktop-account');
        descriptionInfoDesktopAccount.innerHTML = `${currentStatus.title} статус`;


        const descriptionAccountImg = document.querySelector('.description-info-desktop-account-img');
        descriptionAccountImg.src = `/images/reward/${currentStatusToDraw}-plane-reward.svg`;
    } else {
        document.getElementById('rewards-user-container').classList.add('default-style');
    }

    // Показать блок лояльности после успешного выполнения скрипта
    document.getElementById('rewards-user-container').style.display = 'block';
    document.querySelector('.description-info-desktop-account-wrapper').style.display = 'flex';
    
}

async function fetchDataAndUpdate() {
    try {
        const response = await fetch('/user/loyalty');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        localStorage.setItem('loyaltyData', JSON.stringify(data));
        localStorage.setItem('lastFetchTime', Date.now());

        updateRewardsBlock(data);
    } catch (error) {
        document.getElementById('rewards-user-container').classList.add('default-style');
        console.error('Error fetching data:', error);

    }
}

function init() {
    const storedData = localStorage.getItem('loyaltyData');
    const lastFetchTime = localStorage.getItem('lastFetchTime');

    if (storedData && lastFetchTime && Date.now() - lastFetchTime < 3600000) { // 1 hour in milliseconds
        updateRewardsBlock(JSON.parse(storedData));
    } else {
        fetchDataAndUpdate();
    }

    fetchDataAndUpdate();
}

init();
