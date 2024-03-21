// Функция которая отрисовывает разделители дерева слева в зависимости от высоты блоков

function checkDividersForBlocks(){
    const heightBlocksForDivider = document.querySelectorAll('.col-xl-9-separate-blocks');
    count = 0;
    heightBlocksForDivider.forEach((item,index,arr)=>{
        
        let leftDivider = item.querySelector('.left-divider');
        let leftGreenDivider = document.querySelector('.left-divider-green');
        let allBlocksForDivide = item.querySelectorAll('.card.card-custom.mb-5.separate-block');
        let lastBlockHeight = allBlocksForDivide[allBlocksForDivide.length-1].clientHeight;
        
        //Отрисовка серого первичного разделителя
        let leftDividerHeight = (item.offsetHeight - lastBlockHeight)+25;
        leftDivider.style.height = `${leftDividerHeight}px`;

        //Отрисовка зеленого разделителя
        let leftGreeDividerHeight = arr[0].clientHeight;
        // alert(leftGreeDividerHeight)
        leftGreenDivider.style.height = `${leftGreeDividerHeight}px`;
        
        if(index !=0){
            let heightForLeftDivider = arr[index-1].offsetHeight +25;
            count += heightForLeftDivider;
            leftDivider.style.top = `${count}px`
            

            
        }
    })
}

checkDividersForBlocks()


// Скрипт копирования при нажатии на кнопку
const copyLinkBtn = document.querySelectorAll('.copy-link-btn');

copyLinkBtn.forEach((item)=>{
    item.addEventListener("click", function() {
        let itemContentHref = item.getAttribute('href');
        navigator.clipboard.writeText(itemContentHref)
        .then(function() {
            // alert('Text copied to clipboard');
        }).catch(function(error) {
            console.error('Error:', error);
        });
    });
})

// Скрипт открытия на стрелку хэдера
const cardOpenBtns = document.querySelectorAll('.card-header-open-button');

cardOpenBtns.forEach((item)=>{
    item.addEventListener("click", function() {
        let cardBodyToOpenBlock = item.parentElement.parentElement;
        
        cardBodyToOpenBlock.classList.toggle('opened');
        checkDividersForBlocks()
    });
})

// Скрипт открытия на стрелку внутри хэдера
const rowOpenBtns = document.querySelectorAll('.row-header-open-button');

rowOpenBtns.forEach((item)=>{
    item.addEventListener("click", function() {
        let rowBodyToOpenBlock = item.parentElement.parentElement.nextElementSibling;
        let iconRowOpen = item.firstElementChild;
        iconRowOpen.classList.toggle('active')
        rowBodyToOpenBlock.classList.toggle('opened');
        checkDividersForBlocks()
    });
})

// Скрипт открытия модального окна удаления
const deleteBtnsHeader = document.querySelectorAll('.delete-icon-wrapper');

deleteBtnsHeader.forEach((item)=>{
    item.addEventListener("click", function() {
        let modalBoxToDelete = document.getElementById('deleteHeaderBlock');
        modalBoxToDelete.classList.toggle('show')
    });
})

// Скрипт закрытия модального окна удаления
const closeModalDeleteWrapper = document.querySelectorAll('.modal.fade .close');

closeModalDeleteWrapper.forEach((item)=>{
    item.addEventListener("click", function() {
        let modalBoxToDelete = document.getElementById('deleteHeaderBlock');
        modalBoxToDelete.classList.toggle('show')
    });
})



// скрипт для проверки тоглера агент турист и отображение комиссии
const checkboxAgentTourist = document.querySelector('.checkboxAgentTourist');
const comissionBlockPrice = document.querySelector('.basket-item-price-item.comission');
const comissionBlockSummary = document.querySelector('.basket-summary-item.comission');

checkboxAgentTourist.addEventListener("click", function() {
        if (checkboxAgentTourist.checked) {
            // alert('Checkbox is checked');
            comissionBlockPrice.style.display = 'none'
            comissionBlockSummary.style.display = 'none'
          } else {
            
            comissionBlockPrice.style.display = 'flex'
            comissionBlockSummary.style.display = 'none'
          }
});


const modalBlockTourist = document.getElementById('touristChangeModal');

const closeModalTouristBtn = document.querySelector('.closeModalTourist');

closeModalTouristBtn.addEventListener("click", function() {
    modalBlockTourist.style.display = 'none'
})