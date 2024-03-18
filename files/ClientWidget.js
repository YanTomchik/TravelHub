const $clientDocsInput = $('#client-docs');
const $clientBirthdayInput = $('#client-birthday');
const $clientChooseButton =  $('#clientmanager_choose_button');
const $clientForm = $('#kt_form_edit_client');
const $clientModal = $('#touristChangeModal');
const fullValidation = $('[name=fullValidation]').length;

function clearClientForm() {
    $('#client-id').val('');
    $('#client-firstname').val('');
    $('#client-lastname').val('');
    $('#client-patronymicname').val('');
    $('#client-firstnameen').val('');
    $('#client-lastnameen').val('');
    $('#client-tin').val('');
    $('#client-address').val('');
    $('#client-email').val('');
    $('#client-phone').val('').change();
    $('#client-nationality').val('').trigger('change');
    $('#client-sex').val('').trigger('change');

    $clientBirthdayInput.datepicker('destroy');
    $clientBirthdayInput.val('');
    $clientBirthdayInput.datepicker({
        format: 'dd.mm.yyyy',
        todayHighlight: true,
        autoclose: true,
        endDate: '0d'
    });

    $clientDocsInput.multipleInput('clear');
    addEmptyClientDoc();
    $('#touristChangeModal .datepicker-inputmask').mask('99.99.9999');
    clearClientFormErrors();
}

function addEmptyClientDoc() {
    if (fullValidation) {
        $clientDocsInput.multipleInput('add', {
            'id': 0,
            'kind': 'PASSPORT',
            'number': '',
            'issuedat': '',
            'expireat': '',
            'choosenDoc': ''
        });

        $('.document-choose-radio input[type="radio"]').prop('checked', true);
    }
}

function clearClientFormErrors() {
    $('#touristChangeModal .help-block').empty();
    $('#touristChangeModal .form-group').removeClass('.has-error');
}

function getClientData(id, callback, select = false) {
    var url = '/clients/client/' + id;
    if (select) {
        url += '?select=' + select;
    }
    $.ajax({
        url: url,
        type: 'get',
        success: function (response) {
            if (response.error) {
                alert(response.error);
            } else if (callback && typeof callback === 'function') {
                callback(response);
            }
        },
        error: function () {
            alert(clientModalWidgetTranslation.formErrorLoading);
        }
    });
}

function fillClientForm(data) {
    $clientForm.find('input, select, textarea').off('change', onClientFormChange);
    clearClientFormErrors();
    $('#client-id').val(data.id);
    $('#client-firstname').val(data.firstName);
    $('#client-lastname').val(data.lastName);
    $('#client-patronymicname').val(data.patronymicName);
    $('#client-firstnameen').val(data.firstNameEn);
    $('#client-lastnameen').val(data.lastNameEn);
    $('#client-tin').val(data.tin);
    $('#client-address').val(data.address);
    $('#client-email').val(data.email);
    $('#client-phone').val(data.phone).trigger('change');
    $('#client-nationality').val(data.nationality).trigger('change');
    $('#client-sex').val(data.sex).trigger('change');

    $clientBirthdayInput.datepicker('destroy');
    $clientBirthdayInput.val(data.birthDay);
    $clientBirthdayInput.datepicker({
        format: 'dd.mm.yyyy',
        todayHighlight: true,
        autoclose: true,
        endDate: '0d'
    });

    $clientDocsInput.multipleInput('clear');
    if (data.docs && data.docs.length > 0) {
        for (var i = 0; i < data.docs.length; i++) {
            var doc = data.docs[i];
            $clientDocsInput.multipleInput('add', {
                'id': doc.id,
                'kind': doc.kind,
                'number': doc.number,
                'issuedat': doc.issuedAt,
                'expireat': doc.expireAt,
                'issuedby': doc.issuedBy
            });
            if (i === 0) {
                $('.document-choose-radio input[type="radio"]').prop('checked', true);
            }
        }
    } else {
        addEmptyClientDoc();
    }

    $('#touristChangeModal .datepicker-inputmask').mask('99.99.9999');
    if  ($clientChooseButton.length) {
        $clientChooseButton.prop('disabled', false);
    }
    $clientForm.find('input, select, textarea').not('input[type="hidden"], input[type="radio"]').on('change', onClientFormChange);
}

function fillErrors(data) {
    clearClientFormErrors();
    if (data.errors) {
        $.each(data.errors, function (fieldName, errorText) {
            var formGroup = $clientForm.find('.field-' + fieldName.toLowerCase());
            formGroup.addClass('has-error');
            formGroup.find('.help-block').text(errorText);
        });
    } else if (data.docsErrors) {
        $.each(data.docsErrors, function (index, docsErrors) {
            var row = $clientForm.find('.multiple-input-list__item:eq(' + index + ')');

            $.each(docsErrors, function (fieldName, errorText) {
                var field = row.find('[id*="client-docs-"][id*="-' + fieldName.toLowerCase() + '"]');
                var formGroup = field.closest('.col-sm-12');

                if (!formGroup.find('.help-block').length) {
                    formGroup.append('<div class="help-block"></div>');
                }

                formGroup.addClass('has-error');
                formGroup.find('.help-block').text(errorText);
            });
        });
    }
}

function checkClientType(birthDateString) {
    var clientType = $clientModal.data('client-type');

    if (!clientType || !birthDateString) {
        return true;
    }

    var birthDate = moment(birthDateString, "DD.MM.YYYY");
    var today = moment();
    var age = today.diff(birthDate, 'years');

    var selectedClientType = age >= 18 ? 'adult' : 'child';
    if (clientType != selectedClientType) {
        if (clientType == 'adult') {
            $('.common-help-block').text(clientModalWidgetTranslation.errorAdult);
        }
        if (clientType == 'child') {
            $('.common-help-block').text(clientModalWidgetTranslation.errorKid);
        }
    } else {
        return true;
    }

    return false;
}

function checkIsDocNeeded() {
    if (!$('.js-input-remove').length && fullValidation) {
        $('.doc-help-block').text(clientModalWidgetTranslation.docIsNeeded);
        return false;
    }

    return true;
}

function onClientFormChange() {
    if ($clientChooseButton.length) {
        $clientChooseButton.prop('disabled', true);
    }
    if ($('#client-id').val() && !$('.edited-hint-block').html()) {
        // add ajax request to check is orders exists
        $('.edited-hint-block').text(clientModalWidgetTranslation.clientChanged);
    }
}

$(document).ready(function() {
    $('.document-choose-radio input[type="radio"]').eq(0).prop('checked', true);

    if ($clientChooseButton.length) {
        $clientChooseButton.click(function (e) {
            clearClientFormErrors();
            $.ajax({
                url: '/clients/validate',
                type: 'POST',
                data: $clientForm.serialize(),
                success: function (data) {
                    if (data.errors) {
                        fillErrors(data);
                    } else {
                        getClientData($('#client-id').val(), function(response) {
                            if (checkClientType(response.birthDay) && checkIsDocNeeded()) {
                                var $choosenDoc = $clientModal.find('.document-choose-radio input[type="radio"]:checked').closest('.multiple-input-list__item');
                                var choosedDocId = $choosenDoc.find('.document-id').val();
                                clientModalChooseClient(response, choosedDocId);
                            }
                        }, true);
                    }
                },
            });
        });
    }
});

$(document).on('submit', '#kt_form_edit_client', function() {
    clearClientFormErrors();

    $.ajax({
        url: '/clients/validate',
        type: 'POST',
        data: $clientForm.serialize(),
        success: function (data) {
            if (data.errors) {
                fillErrors(data);
                checkClientType($('#kt_form_edit_client #client-birthday').val());
                checkIsDocNeeded();
            } else {
                if (checkClientType($('#kt_form_edit_client #client-birthday').val()) === false || checkIsDocNeeded() === false) {
                    return false;
                } else {
                    $.ajax({
                        url: '/clients/update',
                        type: 'POST',
                        data: $clientForm.serialize(),
                        success: function (data) {
                            if (data.result) {
                                if ($clientChooseButton.length) {
                                    getClientData(data.result.id, function(response) {
                                        clientModalChooseClient(response, data.result.usingDocId);
                                    }, true);
                                    return false;
                                }

                                var tr = $('.client-edit[data-id="' + data.result.id + '"]').closest('tr');
                                if (!tr.length) {
                                    window.location.reload();
                                }
                                tr.find('[data-field="name"] span').text(data.result.firstName + ' ' + data.result.patronymicName + ' ' + data.result.lastName);
                                tr.find('[data-field="phone"] span').text(data.result.phone);
                                tr.find('[data-field="email"] span').text(data.result.email);
                                modalBlock.modal('hide');
                            } else {
                                fillErrors(data);
                            }
                        },
                    });
                }
            }
        },
    });

    return false;
});

$(document).on('change', '.document-choose-radio input[type="radio"]', function() {
    var selectedName = $(this).attr('name');

    $('.document-choose-radio input[type="radio"]').each(function() {
        if ($(this).attr('name') !== selectedName) {
            $(this).prop('checked', false);
        }
    });
});

$(document).on('change', '#client-nationality', function() {
    $clientDocsInput.multipleInput('clear');
})

$(document).on('afterInit', '#client-docs', function(e, row) {
    if ($('.multiple-input-list .datepicker-inputmask').length) {
        $('.multiple-input-list .datepicker-inputmask').mask('99.99.9999');
    }
});

$(document).on('afterAddRow', '#client-docs', function(e, row) {
    var index = $(row).data('index');
    var $issuedAt = $('#client-docs-' + index + '-issuedat');
    var $expireAt = $('#client-docs-' + index + '-expireat');

    $issuedAt.datepicker({
        format: 'dd.mm.yyyy',
        todayHighlight: true,
        autoclose: true,
        endDate: '0d'
    });

    $expireAt.datepicker({
        format: 'dd.mm.yyyy',
        todayHighlight: true,
        autoclose: true,
        startDate: '+1d'
    });

    $expireAt.mask('99.99.9999');
    $issuedAt.mask('99.99.9999');

    if ($('.document-choose-radio input[type="radio"]:checked').length === 0) {
        $('.document-choose-radio input[type="radio"]').eq(0).prop('checked', true);
    }
});

$clientModal.on('hide.bs.modal', function (e) {
    if (e.target.id === 'touristChangeModal') {
        clearClientForm();
        $('#kt_datatable_select_client').val('').trigger('change');
    }
});

$clientModal.on('show.bs.modal', function (e) {
    var clientId = $clientModal.data('client-id');
    if (e.target.id === 'touristChangeModal' && clientId) {
        getClientData(clientId, function(response) {
            fillClientForm(response);
        });
    }
});


$('#kt_datatable_select_client').on('select2:select', function (e) {
    getClientData(e.params.data.id, function(response) {
        fillClientForm(response);
    });
});

$('#kt_datatable_select_client').on('select2:unselect', function (e) {
    clearClientForm();
});
