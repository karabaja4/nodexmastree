const settings = require('./settings.json');

const isValid = () => {
  return settings.brightness && settings.speed && settings.colors && settings.colors.length > 0;
};

const get = () => {
  if (!isValid()) {
    console.log('Invalid settings.json');
    process.exit(1);
  }
  return settings;
};

module.exports = {
  get
};
