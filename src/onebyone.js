const tree = require('./tree.js');
const timers = require('node:timers/promises');
const settings = require('./settings.js').get();

const pixelCount = 25;
const pixels = Array(pixelCount).fill({ r: 0, g: 0, b: 0 });

let currentColorIndex = 0;
let currentPixelIndex = 0;
const colors = settings.colors;

const step = () => {
  if (currentPixelIndex >= pixelCount) {
    currentPixelIndex = 0;
    currentColorIndex++;
  }
  if (currentColorIndex >= colors.length) {
      currentColorIndex = 0;
  }
  pixels[currentPixelIndex++] = colors[currentColorIndex];
};

const main = async () => {
  tree.setBrightness(settings.brightness);
  while (true) {
    tree.update(pixels);
    step();
    await timers.setTimeout(settings.speed);
  }
};

main();
