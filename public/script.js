// script.js mejorado

const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const gastoForm = document.getElementById('gastoForm');

// REGISTRO
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    localStorage.setItem('usuarioActual', nombre);

    // Redirigir al tutorial
    window.location.href = 'tutorial.html';
  });
}

// LOGIN
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const usuario = document.getElementById('usuario').value;
    localStorage.setItem('usuarioActual', usuario);

    // Redirigir al dashboard sin mostrar alert
    window.location.href = 'dashboard.html';
  });
}

// DASHBOARD — Mostrar nombre del usuario
const nombreUsuario = document.getElementById('nombreUsuario');
if (nombreUsuario) {
  const nombre = localStorage.getItem('usuarioActual');
  nombreUsuario.textContent = nombre ? nombre : 'Usuario';
}

// AÑADIR GASTO
if (gastoForm) {
  gastoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Aquí podrías enviar el gasto a la base si quisieras
    window.location.href = 'dashboard.html';
  });
}

// CERRAR SESIÓN
function cerrarSesion() {
  localStorage.removeItem('usuarioActual');
  window.location.href = 'index.html';
}