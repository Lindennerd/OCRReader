(function ($) {
    'use strict'

    $('input[name="powerbill"]').inputfy('Comprovante de Residência');
    $('input[name="IRPF"]').inputfy('Imposto de Renda');
    $('input[name="additional"]').inputfy('Documentos Adicionais');

    $('input[name="identity"]').inputfy('Identidade', function ( result) {
        
        // construir inteligencia de detecção dos campos do RG (provavelmente por ordem seja a melhor abordagem)
        var wordList = new Array();
        for(var word in result.words){
            result.words[word].choices.map(function(choice){
                if(choice.confidence > 85){
                    wordList.push(choice.text);
                    return choice.text;
                }
            });
        } 
        var regex = new RegexParser(result.text, {
            name: ['NOME(.*)jy'],
            birthDate: ['-SP(.*)\.'],
            reg: ['AL(.*)ExpED']
        })

        regex.runParser(function (parsed) {
            console.log(parsed);
            $('#name').val(parsed.name[1]);
            $('#dtNasc').val(parsed.birthDate[1].replace('.', ''));
            $('#rg').val(parsed.reg[1].replace('_', '-'));
        });
    });


    $('input[type="file"]').change(function (event) {
        var input = $(event.target);
        var id = input.attr('name');

        $('#filename-' + id).text('Arquivo selecionado: ' + input.get(0).files[0].name);
    });

})(jQuery)