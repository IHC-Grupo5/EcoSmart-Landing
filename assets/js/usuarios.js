(function () {
  "use strict";

  // Default initial users
  const DEFAULT_USERS = [
    { id: "1", name: "Juan Rodríguez", email: "juan.rodriguez@ecosmart.gob.pe", role: "Admin", zone: "Acceso total", active: true },
    { id: "2", name: "María Llanos", email: "maria.llanos@ecosmart.gob.pe", role: "Supervisor", zone: "Zona 1, 2, 3", active: true },
    { id: "3", name: "Carlos Mamani", email: "carlos.mamani@ecosmart.gob.pe", role: "Operario", zone: "Zona norte", active: true },
    { id: "4", name: "Pedro Gutiérrez", email: "pedro.gutierrez@ecosmart.gob.pe", role: "Operario", zone: "", active: false }
  ];

  // Helper to format role description
  function getRoleDisplay(user) {
    if (!user.active) {
      return "Cuenta desactivada";
    }
    let roleText = user.role;
    const r = user.role.toLowerCase();
    if (r === "admin" || r === "administrador") {
      roleText = "Administrador principal";
    } else if (r === "supervisor" || r === "supervisora") {
      roleText = "Supervisora";
    } else if (r === "operario" || r === "operaria") {
      roleText = "Operario";
    }

    if (user.zone) {
      const separator = (r === "admin" || r === "administrador") && user.zone.toLowerCase().includes("acceso total") ? " / " : " — ";
      return roleText + separator + user.zone;
    }
    return roleText;
  }

  // Calculate and update role counts
  function updateSummary(users) {
    let admins = 0;
    let supervisors = 0;
    let operarios = 0;

    users.forEach(user => {
      if (!user.active) return;
      const r = user.role.toLowerCase();
      if (r === "admin" || r === "administrador") {
        admins++;
      } else if (r === "supervisor" || r === "supervisora") {
        supervisors++;
      } else if (r === "operario" || r === "operaria" || r === "operarios") {
        operarios++;
      }
    });

    const countAdminEl = document.getElementById("count-admin");
    const countSupervisorEl = document.getElementById("count-supervisor");
    const countOperariosEl = document.getElementById("count-operarios");

    if (countAdminEl) countAdminEl.textContent = admins;
    if (countSupervisorEl) countSupervisorEl.textContent = supervisors;
    if (countOperariosEl) countOperariosEl.textContent = operarios;
  }

  // Render list items dynamically
  function renderTeamList(users, newUserId = null) {
    const teamListContainer = document.getElementById('team-members-list');
    if (!teamListContainer) return;
    teamListContainer.innerHTML = '';

    users.forEach(user => {
      const memberDiv = document.createElement('div');
      memberDiv.className = 'dash-team-member';
      if (!user.active) {
        memberDiv.classList.add('dash-team-member--inactive');
      }
      if (newUserId && user.id === newUserId) {
        memberDiv.classList.add('newly-added');
      }

      const nameSpan = document.createElement('span');
      nameSpan.className = 'dash-team-member__name';
      nameSpan.textContent = user.name;

      const metaDiv = document.createElement('div');
      metaDiv.className = 'dash-team-member__meta';

      const roleSpan = document.createElement('span');
      roleSpan.className = 'dash-team-member__role';
      roleSpan.textContent = getRoleDisplay(user);

      metaDiv.appendChild(roleSpan);

      // Create a delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'dash-team-member__delete';
      deleteBtn.type = 'button';
      deleteBtn.innerHTML = '&times;';
      deleteBtn.title = 'Eliminar miembro';
      deleteBtn.addEventListener('click', () => {
        deleteUser(user.id);
      });

      metaDiv.appendChild(deleteBtn);

      memberDiv.appendChild(nameSpan);
      memberDiv.appendChild(metaDiv);

      teamListContainer.appendChild(memberDiv);
    });
  }

  // Delete user handler
  function deleteUser(userId) {
    let users = JSON.parse(localStorage.getItem('municipal-users')) || DEFAULT_USERS;
    const userToDelete = users.find(u => u.id === userId);
    if (!userToDelete) return;

    if (confirm(`¿Estás seguro de que deseas eliminar a ${userToDelete.name} del equipo municipal?`)) {
      users = users.filter(u => u.id !== userId);
      localStorage.setItem('municipal-users', JSON.stringify(users));
      renderTeamList(users);
      updateSummary(users);
      showToast(`Usuario ${userToDelete.name} eliminado con éxito`, 'info');
    }
  }

  // Clear errors in the form
  function clearErrors() {
    const errorMsgs = document.querySelectorAll('.dash-input-error-msg');
    errorMsgs.forEach(msg => msg.remove());

    const invalidInputs = document.querySelectorAll('.dash-input-field.is-invalid');
    invalidInputs.forEach(input => input.classList.remove('is-invalid'));
  }

  // Show error below specific input field
  function showError(inputEl, message) {
    inputEl.classList.add('is-invalid');
    const errorMsg = document.createElement('span');
    errorMsg.className = 'dash-input-error-msg';
    errorMsg.textContent = message;
    inputEl.parentNode.appendChild(errorMsg);
  }

  // Clear all fields
  function clearForm() {
    const nombreInput = document.getElementById('userNombre');
    const correoInput = document.getElementById('userCorreo');
    const rolInput = document.getElementById('userRol');
    const zonaInput = document.getElementById('userZona');

    if (nombreInput) nombreInput.value = '';
    if (correoInput) correoInput.value = '';
    if (rolInput) rolInput.value = '';
    if (zonaInput) zonaInput.value = '';
    clearErrors();
  }

  // Toast notifications trigger
  function showToast(message, type = 'success') {
    let container = document.querySelector('.dash-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'dash-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'dash-toast';
    if (type === 'error') {
      toast.classList.add('dash-toast--error');
    } else if (type === 'info') {
      toast.classList.add('dash-toast--info');
    }

    const icon = document.createElement('span');
    icon.className = 'dash-toast__icon';
    icon.innerHTML = type === 'error' ? '✕' : type === 'info' ? 'ℹ' : '✓';

    const msgSpan = document.createElement('span');
    msgSpan.className = 'dash-toast__message';
    msgSpan.textContent = message;

    toast.appendChild(icon);
    toast.appendChild(msgSpan);
    container.appendChild(toast);

    // Trigger reflow
    toast.offsetHeight;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
        if (container.children.length === 0) {
          container.remove();
        }
      }, 400);
    }, 3500);
  }

  // Handle user creation
  function handleCreateUser() {
    clearErrors();

    const nombreInput = document.getElementById('userNombre');
    const correoInput = document.getElementById('userCorreo');
    const rolInput = document.getElementById('userRol');
    const zonaInput = document.getElementById('userZona');

    if (!nombreInput || !correoInput || !rolInput || !zonaInput) return;

    const nombre = nombreInput.value.trim();
    const correo = correoInput.value.trim();
    const rol = rolInput.value.trim();
    const zona = zonaInput.value.trim();

    let hasErrors = false;

    // Validate name
    if (nombre.length < 3) {
      showError(nombreInput, "El nombre completo debe tener al menos 3 caracteres.");
      hasErrors = true;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      showError(correoInput, "Ingrese un correo institucional válido.");
      hasErrors = true;
    }

    // Validate role
    const rolesValidos = ["admin", "administrador", "supervisor", "supervisora", "operario", "operaria", "operarios"];
    const rolLower = rol.toLowerCase();
    if (!rol) {
      showError(rolInput, "El rol es requerido (ej: Admin, Supervisor, Operario).");
      hasErrors = true;
    } else if (!rolesValidos.includes(rolLower)) {
      showError(rolInput, "El rol ingresado no es válido. Utilice: Admin, Supervisor u Operario.");
      hasErrors = true;
    }

    if (hasErrors) {
      showToast("Por favor corrija los errores en el formulario", "error");
      return;
    }

    // Save and update
    const users = JSON.parse(localStorage.getItem('municipal-users')) || DEFAULT_USERS;
    const newId = Date.now().toString();
    const newUser = {
      id: newId,
      name: nombre,
      email: correo,
      role: rol.charAt(0).toUpperCase() + rol.slice(1).toLowerCase(),
      zone: zona,
      active: true
    };

    users.push(newUser);
    localStorage.setItem('municipal-users', JSON.stringify(users));

    renderTeamList(users, newId);
    updateSummary(users);
    clearForm();

    showToast(`Usuario ${newUser.name} creado correctamente.`, "success");
  }

  // Initialize
  function init() {
    const nombreInput = document.getElementById('userNombre');
    if (!nombreInput) return; // Exit if not on the correct page

    let users = localStorage.getItem('municipal-users');
    if (!users) {
      users = DEFAULT_USERS;
      localStorage.setItem('municipal-users', JSON.stringify(users));
    } else {
      users = JSON.parse(users);
    }

    renderTeamList(users);
    updateSummary(users);

    const confirmBtn = document.querySelector('.dash-btn-confirm');
    const cancelBtn = document.querySelector('.dash-btn-cancel');

    if (confirmBtn) {
      confirmBtn.addEventListener('click', handleCreateUser);
    }
    if (cancelBtn) {
      cancelBtn.addEventListener('click', clearForm);
    }
  }

  // Run init when DOM is fully loaded (or immediately if already parsed)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
