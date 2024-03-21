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
            let heightForLeftDivider = arr[index-1].offsetHeight +22;
            count += heightForLeftDivider;
            leftDivider.style.top = `${count}px`
            

            
        }
    })
}

checkDividersForBlocks()



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


const cardOpenBtns = document.querySelectorAll('.card-header-open-button');

cardOpenBtns.forEach((item)=>{
    item.addEventListener("click", function() {
        let cardBodyToOpenBlock = item.parentElement.parentElement;
        
        cardBodyToOpenBlock.classList.toggle('opened');
        checkDividersForBlocks()
    });
})


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

const deleteBtnsHeader = document.querySelectorAll('.delete-icon-wrapper');

deleteBtnsHeader.forEach((item)=>{
    item.addEventListener("click", function() {
        let modalBoxToDelete = document.getElementById('deleteHeaderBlock');
        modalBoxToDelete.classList.toggle('show')
    });
})


const closeModalDeleteWrapper = document.querySelectorAll('.modal.fade .close');

closeModalDeleteWrapper.forEach((item)=>{
    item.addEventListener("click", function() {
        let modalBoxToDelete = document.getElementById('deleteHeaderBlock');
        modalBoxToDelete.classList.toggle('show')
    });
})




