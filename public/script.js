const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const message = document.getElementById('message');

// Registro
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = registerForm.username.value;
  const password = registerForm.password.value;

  const res = await fetch('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  message.textContent = data.message;
});

// Login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = loginForm.username.value;
  const password = loginForm.password.value;

  const res = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  message.textContent = data.message;
});
