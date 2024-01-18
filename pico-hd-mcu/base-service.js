const { ServiceCommand, EventType, ServiceStatus, ServiceEvent, Broadcasting } = require('./constants');
const logger = require('./logger');

class BaseService {
  constructor({ code, type, updateInterval, eventBus, broadcastMode, idleTimeout }) {
    this.options = {
      code,
      type,
      updateInterval: updateInterval ?? 1000 * 5,
      broadcastMode: broadcastMode ?? Broadcasting.OnDemandPolling,
      idleTimeout: idleTimeout ?? 1000 * 120,
      eventBus: eventBus ?? { emit: () => { } }
    };
    this.status = ServiceStatus.Available;
    this.broadcastPid = null;
    this.isRunning = false;
    this.data = {};

    this.options.eventBus.on(EventType.CommandForService, (code, command) => {
      if (code === this.options.code) {
        this.handleCommand(command);
      }
    });
  }

  handleCommand(command) {
    logger.info(this.options.code, 'handleCommand', command);
    switch (command) {
      case ServiceCommand.START:
        this.start();
        break;
      case ServiceCommand.STOP:
        this.stop();
        break;
      case ServiceCommand.STATUS:
        this.publishStatus();
        break;
      case ServiceCommand.DATA:
        this.publishData();
        break;
      default:
        break
    }
  }

  isStarted() {
    return this.status === ServiceStatus.Started;
  }

  setup() {
    logger.info(this.options.code, 'setup');
    this.status = ServiceStatus.Ready;
  }

  start() {
    logger.info(this.options.code, 'starting');
    if (this.isStarted()) {
      logger.error(this.options.code, 'already running');
      return;
    }
    this.isRunning = true;
    if (this.options.broadcastMode === Broadcasting.ContinuousStream) {
      this.broadcastPid = setInterval(() => { this.publishData(); }, this.options.updateInterval);
    }
    logger.info(this.options.code, 'started.');
    if (this.options.broadcastMode === Broadcasting.ContinuousStream) {
      setTimeout(() => { this.stop(); }, this.options.idleTimeout);
    }
    this.status = ServiceStatus.Started;
  }

  stop() {
    logger.info(this.options.code, 'stopping');
    if (!this.isRunning) {
      logger.error(this.options.code, 'already stopped');
      return;
    }
    clearInterval(this.broadcastPid);
    this.isRunning = false;
    this.broadcastPid = null;
    logger.info(this.options.code, 'stopped.');
    this.status = ServiceStatus.Stopped;
  }

  getInfo() {
    return { code: this.options.code, isRunning: this.isRunning, status: this.status, type: this.options.type, broadcast: this.options.broadcastMode, idleTimeout: this.options.idleTimeout };
  }

  publishStatus() {
    logger.debug(this.options.code, ServiceEvent.STATUS, this.isRunning);
    this.options.eventBus.emit(EventType.DataFromService, this.options.code, ServiceEvent.STATUS, this.getInfo());
  }

  publishData() {
    logger.debug(this.options.code, ServiceEvent.DATA);
    this.options.eventBus.emit(EventType.DataFromService, this.options.code, ServiceEvent.DATA, this.data);
  }
};

module.exports = BaseService;