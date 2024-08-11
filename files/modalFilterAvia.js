if ($.fancybox) {
    $(document).on('click', '.filters-block-button', function() {
        $('#filters .filters-block-submenus').appendTo('.filter-modal-content');

        $.fancybox.open({
            src: '#filter-modal',
            type: 'inline',
            touch: {
                vertical: false,
                horizontal: false
            },
            afterClose: function() {
                $('.filter-modal-content .filters-block-submenus').appendTo('#filters.filters-block-desktop');
            }
        });
    });
} else {
    console.error('Fancybox is not loaded.');
}
