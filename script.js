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

const logo = new Image();
logo.src = "https://static.wixstatic.com/media/ce5010_e1ea5e79f9cc4a03857ea47a698d5504~mv2.jpg";

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

    ctx.translate(250, 250);
    ctx.rotate(startAngle + sliceAngle / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "white";
    ctx.font = "bold 14px Arial";
    ctx.fillText(premios[i], 230, 10);
    ctx.restore();
  }

  ctx.beginPath();
  ctx.moveTo(250, 0);
  ctx.lineTo(240, 20);
  ctx.lineTo(260, 20);
  ctx.fillStyle = "#333";
  ctx.fill();

  if (logo.complete) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(250, 250, 50, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(logo, 200, 200, 100, 100);
    ctx.restore();
  } else {
    logo.onload = () => {
      dibujarRuleta();
    };
  }
}

function obtenerPremio(finalAngle) {
  const index = Math.floor(((2 * Math.PI - (finalAngle % (2 * Math.PI))) % (2 * Math.PI)) / sliceAngle);
  return premios[index];
}

function girarRuleta() {
  if (girando) return;
  girando = true;
  btn.disabled = true;

  let velocidad = Math.random() * 0.3 + 0.25;
  const deceleracion = 0.005;

  const animar = () => {
    if (velocidad <= 0) {
      girando = false;
      const premio = obtenerPremio(anguloActual);
      mensaje.textContent = `¡Ganaste: ${premio}!`;
      localStorage.setItem(`token-${token}`, true);
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
