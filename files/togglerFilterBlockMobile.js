// document.querySelector('.filters-block.filters-block-mobile').addEventListener('click',()=>{
//     document.querySelector('.filters-block.filters-block-desktop').classList.toggle('show')
// })

$(document).on('click', '.filters-block-button', function () {
    $('.filters-block-submenus').appendTo('.filter-modal-content');

    $.fancybox.open({
        src: '#filter-modal',
        type: 'inline',
        touch: {
            vertical: false,
            horizontal: false
        },
        afterClose: function () {
            console.log('close');
            $('.filters-block-submenus').appendTo('.filters-block-desktop');
        }
    });
});

$(document).on('click', '.filter-apply-btn-mobile', function () {
    searchForm.submit();
    $.fancybox.close();
    $('.filters-block').appendTo('.filters-block-container');
});
