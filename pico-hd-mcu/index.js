const logger = require('./logger');
const { eventBus, publishToSerial } = require('./event-bus');
const { ServiceType, ServiceCode, EventName } = require('./constants');
const TurnSignalService = require('./services/turn-signal-service');
const SystemStatsService = require('./services/system-stats-service');
const DeviceSensorService = require('./services/device-sensor-service');
const MuxedSensorService = require('./services/muxed-sensor-service');

const _services = [
  new TurnSignalService(eventBus),
  new SystemStatsService(eventBus),
  new DeviceSensorService(eventBus),
  new MuxedSensorService(eventBus)
];

_services.forEach(service => {
  service.setup();
  if (service.type === ServiceType.ALWAYS_RUN) {
    service.start();
  }
});

const dispatchModuleCommand = (command) => {
  switch (command) {
    case 'DIAG':
      logger.info(ServiceCode.Main, 'diagnostic event');
      publishToSerial(ServiceCode.Main, 'DIAG', 'diagnostic event');
      break;
    case 'START':
      _services.filter(s => s.type === ServiceType.ON_DEMAND).forEach(service => service.start());
      publishToSerial(ServiceCode.Main, 'START', _services.filter(s => s.isRunning).map(s => { return { code: s.code, type: s.type };}));
      break;
    case 'STOP':
      _services.filter(s => s.type === ServiceType.ON_DEMAND).forEach(service => service.stop());
      publishToSerial(ServiceCode.Main, 'STOP', _services.filter(s => !s.isRunning).map(s => { return { code: s.code, type: s.type };}));
      break;
    case 'LIST_ALL':
      logger.info(ServiceCode.Main, 'list all services', _services.map(s => s.code));
      publishToSerial(ServiceCode.Main, 'LIST_ALL', _services.map(s => { return { code: s.code, type: s.type };}));
      break;
    case 'LIST_RUN':
      logger.info(ServiceCode.Main, 'list running services', _services.filter(s => s.isRunning).map(s => s.code));
      publishToSerial(ServiceCode.Main, 'LIST_RUN', _services.filter(s => s.isRunning).map(s => { return { code: s.code, type: s.type };}));
      break;
    default:
      logger.error(ServiceCode.Main, 'unknown module command', command);
      publishToSerial(ServiceCode.Main, 'ERR', `unknown module command: ${command}`);
      break;
  }
};

eventBus.on(EventName.CommandForModule, (command) => {
  logger.debug(ServiceCode.Main, EventName.CommandForModule, { command });
  dispatchModuleCommand(command);
});