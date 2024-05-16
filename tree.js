const pigpio = require('pigpio');

pigpio.configureInterfaces(pigpio.DISABLE_FIFO_IF);
pigpio.initialize();

console.log('Hi.');

const shutdown = () => {
  pigpio.terminate();
  console.log('Goodbye.');
  process.exit(0);
};

process.on('SIGHUP', shutdown);
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

let brightness = 0.5;
const setBrightness = (value) => {
  brightness = Math.max(0, Math.min(1, value));
  console.log(`Set brightness to ${brightness}`);
};

const getBrightnessByte = () => {
  const maxBrightness = 31;
  const brightnessBits = Math.round(brightness * maxBrightness);
  return (0b11100000 | (brightnessBits & 0b00011111));
};

const pixelCount = 25;
const clock = new pigpio.Gpio(pixelCount, { mode: pigpio.Gpio.OUTPUT });
const mosi = new pigpio.Gpio(12, { mode: pigpio.Gpio.OUTPUT });

const sendBit = (value) => {
  mosi.digitalWrite(value ? 1 : 0);
  clock.digitalWrite(1);
  clock.digitalWrite(0);
};

const sendByte = (value) => {
  for (let bit = 0x80; bit; bit >>= 1) {
    sendBit(Boolean(value & bit));
  }
};

const sendLed = (r, g, b) => {
  sendByte(getBrightnessByte());
  sendByte(b);
  sendByte(g);
  sendByte(r);
};

const update = async (pixels) => {
  if (!pixels || pixels.length !== pixelCount) {
    shutdown();
  }
  for (let i = 0; i < 4; i++) {
    sendByte(0);
  }
  for (let i = 0; i < pixels.length; i++) {
    const px = pixels[i];
    sendLed(px.r, px.g, px.b);
  }
  for (let i = 0; i < 5; i++) {
    sendByte(0);
  }
};

module.exports = {
  update,
  setBrightness
};
