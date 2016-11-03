(function ($) {
    'use strict'

    $('form').submit(function (event) {
        event.preventDefault();
        var formData = new FormData();

        formData.append("personalData", JSON.stringify({
            Name: $('#name').val(),
            RG: $('#rg').val(),
            BirthDate: $('#dtNasc').val(),
            Email: $('#emailInput').val(),
            CivilState: $('#civilState').val(),
            Link: $('#link').val(),
            Profession: $('#profession').val(),
            Company: $('#company').val(),
            IsUnemployed: $('#isUnemployed').checked
        }));

        formData.append('financialData', JSON.stringify({
            Accounts: JSON.stringify(window.accountList)
        }));

        formData.append('revenueData', JSON.stringify({
            MontlyRevenue: $('#montly-revenue').val(),
            OtherRevenue: $('#other-revenue').val(),
            FinancialApply: $('#financial-apply').val(),
            Possession: $('#possessions').val(),
            RealState: $('#real-state').val()
        }));

        formData.append('identity', $('input[name="identity"]').get(0).files.length > 0
                ? $('input[name="identity"]').get(0).files[0] : null);

        formData.append('powerbill', $('input[name="powerbill"]').get(0).files.length > 0
                ? $('input[name="powerbill"]').get(0).files[0] : null);

        formData.append('IRPF', $('input[name="IRPF"]').get(0).files.length > 0
                ? $('input[name="IRPF"]').get(0).files[0] : null);

        formData.append('additional', $('input[name="additional"]').get(0).files.length > 0
                ?  $('input[name="additional"]').get(0).files[0] : null);

        if ($('#emailInput').val() === '') {
            alert('O campo email não pode estar em branco');
            return;
        }

        if ($('#rg').val() === '') {
            alert('O campo RG não pode estar em branco');
            return;
        }

        $.ajax({
            url: $(event.target).attr('action'),
            type: 'POST',
            data: formData,
            success: function (data) {
                window.location.reload();
            },
            cache: false,
            contentType: false,
            processData: false,
            xhr: function () {  // Custom XMLHttpRequest
                var myXhr = $.ajaxSettings.xhr();
                if (myXhr.upload) { // Avalia se tem suporte a propriedade upload
                    myXhr.upload.addEventListener('progress', function () {
                        console.log('uploading...')
                    }, false);
                }
                return myXhr;
            }
        });
    })

})(jQuery)