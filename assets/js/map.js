(function () {
    "use strict";

    function init() {
        var contenedorMapa = document.getElementById('mapaIot');
        if (!contenedorMapa) return;


        // Centro del distrito 
        var CENTRO = [-12.0464, -77.0428]; 
        var ZOOM_INICIAL = 15;

        var map = L.map('mapaIot', {
            scrollWheelZoom: false,
            zoomControl: true
        }).setView(CENTRO, ZOOM_INICIAL);

        setTimeout(function () {
            map.invalidateSize();
        }, 250);

        window.addEventListener('resize', function () {
            map.invalidateSize();
        });

        map.on('click', function () { map.scrollWheelZoom.enable(); });
        map.on('mouseout', function () { map.scrollWheelZoom.disable(); });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        // --- Datos simulados de contenedores inteligentes
        var contenedoresData = [
            { lat: -12.0445, lng: -77.0440, nombre: 'Cont. Ca. Tomás E.', categoria: 'Plástico / Vidrio', nivel: 42 },
            { lat: -12.0470, lng: -77.0410, nombre: 'Cont. Guillermo Marconi', categoria: 'Papel / Cartón', nivel: 78 },
            { lat: -12.0480, lng: -77.0450, nombre: 'Cont. Av. Dos de Mayo (1)', categoria: 'Orgánicos', nivel: 91 },
            { lat: -12.0430, lng: -77.0400, nombre: 'Cont. C. Barcelona', categoria: 'General', nivel: 15 },
            { lat: -12.0490, lng: -77.0400, nombre: 'Cont. Av. Dos de Mayo (2)', categoria: 'Electrónicos', nivel: 30 }
        ];

        // --- Rutas simuladas de camiones recolectores 
        var camionesData = [
            {
                nombre: 'Camión 01',
                ruta: [
                    [-12.0420, -77.0460], [-12.0430, -77.0420], [-12.0450, -77.0390],
                    [-12.0470, -77.0420], [-12.0460, -77.0455]
                ],
                duracionSegmento: 4000
            },
            {
                nombre: 'Camión 02',
                ruta: [
                    [-12.0500, -77.0430], [-12.0490, -77.0460], [-12.0475, -77.0475],
                    [-12.0460, -77.0460], [-12.0480, -77.0435]
                ],
                duracionSegmento: 4500
            }
        ];

        function nivelInfo(nivel) {
            if (nivel >= 85) {
                return { texto: nivel + '% lleno — Requiere recogida', icono: 'mapa-marker-icon--lleno', nivelClase: 'mapa-popup__nivel--critico' };
            }
            if (nivel >= 60) {
                return { texto: nivel + '% lleno', icono: 'mapa-marker-icon--medio', nivelClase: 'mapa-popup__nivel--alto' };
            }
            return { texto: nivel + '% lleno', icono: 'mapa-marker-icon--disponible', nivelClase: '' };
        }

        function crearIcono(claseColor, emoji) {
            return L.divIcon({
                className: '',
                html: '<div class="mapa-marker-icon ' + claseColor + '"><span>' + emoji + '</span></div>',
                iconSize: [30, 30],
                iconAnchor: [15, 29],
                popupAnchor: [0, -28]
            });
        }

        // --- Capas separadas para poder filtrar (US63 - Escenario 2) ---
        var capaContenedores = L.layerGroup().addTo(map);
        var capaCamiones = L.layerGroup().addTo(map);

        contenedoresData.forEach(function (c) {
            var info = nivelInfo(c.nivel);
            var marker = L.marker([c.lat, c.lng], { icon: crearIcono(info.icono, '📍') });
            marker.bindPopup(
                '<div class="mapa-popup">' +
                '<strong>' + c.nombre + '</strong>' +
                '<span>' + c.categoria + '</span>' +
                '<span class="mapa-popup__nivel ' + info.nivelClase + '">Llenado: ' + info.texto + '</span>' +
                '</div>'
            );
            marker.addTo(capaContenedores);
        });

        function animarCamion(marker, ruta, duracionSegmento) {
            var indice = 0;

            function siguienteSegmento() {
                var inicio = ruta[indice];
                var fin = ruta[(indice + 1) % ruta.length];
                var inicioTiempo = null;

                function paso(timestamp) {
                    if (!inicioTiempo) inicioTiempo = timestamp;
                    var t = Math.min((timestamp - inicioTiempo) / duracionSegmento, 1);
                    var lat = inicio[0] + (fin[0] - inicio[0]) * t;
                    var lng = inicio[1] + (fin[1] - inicio[1]) * t;
                    marker.setLatLng([lat, lng]);
                    if (t < 1) {
                        requestAnimationFrame(paso);
                    } else {
                        indice = (indice + 1) % ruta.length;
                        siguienteSegmento();
                    }
                }
                requestAnimationFrame(paso);
            }
            siguienteSegmento();
        }

        camionesData.forEach(function (t) {
            var marker = L.marker(t.ruta[0], { icon: crearIcono('mapa-marker-icon--camion', '🚛') });
            marker.bindPopup(
                '<div class="mapa-popup">' +
                '<strong>' + t.nombre + '</strong>' +
                '<span>En ruta de recolección</span>' +
                '</div>'
            );
            marker.addTo(capaCamiones);
            animarCamion(marker, t.ruta, t.duracionSegmento);
        });

        var filtroBtns = document.querySelectorAll('.mapa__filtro-btn');
        filtroBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                filtroBtns.forEach(function (b) { b.classList.remove('is-active'); });
                btn.classList.add('is-active');

                var filtro = btn.dataset.filtro;

                if (filtro === 'todos' || filtro === 'contenedor') {
                    if (!map.hasLayer(capaContenedores)) map.addLayer(capaContenedores);
                } else {
                    map.removeLayer(capaContenedores);
                }

                if (filtro === 'todos' || filtro === 'camion') {
                    if (!map.hasLayer(capaCamiones)) map.addLayer(capaCamiones);
                } else {
                    map.removeLayer(capaCamiones);
                }
            });
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
