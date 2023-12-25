const { ServiceCommand, EventName } = require('./constants');
const logger = require('./logger');

class BaseService {
  constructor(code, type, updateInterval, eventBus) {
    this.code = code;
    this.type = type;
    this.updateInterval = updateInterval;
    this.eventBus = eventBus ?? { emit: () => { } };
    this.pid = null;
    this.isRunning = false;
    this.data = {};

    this.eventBus.on(EventName.CommandForService, (code, command) => {
      if (code === this.code) {
        this.handleCommand(command);
      }
    });
  }

  handleCommand(command) {
    logger.info(this.code, 'handleCommand', command);
    switch (command) {
      case ServiceCommand.START:
        this.start();
        break;
      case ServiceCommand.STOP:
        this.stop();
        break;
      default:
        break
    }
  }

  setup() {
    logger.info(this.code, 'setup');
  }

  start() {
    logger.info(this.code, 'starting');
    if (this.isRunning) {
      logger.error(this.code, 'already running');
      return;
    }
    this.isRunning = true;
    this.pid = setInterval(() => { this.update(); }, this.updateInterval);
    logger.info(this.code, 'started.');
  }

  stop() {
    logger.info(this.code, 'stopping');
    if (!this.isRunning) {
      logger.error(this.code, 'already stopped');
      return;
    }
    clearInterval(this.pid);
    this.isRunning = false;
    this.pid = null;
    logger.info(this.code, 'stopped.');
  }

  update() {
    logger.debug(this.code, 'update');
    this.eventBus.emit(EventName.DataFromService, this.code, 'UPDATE', this.data);
  }
};

module.exports = BaseService;