(function () {
    "use strict";

    function init() {
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
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
