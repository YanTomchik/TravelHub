var $activeClient = null;
var $basketClientModal = $('#touristChangeModal');
$(document).on('click', '.basket-client-choose-button', function(e, row) {
    $activeClient = $(this).closest('.client-row').find('table');
    $basketClientModal.data('client-type', $activeClient.data('client-type'));
    $basketClientModal.data('client-id', $activeClient.find('[data-client-id]').val());
    $basketClientModal.modal('show');
});

function clientModalChooseClient(data, choosedDocId) {
    $activeClient.find('[data-client-name]').text(data.lastName + ' ' + data.firstName + ' ' + data.patronymicName);
    $activeClient.find('[data-client-firstNameEn]').text(data.firstNameEn);
    $activeClient.find('[data-client-lastNameEn]').text(data.lastNameEn);
    $activeClient.find('[data-client-sex]').text(data.sex ? data.sex : translationsHub.notSet);
    $activeClient.find('[data-client-birthDay]').text(data.birthDay);
    $activeClient.find('[data-client-phone]').text(data.phone);
    $activeClient.find('[data-client-nationality]').text(data.nationality ? data.nationality : translationsHub.notSet);
    $activeClient.find('[data-client-id]').val(data.id);
    if (data.docs && data.docs.length > 0) {
        for (var i = 0; i < data.docs.length; i++) {
            var doc = data.docs[i];
            if (doc.id  == choosedDocId) {
                var docText = doc.kind + ': ' + doc.number + ', ' + translationsHub.expireAt + ' ' + doc.expireAt;
                $activeClient.find('[data-client-doc]').text(docText);
                $activeClient.find('[data-client-doc-id]').val(doc.id);
            }
        }
    }

    $basketClientModal.modal('hide');
    $activeClient.parent().find('.help-block').empty().removeClass('has-error');
    $activeClient.show();
}
