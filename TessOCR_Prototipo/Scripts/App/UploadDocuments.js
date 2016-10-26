(function ($) {
    'use strict'

    $('#identity').tessify(function (result) {
    	var text = result.text;
    	console.log(result.text);
    	$('#modal-output-text').val(result.text);
    	$('#modal-output').modal('show');
    });
    $('#powerbill').tessify();
    $('#IRPF').tessify();
    $('#additional').tessify();

})(jQuery)