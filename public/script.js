// ======================
// LÚMINA - GESTOR DE GASTOS
// ======================

// Cargar gastos del almacenamiento local
let gastos = JSON.parse(localStorage.getItem("gastos")) || [];

const form = document.getElementById("formGasto");
const lista = document.getElementById("listaGastos");
const graficoCanvas = document.getElementById("graficoGastos");
let grafico;

// Guardar gasto nuevo
form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombreGasto").value;
  const monto = parseFloat(document.getElementById("montoGasto").value);
  const categoria = document.getElementById("categoriaGasto").value;

  const nuevoGasto = { id: Date.now(), nombre, monto, categoria };
  gastos.push(nuevoGasto);
  localStorage.setItem("gastos", JSON.stringify(gastos));

  form.reset();
  renderGastos();
  renderGrafico();
});

// Mostrar lista de gastos
function renderGastos() {
  if (!lista) return;
  lista.innerHTML = "";
  gastos.forEach((g) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${g.nombre}</strong> - $${g.monto} (${g.categoria})
      <button class="editar" onclick="editarGasto(${g.id})">✏️</button>
      <button class="eliminar" onclick="eliminarGasto(${g.id})">🗑️</button>
    `;
    lista.appendChild(li);
  });
}

// Editar gasto
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

// Eliminar gasto
function eliminarGasto(id) {
  gastos = gastos.filter((g) => g.id !== id);
  localStorage.setItem("gastos", JSON.stringify(gastos));
  renderGastos();
  renderGrafico();
}

// Gráfico de distribución por categoría
function renderGrafico() {
  if (!graficoCanvas) return;
  const categorias = {};
  gastos.forEach((g) => {
    categorias[g.categoria] = (categorias[g.categoria] || 0) + g.monto;
  });

  const labels = Object.keys(categorias);
  const data = Object.values(categorias);

  if (grafico) grafico.destroy();
  grafico = new Chart(graficoCanvas, {
    type: "pie",
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: ["#42A5F5", "#66BB6A", "#FFA726", "#EF5350", "#AB47BC"],
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  });
}

renderGastos();
renderGrafico();