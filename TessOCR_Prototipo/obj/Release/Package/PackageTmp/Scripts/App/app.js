(function ($) {
    'use strict'

    window.Tesseract = Tesseract.create({
        workerPath: 'http://localhost:59658/Scripts/Tesseract/worker.js',
        langPath: 'https://cdn.rawgit.com/naptha/tessdata/gh-pages/3.02/',
        corePath: 'http://localhost:59658/Scripts/Tesseract/core.js',
    });

    $.fn.inputfy = function (inputType, callback) {
        var id = this.attr('name');

        this.change(function (event) {
            $('#filename-' + id).text('Arquivo selecionado: ' + this.get(0).files[0].name);
        }.bind(this));

        $('#viewer-' + id).click(function (event) {
            event.preventDefault();
            if (this.get(0).files && this.get(0).files[0]) {
                $('#viewer').show('slow');
                $('#close').click(function (event) {
                    event.preventDefault();
                    $('#viewer').hide('slow');
                })
                renderImage(inputType, this.get(0).files[0], function (type) {
                    if (type === 'img') {
                        $('#recognize').removeClass('disabled');
                        $('#linearize').removeClass('disabled');
                        $('#reset').removeClass('disabled');
                        this.tessify(id, callback);
                    }
                }.bind(this));
            }
        }.bind(this))
    }

    $.fn.tessify = function (id, callback) {
        var fileInput = this;

        $('#recognize').click(function (event) {
            event.preventDefault();
            if ($(event.target).hasClass('disabled')) {
                return false;
            }

            var canvas = document.getElementById('canvas-viewer');
            var image = new Image();
            image.src = canvas.toDataURL();

            Tesseract.recognize(image, { lang: 'por' })
                .progress(function (progress) {
                    $('#modal-output').modal({ keyboard: false });
                    $('#modal-output').modal('show');
                    $('button[data-dismiss="modal"]').addClass('disabled');

                    $('#progress').text(progress.status);
                    $('[aria-describedby="progress"]').val(progress.progress);
                }).then(function (result) {
                    $('[aria-describedby="progress"]').addClass('progress-success');
                    $('#progress').text('Processamento concluído. Confiança de ' + result.confidence);
                    $('button[data-dismiss="modal"]').removeClass('disabled');

                    if (callback) {
                        callback(result);
                    }


                });

        }.bind(this))

        $('#linearize').click(function (event) {
            event.preventDefault();
            if (!$(event.target).hasClass('disabled')) {
                Caman('#canvas-viewer', function () {
                    this.sinCity().render();
                });
            }
        });

        $('#reset').click(function (event) {
            event.preventDefault();
            if (!$(event.target).hasClass('disabled')) {
                Caman('#canvas-viewer', function () {
                    this.revert(false);
                    this.render();
                });
            }
        })

        $('button[data-dismiss="modal"]').on('hidden.bs.modal', function (e) {
            $('[aria-describedby="progress"]').removeClass('progress-success');
        })
    }

    function renderImage(inputType, file, callback) {
        resetViwer(function () {
            var reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = function (event) {
                $('#filename').text(inputType + ' - ' + file.name);

                if (file.name.toUpperCase().endsWith('.PNG')
                    || file.name.toUpperCase().endsWith('.JPG')
                    || file.name.toUpperCase().endsWith('.JPEG')
                    || file.name.toUpperCase().endsWith('.GIF')) {
                    var image = new Image();
                    image.crossOrigin = '';
                    image.src = event.target.result;

                    image.onload = function () {
                        var canvas = document.getElementById('canvas-viewer');
                        var ctx = canvas.getContext('2d');
                        canvas.width = image.width;
                        canvas.height = image.height;
                        ctx.drawImage(image, 0, 0, image.width, image.height);

                        callback('img');
                        $('#close').removeClass('disabled');
                    }
                } else {
                    $('#canvas-viewer').hide();
                    $('#object-viewer').show();
                    $('#embed-viewer').show();

                    $('#object-viewer').attr('src', event.target.result);
                    $('#embed-viewer').attr('src', event.target.result);

                    callback('file');
                }
            }
        });
    }

    function resetViwer(callback) {
        $('#filename').text('');
        document.getElementById('is-img').innerHTML = '<canvas id="canvas-viewer" class="card-img" data-caman-hidpi-disabled="true"></canvas>';
        document.getElementById('not-img').innerHTML = '<object class="card-img-alt" style="display: none" id="object-viewer">' +
            '<embed class="card-img-alt" style="display: none" id="embed-viewer"></embed></object>';

        callback();
    }

    //* -- For Tests -- *
    $('#fillform').click(function (event) {
        event.preventDefault();

        $('#name').val('Luiz Paulo');
        $('#rg').val('51144100108');
        $('#dtNasc').val('11/12/1992');
        $('#emailInput').val('luiz.paulo@powerbrasil.com.br');
        $('#civilState').val('solteiro');
        $('#link').val('1');
        $('#profession').val('Desenvolvedor');
        $('#company').val('Power Imaging');
        $('#isUnemployed').checked = false;
        $('#montly-revenue').val('2500');
        $('#other-revenue').val('420');
        $('#financial-apply').val('15000');
        $('#possessions').val('100000');
        $('#real-state').val('50000');

        window.accountList.push({
            bank: 'Itau',
            account: '456',
            agency: '0444',
            digit: '5'
        });
    })

})(jQuery)