(function () {
    "use strict";

    var hamburgerBtn = document.getElementById("hamburgerBtn");
    var mobileMenu = document.getElementById("mobileMenu");
    var navbar = document.getElementById("navbar");
    var mobileLinks = document.querySelectorAll(".navbar__mobile-link");

    function openMenu() {
        mobileMenu.classList.add("is-open");
        hamburgerBtn.classList.add("is-open");
        hamburgerBtn.setAttribute("aria-expanded", "true");
        mobileMenu.setAttribute("aria-hidden", "false");
    }

    function closeMenu() {
        mobileMenu.classList.remove("is-open");
        hamburgerBtn.classList.remove("is-open");
        hamburgerBtn.setAttribute("aria-expanded", "false");
        mobileMenu.setAttribute("aria-hidden", "true");
    }

    function toggleMenu() {
        if (mobileMenu.classList.contains("is-open")) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener("click", toggleMenu);
    }

    mobileLinks.forEach(function (link) {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", function (e) {
        if (
            mobileMenu &&
            mobileMenu.classList.contains("is-open") &&
            !navbar.contains(e.target)
        ) {
            closeMenu();
        }
    });

    function onScroll() {
        if (window.scrollY > 10) {
            navbar.style.boxShadow = "0 4px 20px rgba(0,0,0,0.2)";
        } else {
            navbar.style.boxShadow = "0 2px 16px rgba(0,0,0,0.12)";
        }
    }

    window.addEventListener("scroll", onScroll, { passive: true });

    var internalLinks = document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach(function (link) {
        link.addEventListener("click", function (e) {
            var targetId = link.getAttribute("href");
            if (targetId === "#") return;

            var target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();

            var navbarHeight = navbar ? navbar.offsetHeight : 0;
            var targetTop =
                target.getBoundingClientRect().top + window.scrollY - navbarHeight;

            window.scrollTo({
                top: targetTop,
                behavior: "smooth",
            });
        });
    });

    var faqItems = document.querySelectorAll('.faq__item');
    if (faqItems.length) {
        faqItems.forEach(function (item) {
            var btn = item.querySelector('.faq__question');
            var answer = item.querySelector('.faq__answer');

            if (!btn || !answer) return;

            btn.addEventListener('click', function () {
                var isOpen = item.classList.contains('is-open');

                faqItems.forEach(function (i) {
                    i.classList.remove('is-open');

                    var a = i.querySelector('.faq__answer');
                    if (a) a.style.maxHeight = '0';
                });

                if (!isOpen) {
                    item.classList.add('is-open');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        });
    }

    var contactForm = document.getElementById('contactForm');
    var formSuccess = document.getElementById('formSuccess');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var valid = true;
            var fields = contactForm.querySelectorAll('[required]');

            fields.forEach(function (field) {
                var wrapper = field.closest('.form__group');
                var error = wrapper ? wrapper.querySelector('.form__error') : null;

                field.classList.remove('is-invalid');

                if (error) {
                    error.style.display = 'none';
                }

                if (!field.value.trim()) {
                    valid = false;
                    field.classList.add('is-invalid');

                    if (error) {
                        error.style.display = 'block';
                    }
                } else if (field.type === 'email') {
                    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                    if (!emailRe.test(field.value.trim())) {
                        valid = false;
                        field.classList.add('is-invalid');

                        if (error) {
                            error.textContent = 'Ingresa un correo válido.';
                            error.style.display = 'block';
                        }
                    }
                }
            });

            if (valid) {
                contactForm.style.display = 'none';

                if (formSuccess) {
                    formSuccess.style.display = 'block';
                }
            }
        });
    }

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

    var counters = document.querySelectorAll('.impacto__num');

    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
            || window.innerWidth < 900;
    }

    document.querySelectorAll('.seg-card__cta').forEach(function (button) {
        button.addEventListener('click', function (e) {
            e.preventDefault();

            var isMobile = isMobileDevice();
            var destination = isMobile
                ? button.getAttribute('data-mobile-href')
                : button.getAttribute('data-desktop-href');

            if (!destination || destination === '#') {
                if (isMobile) {
                    window.location.href = 'https://play.google.com/';
                } else {
                    window.location.href = 'municipal-login.html';
                }
                return;
            }

            window.location.href = destination;
        });
    });

    function animateCounter(el) {
        var target = parseInt(el.getAttribute('data-target'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        var duration = 1800;
        var start = null;
        var startVal = 0;

        function step(timestamp) {
            if (!start) start = timestamp;
            var progress = Math.min((timestamp - start) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = Math.floor(startVal + eased * (target - startVal));
            el.textContent = current.toLocaleString('es-PE') + suffix;
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target.toLocaleString('es-PE') + suffix;
        }
        requestAnimationFrame(step);
    }

    if (counters.length && 'IntersectionObserver' in window) {
        var counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        counters.forEach(function (counter) {
            counterObserver.observe(counter);
        });
    } else {
        counters.forEach(function (counter) { animateCounter(counter); });
    }

})();

(function () {
    var contenedorMapa = document.getElementById('mapaIot');
    if (!contenedorMapa) return;

    if (typeof L === 'undefined') {
        contenedorMapa.innerHTML = '<div class="mapa__fallback">El mapa interactivo no pudo cargarse. Recarga la página o verifica tu conexión a internet.</div>';
        return;
    }

    // Centro del distrito 
    var CENTRO = [-12.0464, -77.0428]; // Lima, Perú
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
})();