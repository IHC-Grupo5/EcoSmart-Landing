(function () {
    "use strict";

    function init() {
        var hamburgerBtn = document.getElementById("hamburgerBtn");
        var mobileMenu = document.getElementById("mobileMenu");
        var navbar = document.getElementById("navbar");
        var mobileLinks = document.querySelectorAll(".navbar__mobile-link");

        function openMenu() {
            if (mobileMenu && hamburgerBtn) {
                mobileMenu.classList.add("is-open");
                hamburgerBtn.classList.add("is-open");
                hamburgerBtn.setAttribute("aria-expanded", "true");
                mobileMenu.setAttribute("aria-hidden", "false");
            }
        }

        function closeMenu() {
            if (mobileMenu && hamburgerBtn) {
                mobileMenu.classList.remove("is-open");
                hamburgerBtn.classList.remove("is-open");
                hamburgerBtn.setAttribute("aria-expanded", "false");
                mobileMenu.setAttribute("aria-hidden", "true");
            }
        }

        function toggleMenu() {
            if (mobileMenu && mobileMenu.classList.contains("is-open")) {
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
                navbar &&
                mobileMenu.classList.contains("is-open") &&
                !navbar.contains(e.target)
            ) {
                closeMenu();
            }
        });

        function onScroll() {
            if (navbar) {
                if (window.scrollY > 10) {
                    navbar.style.boxShadow = "0 4px 20px rgba(0,0,0,0.2)";
                } else {
                    navbar.style.boxShadow = "0 2px 16px rgba(0,0,0,0.12)";
                }
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
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
