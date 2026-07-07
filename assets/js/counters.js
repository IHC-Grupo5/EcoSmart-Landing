(function () {
    "use strict";

    function init() {
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
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
