const express = require('express');
const path = require('path');
const app = express();

// Puerto dinámico para Render o local
const PORT = process.env.PORT || 3000;

// Middleware para leer formularios
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Archivos estáticos (CSS, JS, imágenes)
app.use(express.static(path.join(__dirname, 'public')));

// "Base de datos" simple en memoria
let users = [];

// Página principal
app.get('/', (req, res) => {
    res.send(`
        <h1>Servidor Lumina funcionando</h1>
        <a href="/register">Registrarse</a> | <a href="/login">Login</a>
    `);
});

// Página de registro
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/register.html'));
});

// Registrar usuario
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.send('Faltan datos');

    if (users.find(u => u.username === username)) {
        return res.send('Usuario ya existe. <a href="/register">Volver</a>');
    }

    users.push({ username, password });
    res.send('Usuario registrado correctamente. <a href="/login">Ir a login</a>');
});

// Página de login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/login.html'));
});

// Iniciar sesión
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Redirige al dashboard
        res.redirect(`/dashboard?user=${encodeURIComponent(username)}`);
    } else {
        res.send('Usuario o contraseña incorrecta. <a href="/login">Volver</a>');
    }
});

// Dashboard simple
app.get('/dashboard', (req, res) => {
    const username = req.query.user;
    if (!username) return res.redirect('/login');

    res.send(`
        <h1>Bienvenido, ${username}!</h1>
        <p>Este es tu dashboard.</p>
        <a href="/login">Cerrar sesión</a>
    `);
});

// Servidor escuchando
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
