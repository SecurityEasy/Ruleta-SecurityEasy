const token = new URLSearchParams(window.location.search).get('token');
const ruleta = document.getElementById('ruleta');
const mensaje = document.getElementById('mensaje');
const btn = document.getElementById('girarBtn');

const premios = [
  "Sigue Participando",
  "2 Envíos Gratis",
  "10 Sims Telcel Gratis",
  "1 ET200N gratis",
  "Sigue Participando",
  "Envío 50%",
  "Regalo Sorpresa",
  "Sigue Participando",
  "1 Renovación Anual Gratis"
];

if (!token) {
  mensaje.textContent = "Token inválido. No puedes girar.";
  btn.disabled = true;
} else {
  let yaUsado = localStorage.getItem(`token-${token}`);

  if (yaUsado) {
    mensaje.textContent = "Este token ya fue usado.";
    btn.disabled = true;
  } else {
    btn.addEventListener('click', () => {
      const premio = premios[Math.floor(Math.random() * premios.length)];
      mensaje.textContent = `¡Ganaste: ${premio}!`;
      localStorage.setItem(`token-${token}`, true);
      btn.disabled = true;
    });
  }
}
