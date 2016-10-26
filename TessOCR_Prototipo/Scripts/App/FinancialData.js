(function ($) {
    'use strict'

    var accountList = new Array();

    watch(accountList, function () {
        var table = $('#accountList');
        table.children().remove();

        var rows = accountList.map(function (account, index) {
            return '<tr data-key="'+index+'">' +
                    '<td> <input type="checkbox" class="chb">  </td>' +
                    '<td>' + account.bank + '</td>' +
                    '<td>' + account.account + '</td>' +
                    '<td>' + account.agency + '</td>' +
                    '<td>' + account.digit + '</td>' +
                   '</tr>'
        });

        table.append(rows);

        $('.chb').change(function (event) {
            var checked = $(this).is(':checked');
            $(".chb").prop('checked', false);
            if (checked) {
                $(this).prop('checked', true);
            }
        });

        if (accountList.length > 0) {
            $('#remove-account').removeClass('disabled');
            $('#edit-account').removeClass('disabled');
        } else {
            table.append('<tr><td>Nenhuma conta adicionada</td></tr>')
            $('#remove-account').addClass('disabled');
            $('#edit-account').addClass('disabled');
        }
    });

    $('#add-account').click(function (event) {
        var account = {
            bank: $('#bank').val(),
            account: $('#account').val(),
            agency: $('#agency').val(),
            digit: $('#digit').val()
        }

        accountList.push(account);
        clearFields();

    });

    $('#remove-account').click(function (event) {
        event.preventDefault();

        var accounts = getAllSelectedAccount();
        $.each(accounts, function (index, row) {
            var indexOf = $(row).attr('data-key');
            accountList.splice(indexOf, 1);
        });
    });

    $('#edit-account').click(function (event) {
        event.preventDefault();

        var accounts = getAllSelectedAccount();
        $.each(accounts, function (index, row) {
            var itens = $(row).find('td');
            $('#bank').val(itens[1].textContent);
            $('#account').val(itens[2].textContent);
            $('#agency').val(itens[3].textContent);
            $('#digit').val(itens[4].textContent);
            accountList.splice($(row).attr('data-key'), 1);
        });
    });

    function getAllSelectedAccount() {
        return $('#accountList').find('input[type="checkbox"]:checked').parent().parent();
    }

    function clearFields () {  
        $('#bank').val('');
        $('#account').val('');
        $('#agency').val('');
        $('#digit').val('');
    }

})(jQuery)