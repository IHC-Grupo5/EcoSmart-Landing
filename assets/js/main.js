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

})();