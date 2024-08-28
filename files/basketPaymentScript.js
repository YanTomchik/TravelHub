const tabs = document.querySelectorAll('.payment-header-btn');
    const contents = document.querySelectorAll('.payment-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            tabs.forEach(t => t.classList.remove('active'));

            this.classList.add('active');

            contents.forEach(content => content.classList.remove('active'));

            const targetId = this.getAttribute('data-target');
            const targetContent = document.getElementById(targetId);

            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });