const logger = require('./logger');
const { ServiceCommand, EventType, ServiceStatus, Broadcasting } = require('../ts-schema/constants');
const { SchemaVersion } = require('../ts-schema/schema.version');

class BaseService {
  constructor(eventBus, { serviceCode, serviceType, updateInterval, broadcastMode, idleTimeout, commands }) {
    this.options = {
      serviceCode,
      serviceType,
      updateInterval: updateInterval ?? 1000 * 5,
      idleTimeout: idleTimeout ?? 1000 * 120,
      broadcastMode: broadcastMode ?? Broadcasting.OnDemandPolling,
      commands: (commands && commands.length > 0) ? [...Object.values(ServiceCommand), ...commands] : Object.values(ServiceCommand),
    };

    this.eventBus = eventBus ?? { emit: () => { } };
    this.status = ServiceStatus.Initialized;
    this.broadcastPid = null;
    this.isRunning = false;
    this.data = {};

    this.eventBus.on(EventType.CommandForService, (code, command, raw) => {
      if (code === this.options.serviceCode) {
        this.handleCommand(command, raw);
      }
    });
  }

  handleCommand(command, raw) {
    logger.debug(this.options.serviceCode, EventType.CommandForService, command, raw);
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
        // this.start();
        this.publishData();
        break;
      case ServiceCommand.SET:
        this.peristSettings(raw);
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
    if (this.isStarted()) {
      logger.info(this.options.serviceCode, 'already running');
      return;
    }
    logger.info(this.options.serviceCode, 'starting');
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
    if (!this.isRunning) {
      logger.info(this.options.serviceCode, 'already stopped');
      return;
    }
    logger.info(this.options.serviceCode, 'stopping');
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
    return { schemaVersion: SchemaVersion, status: this.status, isRunning: this.isRunning, ...this.options };
  }

  peristSettings(data) {
    logger.debug(this.options.serviceCode, ServiceCommand.SET, data);
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
