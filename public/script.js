// ==========================
// LÚMINA - script.js (completo y corregido)
// ==========================

// ----- Datos en memoria (carga desde localStorage) -----
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
let gastos = JSON.parse(localStorage.getItem("gastos")) || [];
let usuarioActual = JSON.parse(localStorage.getItem("usuarioActual")) || null;

// Guardar helpers
function saveUsuarios() {
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}
function saveGastos() {
  localStorage.setItem("gastos", JSON.stringify(gastos));
}
function saveUsuarioActual() {
  localStorage.setItem("usuarioActual", JSON.stringify(usuarioActual));
}

// Form references (pueden ser null si no existen en la página actual)
const formRegistro = document.getElementById("formRegistro");
const formLogin = document.getElementById("formLogin");
const formGasto = document.getElementById("formGasto");
const formPresupuesto = document.getElementById("formPresupuesto");

// ----------------- Registro -----------------
formRegistro?.addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const usuario = document.getElementById("usuario").value.trim();
  const contrasena = document.getElementById("contrasena").value;

  if (!nombre || !correo || !usuario || !contrasena) {
    return alert("Por favor completa todos los campos.");
  }

  const existe = usuarios.find((u) => u.usuario === usuario || u.correo === correo);
  if (existe) return alert("⚠️ Este usuario o correo ya está registrado.");

  const nuevoUsuario = { nombre, correo, usuario, contrasena };
  usuarios.push(nuevoUsuario);
  saveUsuarios();

  usuarioActual = nuevoUsuario;
  saveUsuarioActual();

  // Redirigir al tutorial (o dashboard si prefieres)
  window.location.href = "tutorial.html";
});

// ----------------- Login -----------------
formLogin?.addEventListener("submit", (e) => {
  e.preventDefault();
  const usuario = document.getElementById("usuarioLogin").value.trim();
  const contrasena = document.getElementById("contrasenaLogin").value;

  if (!usuario || !contrasena) return alert("Completa usuario y contraseña.");

  const encontrado = usuarios.find(
    (u) => (u.usuario === usuario || u.correo === usuario) && u.contrasena === contrasena
  );

  if (!encontrado) return alert("❌ Usuario o contraseña incorrectos");

  usuarioActual = encontrado;
  saveUsuarioActual();
  window.location.href = "dashboard.html";
});

// ----------------- Dashboard: mostrar nombre si existe -----------------
function actualizarNombreEnDashboard() {
  const nombreUsuarioElem = document.getElementById("nombreUsuario");
  if (!nombreUsuarioElem) return;
  // recarga usuarioActual desde localStorage en caso de que haya cambiado
  usuarioActual = JSON.parse(localStorage.getItem("usuarioActual")) || usuarioActual;
  nombreUsuarioElem.textContent = usuarioActual ? `Hola, ${usuarioActual.nombre}!` : "Hola, Usuario";
}
actualizarNombreEnDashboard();

// Botón cerrar sesión (si existe)
const btnCerrarSesion = document.getElementById("cerrarSesion");
btnCerrarSesion?.addEventListener("click", () => {
  localStorage.removeItem("usuarioActual");
  usuarioActual = null;
  window.location.href = "index.html";
});

// ----------------- GESTIÓN DE GASTOS (añadir / listar / editar / eliminar) -----------------

const listaElem = document.getElementById("listaGastos");
const mensajeExito = document.getElementById("mensajeExito");

formGasto?.addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombreGasto").value.trim();
  const monto = parseFloat(document.getElementById("montoGasto").value);
  const categoria = document.getElementById("categoriaGasto").value;

  if (!nombre || !monto || !categoria) {
    mostrarMensaje("Completa todos los campos del gasto", true);
    return;
  }

  const nuevoGasto = {
    id: Date.now(),
    usuario: usuarioActual?.usuario || "invitado",
    nombre,
    monto,
    categoria,
    fecha: new Date().toLocaleDateString()
  };

  gastos.push(nuevoGasto);
  saveGastos();

  formGasto.reset();
  renderGastos();
  renderGrafico(); // actualizar gráfico si se está viendo
  actualizarPresupuestoDisplay(); // actualizar resumen de presupuesto
  mostrarMensaje("✅ Gasto añadido correctamente");
});

function renderGastos() {
  if (!listaElem) return;
  listaElem.innerHTML = "";

  const usuario = usuarioActual?.usuario || "invitado";
  const gastosUsuario = gastos.filter((g) => g.usuario === usuario);

  if (gastosUsuario.length === 0) {
    listaElem.innerHTML = "<li>No tienes gastos aún.</li>";
    return;
  }

  gastosUsuario.forEach((g) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div>
        <strong>${escapeHtml(g.nombre)}</strong>
        <div class="small">$${g.monto.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})} — ${g.fecha}</div>
      </div>
      <div>
        <span class="badge">${escapeHtml(g.categoria)}</span>
        <button class="editar" onclick="editarGasto(${g.id})" title="Editar">✏️</button>
        <button class="eliminar" onclick="eliminarGasto(${g.id})" title="Eliminar">🗑️</button>
      </div>
    `;
    listaElem.appendChild(li);
  });
}

window.editarGasto = function (id) {
  const gasto = gastos.find((g) => g.id === id);
  if (!gasto) return;
  const nuevoNombre = prompt("Editar nombre:", gasto.nombre);
  const nuevoMontoRaw = prompt("Editar monto:", gasto.monto);
  const nuevaCategoria = prompt("Editar categoría:", gasto.categoria);

  const nuevoMonto = parseFloat(nuevoMontoRaw);
  if (!nuevoNombre || isNaN(nuevoMonto) || !nuevaCategoria) {
    mostrarMensaje("Edición cancelada o datos inválidos", true);
    return;
  }

  gasto.nombre = nuevoNombre;
  gasto.monto = nuevoMonto;
  gasto.categoria = nuevaCategoria;
  saveGastos();
  renderGastos();
  renderGrafico();
  actualizarPresupuestoDisplay();
  mostrarMensaje("✏️ Gasto actualizado");
};

window.eliminarGasto = function (id) {
  if (!confirm("¿Eliminar este gasto?")) return;
  gastos = gastos.filter((g) => g.id !== id);
  saveGastos();
  renderGastos();
  renderGrafico();
  actualizarPresupuestoDisplay();
  mostrarMensaje("🗑️ Gasto eliminado");
};

// Mensaje visual temporal
function mostrarMensaje(texto, esError = false) {
  if (!mensajeExito) return;
  mensajeExito.textContent = texto;
  mensajeExito.style.color = esError ? "#ffcccb" : "#a5d6a7";
  mensajeExito.style.opacity = "1";
  clearTimeout(mostrarMensaje._t);
  mostrarMensaje._t = setTimeout(() => {
    if (mensajeExito) mensajeExito.style.opacity = "0";
  }, 2200);
}

// escape para evitar inyección simple
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ----------------- PRESUPUESTO -----------------

function actualizarPresupuestoDisplay() {
  const presupuestoTotalElem = document.getElementById("presupuestoTotal");
  const gastoActualElem = document.getElementById("gastoActual");
  const saldoDisponibleElem = document.getElementById("saldoDisponible");

  if (!presupuestoTotalElem && !gastoActualElem && !saldoDisponibleElem) return;

  const usuario = usuarioActual?.usuario;
  const presupuestoObj = JSON.parse(localStorage.getItem("presupuesto")) || {};
  const presupuestoUsuario = presupuestoObj[usuario] ? Number(presupuestoObj[usuario]) : 0;

  // calcular gasto actual del usuario
  const gastoUsuario = gastos
    .filter((g) => g.usuario === usuario)
    .reduce((acc, g) => acc + Number(g.monto || 0), 0);

  if (presupuestoTotalElem) presupuestoTotalElem.textContent = presupuestoUsuario.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2});
  if (gastoActualElem) gastoActualElem.textContent = gastoUsuario.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2});
  if (saldoDisponibleElem) saldoDisponibleElem.textContent = (presupuestoUsuario - gastoUsuario).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2});

  // Opcional: cambiar color según porcentaje usado
  if (saldoDisponibleElem) {
    const porcentaje = presupuestoUsuario > 0 ? (gastoUsuario / presupuestoUsuario) * 100 : 0;
    if (porcentaje >= 100) {
      saldoDisponibleElem.style.color = "#ff8a80"; // rojo
    } else if (porcentaje >= 75) {
      saldoDisponibleElem.style.color = "#ffd54f"; // naranja
    } else {
      saldoDisponibleElem.style.color = "#a5d6a7"; // verde
    }
  }
}

// formulario presupuesto
formPresupuesto?.addEventListener("submit", (e) => {
  e.preventDefault();
  const montoInput = document.getElementById("montoPresupuesto");
  const valor = parseFloat(montoInput.value);
  if (!valor || !usuarioActual) {
    mostrarMensaje("Ingresa un monto válido", true);
    return;
  }
  const usuario = usuarioActual.usuario;
  const presupuestoObj = JSON.parse(localStorage.getItem("presupuesto")) || {};
  presupuestoObj[usuario] = valor;
  localStorage.setItem("presupuesto", JSON.stringify(presupuestoObj));
  actualizarPresupuestoDisplay();
  mostrarMensaje("✅ Presupuesto guardado");
});

// ----------------- GRAFICO (pie) -----------------

let grafico = null;
function renderGrafico() {
  // buscador dinámico de canvas (puede estar en grafico.html o app.html en versiones anteriores)
  const canvas = document.getElementById("graficoGastos");
  if (!canvas) return;

  const usuario = usuarioActual?.usuario;
  const gastosUsuario = gastos.filter((g) => g.usuario === usuario);

  // Agrupar por categoría
  const categorias = {};
  gastosUsuario.forEach((g) => {
    categorias[g.categoria] = (categorias[g.categoria] || 0) + Number(g.monto || 0);
  });

  const labels = Object.keys(categorias);
  const data = Object.values(categorias);

  // Si no hay datos, destruir grafico y mostrar mensaje dentro del canvas area
  if (data.length === 0) {
    if (grafico) {
      grafico.destroy();
      grafico = null;
    }
    // Intentamos mostrar un mensaje debajo si existe un contenedor
    const cont = canvas.parentElement;
    if (cont) {
      let tip = cont.querySelector(".grafico-mensaje");
      if (!tip) {
        tip = document.createElement("div");
        tip.className = "grafico-mensaje";
        tip.style.marginTop = "12px";
        tip.style.color = "rgba(255,255,255,0.8)";
        tip.textContent = "No hay gastos para graficar.";
        cont.appendChild(tip);
      } else {
        tip.textContent = "No hay gastos para graficar.";
      }
    }
    return;
  }

  // Colores
  const colores = ["#42A5F5", "#66BB6A", "#FFA726", "#EF5350", "#AB47BC", "#90CAF9", "#A7FFEB"];

  if (grafico) grafico.destroy();

  grafico = new Chart(canvas, {
    type: "pie",
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colores.slice(0, labels.length),
        borderColor: "#ffffff",
        borderWidth: 2,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: { color: "white", font: { size: 13 } },
          position: "bottom"
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const value = context.parsed;
              const total = context.dataset.data.reduce((a,b)=>a+b,0);
              const percent = total ? ((value/total)*100).toFixed(1) : 0;
              return `${context.label}: $${value.toLocaleString(undefined,{minimumFractionDigits:2, maximumFractionDigits:2})} (${percent}%)`;
            }
          }
        }
      }
    }
  });
}

// ----------------- Inicialización al cargar página -----------------

// Espera un tick para que DOM esté disponible en páginas
document.addEventListener("DOMContentLoaded", () => {
  // recarga usuarioActual por si vino de otro flujo
  usuarioActual = JSON.parse(localStorage.getItem("usuarioActual")) || usuarioActual;

  actualizarNombreEnDashboard();
  renderGastos();
  renderGrafico();
  actualizarPresupuestoDisplay();
});
