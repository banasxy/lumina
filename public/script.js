let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
let gastos = JSON.parse(localStorage.getItem("gastos")) || [];
let usuarioActual = JSON.parse(localStorage.getItem("usuarioActual")) || null;

// REGISTRO
const formRegistro = document.getElementById("formRegistro");
formRegistro?.addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value;
  const correo = document.getElementById("correo").value;
  const usuario = document.getElementById("usuario").value;
  const contrasena = document.getElementById("contrasena").value;

  const existe = usuarios.find((u) => u.usuario === usuario || u.correo === correo);
  if (existe) return alert("⚠️ Este usuario ya existe.");

  const nuevoUsuario = { nombre, correo, usuario, contrasena };
  usuarios.push(nuevoUsuario);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  localStorage.setItem("usuarioActual", JSON.stringify(nuevoUsuario));
  alert("✅ Registro exitoso. Bienvenido a Lúmina.");
  window.location.href = "tutorial.html";
});

// LOGIN
const formLogin = document.getElementById("formLogin");
formLogin?.addEventListener("submit", (e) => {
  e.preventDefault();
  const usuario = document.getElementById("usuarioLogin").value;
  const contrasena = document.getElementById("contrasenaLogin").value;
  const encontrado = usuarios.find(
    (u) => (u.usuario === usuario || u.correo === usuario) && u.contrasena === contrasena
  );
  if (!encontrado) return alert("❌ Usuario o contraseña incorrectos");
  localStorage.setItem("usuarioActual", JSON.stringify(encontrado));
  window.location.href = "dashboard.html";
});

// DASHBOARD
const nombreUsuario = document.getElementById("nombreUsuario");
if (nombreUsuario && usuarioActual) nombreUsuario.textContent = `Hola, ${usuarioActual.nombre}!`;

const btnCerrarSesion = document.getElementById("cerrarSesion");
btnCerrarSesion?.addEventListener("click", () => {
  localStorage.removeItem("usuarioActual");
  window.location.href = "index.html";
});

// GASTOS
const form = document.getElementById("formGasto");
const lista = document.getElementById("listaGastos");
const graficoCanvas = document.getElementById("graficoGastos");
let grafico;

form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombreGasto").value;
  const monto = parseFloat(document.getElementById("montoGasto").value);
  const categoria = document.getElementById("categoriaGasto").value;
  const nuevoGasto = { id: Date.now(), usuario: usuarioActual?.usuario || "invitado", nombre, monto, categoria };
  gastos.push(nuevoGasto);
  localStorage.setItem("gastos", JSON.stringify(gastos));
  form.reset();
  renderGastos();
  renderGrafico();
});

function renderGastos() {
  if (!lista) return;
  lista.innerHTML = "";
  const gastosUsuario = gastos.filter((g) => g.usuario === usuarioActual?.usuario);
  gastosUsuario.forEach((g) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${g.nombre}</strong> - $${g.monto} (${g.categoria})
      <button class="editar" onclick="editarGasto(${g.id})">✏️</button>
      <button class="eliminar" onclick="eliminarGasto(${g.id})">🗑️</button>`;
    lista.appendChild(li);
  });
}

function editarGasto(id) {
  const gasto = gastos.find((g) => g.id === id);
  const nuevoNombre = prompt("Nuevo nombre:", gasto.nombre);
  const nuevoMonto = parseFloat(prompt("Nuevo monto:", gasto.monto));
  const nuevaCategoria = prompt("Nueva categoría:", gasto.categoria);
  if (nuevoNombre && nuevoMonto && nuevaCategoria) {
    gasto.nombre = nuevoNombre;
    gasto.monto = nuevoMonto;
    gasto.categoria = nuevaCategoria;
    localStorage.setItem("gastos", JSON.stringify(gastos));
    renderGastos();
    renderGrafico();
  }
}

function eliminarGasto(id) {
  gastos = gastos.filter((g) => g.id !== id);
  localStorage.setItem("gastos", JSON.stringify(gastos));
  renderGastos();
  renderGrafico();
}

function renderGrafico() {
  if (!graficoCanvas) return;
  const gastosUsuario = gastos.filter((g) => g.usuario === usuarioActual?.usuario);
  const categorias = {};
  gastosUsuario.forEach((g) => {
    categorias[g.categoria] = (categorias[g.categoria] || 0) + g.monto;
  });
  const labels = Object.keys(categorias);
  const data = Object.values(categorias);
  if (grafico) grafico.destroy();
  grafico = new Chart(graficoCanvas, {
    type: "pie",
    data: {
      labels,
      datasets: [{ data, backgroundColor: ["#42A5F5", "#66BB6A", "#FFA726", "#EF5350", "#AB47BC"] }],
    },
    options: { plugins: { legend: { position: "bottom" } } },
  });
}
renderGastos();
renderGrafico();

// ==========================
// 💸 PRESUPUESTO
// ==========================
const formPresupuesto = document.getElementById("formPresupuesto");
const montoPresupuesto = document.getElementById("montoPresupuesto");
const presupuestoTotal = document.getElementById("presupuestoTotal");
const gastoActual = document.getElementById("gastoActual");
const saldoDisponible = document.getElementById("saldoDisponible");

if (formPresupuesto) {
  const usuario = usuarioActual?.usuario;
  let presupuesto = JSON.parse(localStorage.getItem("presupuesto")) || {};
  let gastoUsuario = gastos.filter((g) => g.usuario === usuario)
    .reduce((acc, g) => acc + g.monto, 0);

  // Mostrar presupuesto guardado si existe
  if (presupuesto[usuario]) {
    presupuestoTotal.textContent = presupuesto[usuario];
    gastoActual.textContent = gastoUsuario;
    saldoDisponible.textContent = presupuesto[usuario] - gastoUsuario;
  }

  formPresupuesto.addEventListener("submit", (e) => {
    e.preventDefault();
    const valor = parseFloat(montoPresupuesto.value);
    if (!valor) return;
    presupuesto[usuario] = valor;
    localStorage.setItem("presupuesto", JSON.stringify(presupuesto));
    alert("✅ Presupuesto guardado correctamente.");
    window.location.reload();
  });
}

// ==========================
// 📊 GRAFICO EN PÁGINA SEPARADA
// ==========================
const graficoPagina = document.getElementById("graficoGastos");
if (graficoPagina) renderGrafico();
