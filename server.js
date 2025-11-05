// ==========================
// 🌟 LÚMINA - SERVER.JS 🌟
// ==========================

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para leer JSON
app.use(express.json());

// 🔹 Servir todos los archivos estáticos desde /public
// (esto incluye logo.png, styles.css, script.js, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// ==========================
// 📁 RUTAS PRINCIPALES
// ==========================

// Página de inicio
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Página de registro
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/register.html'));
});

// Página de login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/login.html'));
});

// Dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/dashboard.html'));
});

// Añadir gasto
app.get('/app', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/app.html'));
});

// Presupuesto
app.get('/presupuesto', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/presupuesto.html'));
});

// Reporte semanal
app.get('/reporte', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/reporte.html'));
});

// Tutorial
app.get('/tutorial', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/tutorial.html'));
});

// ==========================
// 💾 SIMULACIÓN DE BASE LOCAL
// ==========================

// Rutas opcionales si luego decides conectar db.json o usuarios.json
const dbFile = path.join(__dirname, 'usuarios.json');

// Registrar nuevo usuario
app.post('/api/register', (req, res) => {
  const nuevoUsuario = req.body;
  let usuarios = [];

  if (fs.existsSync(dbFile)) {
    usuarios = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
  }

  usuarios.push(nuevoUsuario);
  fs.writeFileSync(dbFile, JSON.stringify(usuarios, null, 2));

  res.json({ message: 'Usuario registrado correctamente' });
});

// Obtener lista de usuarios
app.get('/api/usuarios', (req, res) => {
  if (fs.existsSync(dbFile)) {
    const usuarios = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
    res.json(usuarios);
  } else {
    res.json([]);
  }
});

// ==========================
// 🚀 INICIO DEL SERVIDOR
// ==========================
app.listen(PORT, () => {
  console.log(`✅ Servidor Lúmina activo en: http://localhost:${PORT}`);
});