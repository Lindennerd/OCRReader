(function ($) {
    'use strict'

    window.Tesseract = Tesseract.create({
        workerPath: 'http://localhost:59658/Scripts/Tesseract/worker.js',
        langPath: 'https://cdn.rawgit.com/naptha/tessdata/gh-pages/3.02/',
        corePath: 'http://localhost:59658/Scripts/Tesseract/core.js',
    });

    function readURL(input, img) {

        if (input.get(0).files && input.get(0).files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#'+img).attr('src', e.target.result);
            }

            reader.readAsDataURL(input.get(0).files[0]);
        }
    }

    $.fn.tessify = function (callback) {

        this.change(function (event) {
            event.preventDefault();
            var image = this.get(0).files[0];
            var id = this.attr('id');

            readURL(this, 'preview-'+id);

            Tesseract.recognize(image, { lang: 'por' })
                .progress(function (progress) {
                    $('#progress-'+id).text(progress.status);
                     $('[aria-describedby="progress-'+id+'"]').val(progress.progress);
                }).then(function (result) {
                    $('#confidence-'+id).text(result.confidence)
                    $('#result-'+id).show();
                    if (callback) {
                        callback(result);
                    } 
                });

        }.bind(this))
    }

})(jQuery)