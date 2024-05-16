const pigpio = require('pigpio');
const settings = require('./settings.js').get();

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

const getBrightnessByte = () => {
  const desiredBrightness = Math.max(0, Math.min(1, settings.brightness));
  const maxBrightness = 31;
  const brightnessBits = Math.round(desiredBrightness * maxBrightness);
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

const brightnessByte = getBrightnessByte();
const sendLed = (r, g, b) => {
  sendByte(brightnessByte);
  sendByte(b);
  sendByte(g);
  sendByte(r);
};

const update = async (pixels) => {
  if (!pixels || pixels.length !== pixelCount) {
    console.log('Invalid pixel count.');
    process.exit(1);
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
  update
};
