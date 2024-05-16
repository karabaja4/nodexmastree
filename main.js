const tree = require('./tree.js');
const timers = require('node:timers/promises');

const pixels = [];
for (let i = 0; i < pixelCount; i++) {
  pixels.push({ r: 0, g: 0, b: 0 });
};

// onebyone
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
  while (true) {
    tree.update(pixels);
    step();
    await timers.setTimeout(settings.speed);
  }
};

main();
