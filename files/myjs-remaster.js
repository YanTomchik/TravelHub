// Функция которая отрисовывает разделители дерева слева в зависимости от высоты блоков

function checkDividersForBlocks(){
    const heightBlocksForDivider = document.querySelectorAll('.col-xl-9-separate-blocks');
    const checkCountMainHeaderBlock = document.querySelectorAll('.card.card-custom.mb-5.separate-block.card-custom-header');
    
    countHeight = 0;
    //Проверяем сколько главных хэдеров-направлений для того 
    //чтобы понимать отобрать ли эти разделители вовсе
    if(checkCountMainHeaderBlock.length != 0){
        
        heightBlocksForDivider.forEach((item,index,arr)=>{
        
            let leftDivider = item.querySelector('.left-divider');
            let leftGreenDivider = document.querySelector('.left-divider-green');
            let leftGreenDividerWrapper = document.querySelector('.left-divider-green-wrapper');
            let allBlocksForDivide = item.querySelectorAll('.card.card-custom.mb-5.separate-block');
            //Берем высоту последнего блока
            let lastBlockHeight = allBlocksForDivide[allBlocksForDivide.length-1].clientHeight;
            
            
            //Отрисовка серого первичного разделителя
            let leftDividerHeight = (item.offsetHeight - lastBlockHeight)+25;
            leftDivider.style.display = 'flex'
            leftDivider.style.height = `${leftDividerHeight}px`;
            
            //проверяем количество блоков направлений, чтобы отображать зеленый разделитель
            if(heightBlocksForDivider.length!=1){
                
            //Отрисовка зеленого разделителя
            leftGreenDividerWrapper.style.display = 'flex'
            let leftGreeDividerHeight = arr[0].clientHeight;
            // alert(leftGreeDividerHeight)
            leftGreenDivider.style.height = `${leftGreeDividerHeight}px`;
            }

            
            if(index !=0){
                let heightForLeftDivider = arr[index-1].offsetHeight +25;
                countHeight += heightForLeftDivider;
                leftDivider.style.top = `${countHeight}px`
            }
        })
        
    }
    
}
//Эту функцию надо запускать при рендере страницы, 
//потому что она динамические отрисовывает разделители для блоков
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
let cardOpenBtns = document.querySelectorAll('.card-header-open-button');

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
const checkboxAgentTourist = document.getElementById('checkboxAgentTourist');
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


//нажатие на верхние кнопки для скролла
document.querySelectorAll('.constructor-status-item-link').forEach(link => {

    link.addEventListener('click', function(e) {
        e.preventDefault();

        let href = this.getAttribute('href');

        const scrollTarget = document.getElementById(href);

        const topOffset = 130; 
        const elementPosition = scrollTarget.getBoundingClientRect().top;
        const offsetPosition = elementPosition - topOffset;

        window.scrollBy({
            top: offsetPosition,
            behavior: 'smooth'
        });
    });
});
