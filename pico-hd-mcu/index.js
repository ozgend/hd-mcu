const rtc = require('rtc');
rtc.setTime(-2209078556000);

const logger = require('./logger');
logger.pulse.up();

const { eventBus, publishToSerial } = require('./event-bus');
const { SchemaVersion } = require('../ts-schema/schema.version');
const { ServiceType, ServiceCode, EventType } = require('../ts-schema/constants');
const TurnSignalService = require('./services/turn-signal-service');
const SystemStatsService = require('./services/system-stats-service');
const VehicleSensorService = require('./services/vehicle-sensor-service');
const ThermometerService = require('./services/thermometer-service');
const VehicleInfoService = require('./services/vehicle-info.service');

logger.info(ServiceCode.Main, 'schema version', SchemaVersion);

const _services = [
  new VehicleInfoService(eventBus),
  new VehicleSensorService(eventBus),
  new SystemStatsService(eventBus),
  new ThermometerService(eventBus),
  new TurnSignalService(eventBus),
];

_services.forEach(service => {
  service.setup();
  if (service.ServiceType === ServiceType.ALWAYS_RUN) {
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
      publishToSerial(ServiceCode.Main, 'START', _services.filter(s => s.isRunning).map(s => { return { code: s.code, type: s.type }; }));
      break;
    case 'STOP':
      _services.filter(s => s.type === ServiceType.ON_DEMAND).forEach(service => service.stop());
      publishToSerial(ServiceCode.Main, 'STOP', _services.filter(s => !s.isRunning).map(s => { return { code: s.code, type: s.type }; }));
      break;
    case 'LIST_ALL':
      logger.info(ServiceCode.Main, 'list all services', _services.map(s => s.code));
      publishToSerial(ServiceCode.Main, 'LIST_ALL', _services.map(s => { return { code: s.code, type: s.type }; }));
      break;
    case 'LIST_RUN':
      logger.info(ServiceCode.Main, 'list running services', _services.filter(s => s.isRunning).map(s => s.code));
      publishToSerial(ServiceCode.Main, 'LIST_RUN', _services.filter(s => s.isRunning).map(s => { return { code: s.code, type: s.type }; }));
      break;
    default:
      logger.error(ServiceCode.Main, 'unknown module command', command);
      publishToSerial(ServiceCode.Main, 'ERR', `unknown module command: ${command}`);
      break;
  }
};

eventBus.on(EventType.CommandForModule, (command) => {
  logger.debug(ServiceCode.Main, EventType.CommandForModule, { command });
  dispatchModuleCommand(command);
});