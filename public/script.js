// --- FORMULARIOS ---
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const gastoForm = document.getElementById('gastoForm');
const presupuestoForm = document.getElementById('presupuestoForm');

// --- REGISTRO ---
if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    localStorage.setItem('usuarioActual', nombre);
    window.location.href = 'tutorial.html';
  });
}

// --- LOGIN ---
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const usuario = document.getElementById('usuario').value;
    localStorage.setItem('usuarioActual', usuario);
    window.location.href = 'dashboard.html';
  });
}

// --- DASHBOARD ---
const nombreUsuario = document.getElementById('nombreUsuario');
if (nombreUsuario) {
  const nombre = localStorage.getItem('usuarioActual');
  nombreUsuario.textContent = nombre ? nombre : 'Usuario';
}

// --- AÑADIR GASTO ---
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

// --- PRESUPUESTO ---
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

// --- REPORTE ---
const reporteGastos = document.getElementById('reporteGastos');
const graficoGastos = document.getElementById('graficoGastos');

if (reporteGastos && graficoGastos) {
  const gastos = JSON.parse(localStorage.getItem('gastos')) || [];

  // Mostrar lista
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

  // Agrupar por categoría para el gráfico
  const categorias = {};
  gastos.forEach(g => {
    categorias[g.categoria] = (categorias[g.categoria] || 0) + g.monto;
  });

  const labels = Object.keys(categorias);
  const data = Object.values(categorias);

  // Colores para el gráfico
  const colores = [
    '#4C8BE2', '#6BA4E7', '#88B9F1', '#A7CBF8', '#C5DDFE', '#EDF3FF'
  ];

  // Crear el gráfico circular
  new Chart(graficoGastos, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        label: 'Gastos por categoría',
        data: data,
        backgroundColor: colores,
        borderColor: '#fff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: { color: 'white', font: { size: 14 } }
        }
      }
    }
  });
}

// --- CERRAR SESIÓN ---
function cerrarSesion() {
  localStorage.removeItem('usuarioActual');
  window.location.href = 'index.html';
}