const LEVELS = {
  DEBUG: 0,
  INFO: 1,
  ERROR: 2
};

const LEVEL_NAMES = ['DEBUG', 'INFO', 'ERROR'];

const LOG_LEVEL = LEVELS.INFO;

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
  if (level >= LOG_LEVEL) {
    message = data ? `${message} ${JSON.stringify(data)}` : message;
    console.log(`${LEVEL_NAMES[level]} | [${code}] ${message}`);
  }
}

module.exports = { info, error, debug };