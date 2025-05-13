console.log("Cargando script...");

const token = new URLSearchParams(window.location.search).get('token');
const canvas = document.getElementById('ruleta');
const ctx = canvas.getContext('2d');
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

const colores = ["#f94144", "#f3722c", "#f8961e", "#f9c74f", "#90be6d", "#43aa8b", "#577590", "#b5179e", "#6a4c93"];

const slices = premios.length;
const sliceAngle = 2 * Math.PI / slices;
let anguloActual = 0;
let girando = false;

// 🎨 Dibuja la ruleta
function dibujarRuleta() {
  for (let i = 0; i < slices; i++) {
    const startAngle = anguloActual + i * sliceAngle;
    const endAngle = startAngle + sliceAngle;

    ctx.beginPath();
    ctx.moveTo(250, 250);
    ctx.arc(250, 250, 250, startAngle, endAngle);
    ctx.fillStyle = colores[i % colores.length];
    ctx.fill();
    ctx.save();

    // Texto
    ctx.translate(250, 250);
    ctx.rotate(startAngle + sliceAngle / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "white";
    ctx.font = "bold 14px Arial";
    ctx.fillText(premios[i], 230, 10);
    ctx.restore();
  }

  // Flecha arriba
  ctx.beginPath();
  ctx.moveTo(250, 0);
  ctx.lineTo(240, 20);
  ctx.lineTo(260, 20);
  ctx.fillStyle = "#333";
  ctx.fill();
}

function obtenerPremio(finalAngle) {
  const index = Math.floor(((2 * Math.PI - (finalAngle % (2 * Math.PI))) % (2 * Math.PI)) / sliceAngle);
  return premios[index];
}

function girarRuleta() {
  if (girando) return;
  girando = true;
  btn.disabled = true;

  let velocidad = Math.random() * 0.3 + 0.25; // velocidad inicial
  const deceleracion = 0.005;

  const animar = () => {
    if (velocidad <= 0) {
      girando = false;
      const premio = obtenerPremio(anguloActual);
      mensaje.textContent = `¡Ganaste: ${premio}!`;
      localStorage.setItem(`token-${token}`, true); // marca token como usado
      return;
    }

    anguloActual += velocidad;
    velocidad -= deceleracion;

    ctx.clearRect(0, 0, 500, 500);
    dibujarRuleta();
    requestAnimationFrame(animar);
  };

  requestAnimationFrame(animar);
}

if (!token) {
  mensaje.textContent = "Token inválido. No puedes girar.";
  btn.disabled = true;
} else {
  const yaUsado = localStorage.getItem(`token-${token}`);

  if (yaUsado) {
    mensaje.textContent = "Este token ya fue usado.";
    btn.disabled = true;
  } else {
    dibujarRuleta();
    btn.addEventListener('click', girarRuleta);
  }
}
