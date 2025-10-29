const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para leer datos de formularios
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Servir archivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// "Base de datos" simple en memoria
let users = [];

// Página de registro
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/register.html'));
});

// Registrar usuario
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (users.find(u => u.username === username)) {
        return res.send('Usuario ya existe');
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
        res.send(`¡Bienvenido, ${username}!`);
    } else {
        res.send('Usuario o contraseña incorrecta. <a href="/login">Volver</a>');
    }
});

// Página principal
app.get('/', (req, res) => {
    res.send('Servidor funcionando. <a href="/register">Registrarse</a> | <a href="/login">Login</a>');
});

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
