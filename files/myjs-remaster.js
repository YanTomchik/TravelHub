// Функция которая отрисовывает разделители дерева слева в зависимости от высоты блоков
function checkDividersForBlocks(){
    const heightBlocksForDivider = document.querySelectorAll('.col-xl-9-separate-blocks');
count = 0;
    heightBlocksForDivider.forEach((item,index,arr)=>{
        // alert(index)
        
        let leftDivider = item.querySelector('.left-divider');
        let allBlocksForDivide = item.querySelectorAll('.card.card-custom.mb-5.separate-block');
        let lastBlockHeight = allBlocksForDivide[allBlocksForDivide.length-1].clientHeight;
        // alert(lastBlockHeight)
        let leftDividerHeight = (item.offsetHeight - lastBlockHeight)+25;
        leftDivider.style.height = `${leftDividerHeight}px`;
        
        if(index !=0){
            let heightForLeftDivider = arr[index-1].offsetHeight +22;
            count += heightForLeftDivider;
            leftDivider.style.top = `${count}px`
            alert(count)
        }
    })
}


checkDividersForBlocks()
