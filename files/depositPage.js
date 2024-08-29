const customSelect = document.querySelector('.custom-select-wrapper-balance');
    const customOptions = document.querySelectorAll('.custom-option-balance');
    const customSelectTrigger = document.querySelector('.custom-select-trigger-balance');

    customSelect.addEventListener('click', () => {
      customSelect.querySelector('.custom-select-balance').classList.toggle('open');
    });

    customOptions.forEach(option => {
      option.addEventListener('click', () => {
        customOptions.forEach(option => {
          option.classList.remove('selected');
        });
        option.classList.add('selected');
        customSelectTrigger.textContent = option.textContent;
        customSelect.querySelector('.custom-select-balance').classList.remove('open');
      });
    });

    window.addEventListener('click', (e) => {
      const select = customSelect.querySelector('.custom-select-balance');
      if (!select.contains(e.target)) {
        select.classList.remove('open');
      }
    });

    const amountInput = document.getElementById('amount-notification');
    const optionButtons = document.querySelectorAll('.option-button-notification');
    const checkmark = document.querySelector('.checkmark-notification');

    optionButtons.forEach(button => {
      button.addEventListener('click', function () {
        if (this.classList.contains('active')) {
          // Если кнопка уже активна, сбросить ее
          this.classList.remove('active');
          amountInput.value = '';
          checkmark.style.display = 'none';
        } else {
          // Снять активный класс с других кнопок
          optionButtons.forEach(btn => btn.classList.remove('active'));

          // Добавить активный класс к выбранной кнопке
          this.classList.add('active');

          // Установить значение в input
          amountInput.value = this.dataset.value;

          checkmark.style.display = 'block';
        }
      });
    });

    amountInput.addEventListener('input', function () {
      // Если ввод производится вручную, снять активный класс с кнопок
      optionButtons.forEach(btn => btn.classList.remove('active'));

      if (amountInput.value !== '') {
        checkmark.style.display = 'block';
      } else {
        checkmark.style.display = 'none';
      }
    });

    const depositHeaderBtn = document.querySelector('.header-deposit-balance-wrapper');

    depositHeaderBtn.addEventListener('click',(event)=>{

    })