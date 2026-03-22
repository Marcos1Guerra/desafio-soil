const axios = require('axios');

const PIVO_ID = '5d62287c-2bc7-483f-83ed-638d7eb904a3';
const API_URL = 'http://localhost:3001/simulate-mqtt';

let angle = 0;
let percentimeter = 10;

console.log("Iniciando simulador de Pivô");

setInterval(async () => {
  angle = (angle + 5) % 360;
  percentimeter = percentimeter >= 100 ? 10 : percentimeter + 2;

  const payload = {
    topic: `v1/pivots/${PIVO_ID}/status`,
    payload: {
      isOn: true,
      isIrrigating: true,
      direction: "clockwise",
      angle: angle,
      percentimeter: percentimeter
    }
  };

  try {
    await axios.post(API_URL, payload);
    console.log(`[Simulador] Enviado: Ângulo ${angle}°, Percentímetro ${percentimeter}%`);
  } catch (error) {
    console.error("Erro ao simular:", error.message);
  }
}, 3000);