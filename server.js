const express = require('express');
const path = require('path');
const session = require('express-session');
const Database = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

const db = new Database(path.join(__dirname, 'usuarios.json'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configurar sesión
app.use(session({
  secret: 'lumina_secret_key',
  resave: false,
  saveUninitialized: true
}));

// Rutas principales
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Registro
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/register.html'));
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.send('Faltan datos.');

  const users = db.getUsers();
  if (users.find(u => u.username === username))
    return res.send('Usuario ya existe. <a href="/register">Volver</a>');

  db.addUser({ username, password });
  res.redirect('/login');
});

// Login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/login.html'));
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = db.getUsers();
  const user = users.find(u => u.username === username && u.password === password);

  if (!user)
    return res.send('Usuario o contraseña incorrecta. <a href="/login">Volver</a>');

  req.session.user = username;
  res.redirect('/dashboard');
});

// Dashboard
app.get('/dashboard', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.sendFile(path.join(__dirname, 'public/dashboard.html'));
});

// Obtener usuario en sesión
app.get('/getUser', (req, res) => {
  res.json({ user: req.session.user || null });
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Páginas adicionales
app.get('/app', (req, res) => res.sendFile(path.join(__dirname, 'public/app.html')));
app.get('/tutorial', (req, res) => res.sendFile(path.join(__dirname, 'public/tutorial.html')));

app.listen(PORT, () => console.log(`✅ Lumina corriendo en http://localhost:${PORT}`));
