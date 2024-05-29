// const { PWM } = require('pwm');
const { Gpio } = require('../ts-schema/constants');
pinMode(Gpio.ONBOARD_LED, OUTPUT);

// const _ledPwm = new PWM(Gpio.ONBOARD_LED, 1000, 0.01);
// _ledPwm.start();

// ledPwm.start();
// ledPwm.setFrequency(1000);
// ledPwm.setDuty(0.01);

const LEVELS = { DEBUG: 0, INFO: 1, ERROR: 2 };
const LEVEL_NAMES = ['DEBUG', 'INFO', 'ERROR'];
const LOG_LEVEL = LEVELS.DEBUG;

const debug = (code, message, data) => {
  _log(LEVELS.DEBUG, code, message, data);
}

const info = (code, message, data) => {
  _log(LEVELS.INFO, code, message, data);
}

const error = (code, message, data) => {
  _log(LEVELS.ERROR, code, message, data);
}

const _log = (level, code, message, data) => {
  // _ledPwm.setDuty(0.25);
  if (level >= LOG_LEVEL) {
    message = data ? `${message} ${JSON.stringify(data)}` : message;
    console.log(`${LEVEL_NAMES[level]} | [${code}] ${message}`);
  }
  // _ledPwm.setDuty(0.01);
}

const pulse = {
  up: () => {
    // _ledPwm.setDuty(duty ?? 1.0);
    digitalWrite(Gpio.ONBOARD_LED, HIGH);
  },
  down: () => {
    // _ledPwm.setDuty(0.01);
    digitalWrite(Gpio.ONBOARD_LED, LOW);
  },
  toggle: () => {
    // _ledPwm.setDuty(_ledPwm.getDuty() === 1.0 ? 0.01 : 1.0);
  }
};

module.exports = { info, error, debug, pulse };