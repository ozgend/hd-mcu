const { ServiceCommand, EventType, ServiceStatus, Broadcasting } = require('./constants');
const logger = require('./logger');

class BaseService {
  constructor(eventBus, { serviceCode, serviceType, updateInterval, broadcastMode, idleTimeout, commands }) {
    this.options = {
      serviceCode,
      serviceType,
      commands: commands ? commands.push(...Object.values(ServiceCommand)) : Object.values(ServiceCommand),
      updateInterval: updateInterval ?? 1000 * 5,
      idleTimeout: idleTimeout ?? 1000 * 120,
      broadcastMode: broadcastMode ?? Broadcasting.OnDemandPolling,
    };
    this.eventBus = eventBus ?? { emit: () => { } };
    this.status = ServiceStatus.Initialized;
    this.broadcastPid = null;
    this.isRunning = false;
    this.data = {};

    this.eventBus.on(EventType.CommandForService, (code, command) => {
      if (code === this.options.serviceCode) {
        this.handleCommand(command);
      }
    });
  }

  handleCommand(command) {
    logger.info(this.options.serviceCode, 'handleCommand', command);
    switch (command) {
      case ServiceCommand.START:
        this.start();
        break;
      case ServiceCommand.STOP:
        this.stop();
        break;
      case ServiceCommand.INFO:
        this.publishInformation();
        break;
      case ServiceCommand.DATA:
        this.start();
        this.publishData();
        break;
      default:
        break;
    }
  }

  isStarted() {
    return this.status === ServiceStatus.Started;
  }

  setup() {
    logger.info(this.options.serviceCode, 'setup');
    this.status = ServiceStatus.Available;
    // this.publishInformation();
  }

  start() {
    logger.info(this.options.serviceCode, 'starting');
    if (this.isStarted()) {
      logger.error(this.options.serviceCode, 'already running');
      return;
    }
    this.isRunning = true;
    if (this.options.broadcastMode === Broadcasting.ContinuousStream) {
      this.broadcastPid = setInterval(() => {
        this.publishData();
      }, this.options.updateInterval);
    }
    logger.info(this.options.serviceCode, 'started.');
    if (this.options.broadcastMode === Broadcasting.ContinuousStream) {
      setTimeout(() => {
        this.stop();
      }, this.options.idleTimeout);
    }
    this.status = ServiceStatus.Started;
    this.publishInformation();
  }

  stop() {
    logger.info(this.options.serviceCode, 'stopping');
    if (!this.isRunning) {
      logger.error(this.options.serviceCode, 'already stopped');
      return;
    }
    if (this.broadcastPid) {
      clearInterval(this.broadcastPid);
    }
    this.isRunning = false;
    this.broadcastPid = null;
    logger.info(this.options.serviceCode, 'stopped.');
    this.status = ServiceStatus.Stopped;
    this.publishInformation();
  }

  getInfo() {
    return { status: this.status, isRunning: this.isRunning, ...this.options };
  }

  publishInformation() {
    logger.debug(this.options.serviceCode, ServiceCommand.INFO, this.isRunning);
    this.eventBus.emit(EventType.DataFromService, this.options.serviceCode, ServiceCommand.INFO, this.getInfo());
  }

  publishData() {
    logger.debug(this.options.serviceCode, ServiceCommand.DATA);
    this.eventBus.emit(EventType.DataFromService, this.options.serviceCode, ServiceCommand.DATA, this.data);
  }
}

module.exports = BaseService;
