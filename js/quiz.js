document.addEventListener("DOMContentLoaded", function () {
    const quizSteps = document.querySelectorAll('.quiz-step');
    const numSteps = quizSteps.length;
    const quizNav = document.querySelector('.quiz-nav');

    for (let i = 0; i < numSteps; i++) {
        const dot = document.createElement('div');
        dot.className = 'quiz-dot';
        quizNav.appendChild(dot);
    }

    const dots = document.querySelectorAll('.quiz-dot');

    dots[0].classList.add('active');

    dots.forEach((dot, index) => {
        dot.addEventListener('click', function () {
            showStep(index + 1);
        });
    });

    function showStep(stepIndex) {
        quizSteps.forEach(step => {
            step.style.display = 'none';
        });

        quizSteps[stepIndex - 1].style.display = 'block';

        dots.forEach(dot => {
            dot.classList.remove('active');
        });

        dots[stepIndex - 1].classList.add('active');
    }

    const labels = document.querySelectorAll('.quiz-step[data-quiz] label.custom-checkbox-label--quiz');
    labels.forEach((label, index) => {
        label.addEventListener('click', function () {
            const currentStep = label.closest('.quiz-step');
            const nextStep = currentStep.nextElementSibling;
            
            if (nextStep && nextStep.classList.contains('quiz-step')) {
                showStep(Array.from(quizSteps).indexOf(nextStep) + 1);
            }
        });
    });
});