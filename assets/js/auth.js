(function () {
    "use strict";

    function init() {
        var registerForm = document.getElementById('registerForm');
        var registerSuccess = document.getElementById('registerSuccess');
        var registerFooterLink = document.getElementById('registerFooterLink');
        var authInfoBox = document.getElementById('authInfoBox');

        if (registerForm) {
            registerForm.addEventListener('submit', function (e) {
                e.preventDefault();

                var valid = true;
                var fields = registerForm.querySelectorAll('.auth-form__input[required]');

                fields.forEach(function (field) {
                    var wrapper = field.closest('.auth-form__group');
                    var error = wrapper ? wrapper.querySelector('.auth-form__error') : null;

                    field.classList.remove('is-invalid');

                    if (error) {
                        error.style.display = 'none';
                    }

                    var value = field.value.trim();

                    if (!value) {
                        valid = false;
                        field.classList.add('is-invalid');

                        if (error) {
                            if (field.id === 'rucInst') {
                                error.textContent = 'Campo obligatorio.';
                            } else if (field.id === 'correoRepresentante') {
                                error.textContent = 'Campo obligatorio.';
                            } else if (field.id === 'passwordReg') {
                                error.textContent = 'Campo obligatorio.';
                            } else if (field.id === 'passwordConfirm') {
                                error.textContent = 'Campo obligatorio.';
                            } else {
                                error.textContent = 'Campo obligatorio.';
                            }
                            error.style.display = 'block';
                        }
                    } else {
                        // Check format validations
                        if (field.id === 'rucInst') {
                            var rucRe = /^\d{11}$/;
                            if (!rucRe.test(value)) {
                                valid = false;
                                field.classList.add('is-invalid');
                                if (error) {
                                    error.textContent = 'Ingresa un RUC válido de 11 dígitos.';
                                    error.style.display = 'block';
                                }
                            }
                        } else if (field.id === 'correoRepresentante') {
                            var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                            if (!emailRe.test(value)) {
                                valid = false;
                                field.classList.add('is-invalid');
                                if (error) {
                                    error.textContent = 'Ingresa un correo institucional válido.';
                                    error.style.display = 'block';
                                }
                            }
                        } else if (field.id === 'passwordReg') {
                            if (value.length < 8) {
                                valid = false;
                                field.classList.add('is-invalid');
                                if (error) {
                                    error.textContent = 'Mínimo 8 caracteres.';
                                    error.style.display = 'block';
                                }
                            }
                        } else if (field.id === 'passwordConfirm') {
                            var passVal = document.getElementById('passwordReg').value.trim();
                            if (value !== passVal) {
                                valid = false;
                                field.classList.add('is-invalid');
                                if (error) {
                                    error.textContent = 'Las contraseñas no coinciden.';
                                    error.style.display = 'block';
                                }
                            }
                        }
                    }
                });

                if (valid) {
                    // Save user data to localStorage
                    var registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
                    var newUser = {
                        nombreEntidad: document.getElementById('nombreEntidad').value.trim(),
                        rucInst: document.getElementById('rucInst').value.trim(),
                        nombreRepresentante: document.getElementById('nombreRepresentante').value.trim(),
                        cargoInst: document.getElementById('cargoInst').value.trim(),
                        correoRepresentante: document.getElementById('correoRepresentante').value.trim(),
                        passwordReg: document.getElementById('passwordReg').value.trim()
                    };
                    
                    // Avoid duplicates by email:
                    registeredUsers = registeredUsers.filter(function (u) {
                        return u.correoRepresentante !== newUser.correoRepresentante;
                    });
                    registeredUsers.push(newUser);
                    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

                    registerForm.style.display = 'none';

                    if (registerFooterLink) {
                        registerFooterLink.style.display = 'none';
                    }

                    if (authInfoBox) {
                        authInfoBox.style.display = 'none';
                    }

                    var registerTitle = document.getElementById('registerTitle');
                    if (registerTitle) {
                        registerTitle.style.display = 'none';
                    }

                    if (registerSuccess) {
                        registerSuccess.removeAttribute('hidden');
                        registerSuccess.style.display = 'block';
                    }
                }
            });

            // Real-time clearing of error styles
            registerForm.querySelectorAll('.auth-form__input').forEach(function (input) {
                input.addEventListener('input', function () {
                    input.classList.remove('is-invalid');
                    var wrapper = input.closest('.auth-form__group');
                    var error = wrapper ? wrapper.querySelector('.auth-form__error') : null;
                    if (error) {
                        error.style.display = 'none';
                    }
                });
            });
        }

        var loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', function (e) {
                e.preventDefault();

                var valid = true;
                var fields = loginForm.querySelectorAll('.auth-form__input[required]');
                var loginGeneralError = document.getElementById('loginGeneralError');

                if (loginGeneralError) {
                    loginGeneralError.style.display = 'none';
                }

                fields.forEach(function (field) {
                    var wrapper = field.closest('.auth-form__group');
                    var error = wrapper ? wrapper.querySelector('.auth-form__error') : null;

                    field.classList.remove('is-invalid');

                    if (error) {
                        error.style.display = 'none';
                    }

                    var value = field.value.trim();

                    if (!value) {
                        valid = false;
                        field.classList.add('is-invalid');
                        if (error) {
                            error.style.display = 'block';
                        }
                    } else if (field.type === 'email') {
                        var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRe.test(value)) {
                            valid = false;
                            field.classList.add('is-invalid');
                            if (error) {
                                error.style.display = 'block';
                            }
                        }
                    }
                });

                if (valid) {
                    var emailVal = document.getElementById('correoInst').value.trim();
                    var passVal = document.getElementById('passwordInst').value.trim();

                    var registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
                    
                    var foundUser = registeredUsers.find(function (user) {
                        return user.correoRepresentante === emailVal && user.passwordReg === passVal;
                    });

                    if (foundUser) {
                        localStorage.setItem('currentMunicipalUser', JSON.stringify(foundUser));
                        window.location.href = 'municipal-dashboard.html';
                    } else {
                        fields.forEach(function (field) {
                            field.classList.add('is-invalid');
                        });
                        if (loginGeneralError) {
                            loginGeneralError.style.display = 'block';
                        }
                    }
                }
            });

            // Real-time clearing of error styles
            loginForm.querySelectorAll('.auth-form__input').forEach(function (input) {
                input.addEventListener('input', function () {
                    input.classList.remove('is-invalid');
                    var wrapper = input.closest('.auth-form__group');
                    var error = wrapper ? wrapper.querySelector('.auth-form__error') : null;
                    if (error) {
                        error.style.display = 'none';
                    }
                    var loginGeneralError = document.getElementById('loginGeneralError');
                    if (loginGeneralError) {
                        loginGeneralError.style.display = 'none';
                    }
                });
            });
        }

        function getDistrictFromEntidad(entidad) {
            if (!entidad) return "";
            var lower = entidad.toLowerCase();
            if (lower.indexOf("municipalidad de ") === 0) {
                return entidad.substring("municipalidad de ".length);
            }
            if (lower.indexOf("municipalidad ") === 0) {
                return entidad.substring("municipalidad ".length);
            }
            return entidad;
        }

        var dashboardPages = [
            'municipal-dashboard.html',
            'municipal-rutas.html',
            'municipal-inventario.html',
            'municipal-alertas.html',
            'municipal-estadisticas.html',
            'municipal-usuarios.html',
            'municipal-configuracion.html'
        ];

        var currentPage = window.location.pathname.split('/').pop();
        var isDashboardPage = dashboardPages.some(function (page) {
            return currentPage.indexOf(page) !== -1;
        });

        if (isDashboardPage) {
            var currentUserStr = localStorage.getItem('currentMunicipalUser');
            if (!currentUserStr) {
                window.location.href = 'municipal-login.html';
            } else {
                var currentUser = JSON.parse(currentUserStr);
                
                // 1. Update muni name
                var muniNameEl = document.getElementById('muniNameConfig');
                if (muniNameEl) {
                    muniNameEl.textContent = currentUser.nombreEntidad || 'Municipalidad';
                }
                
                // 2. Update RUC
                var muniRucEl = document.getElementById('muniRucConfig');
                if (muniRucEl) {
                    muniRucEl.textContent = currentUser.rucInst || '';
                }
                
                // 3. Update District
                var muniDistrictEl = document.getElementById('muniDistrictConfig');
                if (muniDistrictEl) {
                    muniDistrictEl.textContent = getDistrictFromEntidad(currentUser.nombreEntidad);
                }
                
                // 4. Update Admin Email
                var adminEmailEl = document.getElementById('adminEmailConfig');
                if (adminEmailEl) {
                    adminEmailEl.textContent = currentUser.correoRepresentante || '';
                }
                var adminEmailAlerts = document.getElementById('adminEmailAlerts');
                if (adminEmailAlerts) {
                    adminEmailAlerts.textContent = currentUser.correoRepresentante || '';
                }
                
                // 5. Update Admin Name
                var adminNameEl = document.getElementById('adminNameConfig');
                if (adminNameEl) {
                    adminNameEl.textContent = currentUser.nombreRepresentante || '';
                }
                
                // 6. Update Admin Cargo
                var adminCargoEl = document.getElementById('adminCargoConfig');
                if (adminCargoEl) {
                    adminCargoEl.textContent = currentUser.cargoInst || '';
                }

                // 7. Update Route Title
                var routeTitleEl = document.getElementById('routeTitle');
                if (routeTitleEl) {
                    var district = getDistrictFromEntidad(currentUser.nombreEntidad);
                    routeTitleEl.textContent = 'Ruta ' + (district || 'Miraflores') + ' Norte';
                }
            }
        }

        // Logout handling
        var logoutBtn = document.querySelector('.dash-sidebar__logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function () {
                localStorage.removeItem('currentMunicipalUser');
            });
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
