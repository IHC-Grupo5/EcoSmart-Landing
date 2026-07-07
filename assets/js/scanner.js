(function () {
    "use strict";

    function init() {
        var scannerOpts = document.querySelectorAll('.scanner__opt');
        var scannerPlaceholder = document.getElementById('scannerPlaceholder');
        var scannerCard = document.getElementById('scannerCard');
        var scannerHeader = document.getElementById('scannerHeader');
        var scannerCategoria = document.getElementById('scannerCategoria');
        var scannerTacho = document.getElementById('scannerTacho');
        var scannerInstruccion = document.getElementById('scannerInstruccion');

        if (scannerOpts.length) {
            scannerOpts.forEach(function (btn) {
                btn.addEventListener('click', function () {
                    scannerOpts.forEach(function (b) { b.classList.remove('is-active'); });
                    btn.classList.add('is-active');

                    var tipo = btn.getAttribute('data-tipo');
                    var color = btn.getAttribute('data-color');
                    var tacho = btn.getAttribute('data-tacho');
                    var instruccion = btn.getAttribute('data-instruccion');

                    if (scannerPlaceholder) {
                        scannerPlaceholder.style.display = 'flex';
                        scannerPlaceholder.querySelector('p').textContent = 'Analizando residuo…';
                    }
                    if (scannerCard) scannerCard.hidden = true;

                    setTimeout(function () {
                        if (scannerPlaceholder) scannerPlaceholder.style.display = 'none';
                        if (scannerCard) {
                            scannerCard.hidden = false;
                            if (scannerHeader) scannerHeader.style.backgroundColor = color;
                            if (scannerCategoria) scannerCategoria.textContent = tipo;
                            if (scannerTacho) {
                                scannerTacho.textContent = 'Tacho ' + tacho;
                                scannerTacho.style.color = color;
                            }
                            if (scannerInstruccion) scannerInstruccion.textContent = instruccion;
                        }
                    }, 700);
                });
            });
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
