// Manejo de formularios básicos

const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const gastoForm = document.getElementById('gastoForm');

if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    alert('Usuario registrado correctamente ✅');
    window.location.href = 'tutorial.html';
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    alert('Inicio de sesión exitoso ✅');
    window.location.href = 'dashboard.html';
  });
}

if (gastoForm) {
  gastoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Gasto guardado correctamente ✅');
    window.location.href = 'dashboard.html';
  });
}

function cerrarSesion() {
  alert('Sesión cerrada');
  window.location.href = 'index.html';
}