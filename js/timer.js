
const targetDate = new Date('2024-01-12T00:00:00').getTime();

function updateTimer() {
    const currentDate = new Date().getTime();
    const timeLeft = targetDate - currentDate;

    if (timeLeft <= 0) {
        document.getElementById('days').innerHTML = '00';
        document.getElementById('hours').innerHTML = '00';
        document.getElementById('minutes').innerHTML = '00';
        document.getElementById('seconds').innerHTML = '00';
    } else {
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        let timerDay = document.getElementById('days');
        if (timerDay) 
            timerDay.innerHTML = days < 10 ? '0' + days : days;

        let timerHour = document.getElementById('hours');
        if (timerHour) 
            timerHour.innerHTML = hours < 10 ? '0' + hours : hours;

        let timerMinut = document.getElementById('hours');
        if (timerMinut) 
            timerMinut.innerHTML = minutes < 10 ? '0' + minutes : minutes;

        let timerSecond = document.getElementById('seconds');
            if (timerSecond) 
            timerSecond.innerHTML = seconds < 10 ? '0' + seconds : seconds;
    }
}

setInterval(updateTimer, 1000);