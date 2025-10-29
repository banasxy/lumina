// Mostrar usuario en dashboard
if (window.location.pathname.includes("dashboard")) {
  fetch("/getUser")
    .then(res => res.json())
    .then(data => {
      const welcome = document.getElementById("welcome");
      if (data.user) welcome.innerText = `¡Bienvenido, ${data.user}! 👋`;
      else window.location.href = "/login";
    })
    .catch(() => (window.location.href = "/login"));
}
