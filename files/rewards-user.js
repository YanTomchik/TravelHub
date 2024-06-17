function formatNumber(value) {
    return parseFloat(value).toFixed(2);
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

    const currentStatusToDraw = tierStyles[currentStatus.tier] || 'default-style';
    const nextStatusToDraw = tierStyles[nextStatus.tier] || 'default';
    

    if (currentStatusToDraw != 'default-style') {

        document.getElementById('user-status-title').textContent = currentStatus.title.toUpperCase();
        document.getElementById('reward-description').innerHTML = `+<b>${formatNumber(nextStatus.purchaseThreshold)}</b> USD до`;

        const statusWrapper = document.getElementById('rewards-status-wrapper');
        statusWrapper.textContent = nextStatus.title.toUpperCase();
        statusWrapper.classList.add(nextStatusToDraw);

        const progressBar = document.getElementById('progress-bar-main');
        progressBar.style.width = `${Math.min(100, (data.payout / parseFloat(nextStatus.purchaseThreshold)) * 100)}%`;
        progressBar.classList.add(currentStatusToDraw);

        const rewardIcon = document.getElementById('reward-icon');
        rewardIcon.src = `./images/${currentStatusToDraw}-plane-reward.svg`;

        const rewardsUserMiddle = document.getElementById('rewards-user-middle');
        rewardsUserMiddle.classList.add(currentStatusToDraw);

        //header info
        const descriptionInfoDesktopAccountWrapper = document.querySelector('.description-info-desktop-account-wrapper');
        descriptionInfoDesktopAccountWrapper.classList.add(currentStatusToDraw)

        const descriptionInfoDesktopAccount = document.querySelector('.description-info-desktop-account');
        descriptionInfoDesktopAccount.innerHTML = `${currentStatus.title} статус`;


        const descriptionAccountImg = document.querySelector('.description-info-desktop-account-img');
        descriptionAccountImg.src = `./images/${currentStatusToDraw}-plane-reward.svg`;

    } else {
        document.getElementById('rewards-user-container').classList.add('default-style');
    }
}

async function fetchDataAndUpdate() {
    try {
        const response = await fetch('https://travelhub.by/user/loyalty');
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