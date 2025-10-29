const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000; // Render asigna el puerto automáticamente

// Para leer JSON del frontend
app.use(bodyParser.json());

// Servir archivos estáticos de la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// "Base de datos" temporal en memoria
let users = [];

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Registro
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: 'Usuario ya existe' });
  }
  users.push({ username, password });
  res.json({ message: 'Usuario registrado correctamente' });
});

// Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(400).json({ message: 'Usuario o contraseña incorrecta' });
  }
  res.json({ message: 'Inicio de sesión exitoso' });
});

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
