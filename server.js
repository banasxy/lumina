const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// abrir/crear base de datos local
const db = new Database(path.join(__dirname, 'lumina.db'));

// crear tablas si no existen
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    tutorialSeen INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    type TEXT,    -- 'income' o 'expense'
    category TEXT,
    amount REAL,
    note TEXT,
    date TEXT DEFAULT (datetime('now')),
    FOREIGN KEY(user_id) REFERENCES users(id)
  )
`).run();

/* ---------- ENDPOINTS DE AUTENTICACIÓN / USUARIOS ---------- */

// register: { name, email, password }
app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email y password requeridos' });
  try {
    const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
    const info = stmt.run(name || '', email, password);
    const user = db.prepare('SELECT id, name, email, tutorialSeen FROM users WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json({ user });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') return res.status(409).json({ error: 'email ya registrado' });
    console.error(err);
    res.status(500).json({ error: 'error interno' });
  }
});

// login: { email, password } -> devuelve user id y tutorialSeen
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email y password requeridos' });
  const user = db.prepare('SELECT id, name, email, tutorialSeen FROM users WHERE email = ? AND password = ?').get(email, password);
  if (!user) return res.status(401).json({ error: 'credenciales inválidas' });
  res.json({ user });
});

// marcar tutorial como visto: PUT /api/users/:id/tutorialSeen  { seen: true }
app.put('/api/users/:id/tutorialSeen', (req, res) => {
  const id = parseInt(req.params.id);
  const seen = req.body.seen ? 1 : 0;
  const info = db.prepare('UPDATE users SET tutorialSeen = ? WHERE id = ?').run(seen, id);
  if (info.changes === 0) return res.status(404).json({ error: 'usuario no encontrado' });
  const user = db.prepare('SELECT id, name, email, tutorialSeen FROM users WHERE id = ?').get(id);
  res.json({ user });
});

/* ---------- ENDPOINTS DE ENTRIES (ejemplo) ---------- */

// crear entrada (body: { user_id, type, category, amount, note })
app.post('/api/entries', (req, res) => {
  const { user_id, type, category, amount, note } = req.body;
  if (!user_id || !type || typeof amount !== 'number') return res.status(400).json({ error: 'user_id, type y amount requeridos' });
  const stmt = db.prepare('INSERT INTO entries (user_id, type, category, amount, note) VALUES (?, ?, ?, ?, ?)');
  const info = stmt.run(user_id, type, category || 'General', amount, note || '');
  const entry = db.prepare('SELECT * FROM entries WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json({ entry });
});

// obtener entradas de un usuario: GET /api/entries?user_id=1
app.get('/api/entries', (req, res) => {
  const user_id = parseInt(req.query.user_id);
  if (!user_id) return res.status(400).json({ error: 'user_id requerido' });
  const rows = db.prepare('SELECT * FROM entries WHERE user_id = ? ORDER BY date DESC').all(user_id);
  res.json(rows);
});

/* ---------- Servir frontend ---------- */
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Lumina API listening on http://localhost:${PORT}`));