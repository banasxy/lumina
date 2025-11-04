// script.js actualizado

const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const gastoForm = document.getElementById('gastoForm');
const presupuestoForm = document.getElementById('presupuestoForm');

// REGISTRO
if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    localStorage.setItem('usuarioActual', nombre);
    window.location.href = 'tutorial.html';
  });
}

// LOGIN
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const usuario = document.getElementById('usuario').value;
    localStorage.setItem('usuarioActual', usuario);
    window.location.href = 'dashboard.html';
  });
}

// DASHBOARD
const nombreUsuario = document.getElementById('nombreUsuario');
if (nombreUsuario) {
  const nombre = localStorage.getItem('usuarioActual');
  nombreUsuario.textContent = nombre ? nombre : 'Usuario';
}

// AÑADIR GASTO
if (gastoForm) {
  gastoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const monto = parseFloat(document.getElementById('monto').value);
    const categoria = document.getElementById('categoria').value;
    const nota = document.getElementById('nota').value;

    const nuevoGasto = { monto, categoria, nota, fecha: new Date().toLocaleDateString() };

    let gastos = JSON.parse(localStorage.getItem('gastos')) || [];
    gastos.push(nuevoGasto);
    localStorage.setItem('gastos', JSON.stringify(gastos));

    window.location.href = 'reporte.html';
  });
}

// PRESUPUESTO
if (presupuestoForm) {
  presupuestoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const monto = parseFloat(document.getElementById('montoPresupuesto').value);
    const tipo = document.getElementById('tipoPresupuesto').value;

    const presupuesto = { monto, tipo };
    localStorage.setItem('presupuesto', JSON.stringify(presupuesto));

    window.location.href = 'dashboard.html';
  });
}

// REPORTE
const reporteGastos = document.getElementById('reporteGastos');
if (reporteGastos) {
  const gastos = JSON.parse(localStorage.getItem('gastos')) || [];
  if (gastos.length === 0) {
    reporteGastos.innerHTML = "<p>No hay gastos registrados aún.</p>";
  } else {
    gastos.forEach((gasto) => {
      const div = document.createElement('div');
      div.className = 'card-gasto';
      div.innerHTML = `
        <strong>${gasto.categoria}</strong><br>
        $${gasto.monto.toFixed(2)} — ${gasto.fecha}<br>
        <small>${gasto.nota || ''}</small>
      `;
      reporteGastos.appendChild(div);
    });
  }
}

// CERRAR SESIÓN
function cerrarSesion() {
  localStorage.removeItem('usuarioActual');
  window.location.href = 'index.html';
}