const { eventBus, publishToSerial } = require('./event-bus');
const TurnSignalService = require('./services/turn-signal-service');
const DeviceSensorService = require('./services/device-sensor-service');
const SystemStatsService = require('./services/system-stats-service');
const DummyService = require('./services/dummy-service');
const { ServiceType } = require('./constants');

const _services = [
  new DummyService(eventBus),
  new TurnSignalService(eventBus),
  new DeviceSensorService(eventBus),
  new SystemStatsService(eventBus)
];

_services.forEach(service => {
  service.setup();
  if (service.type === ServiceType.ALWAYS_RUN) {
    service.start();
  }
});

const dispatchModuleCommand = (command) => {
  switch (command) {
    case 'START':
      _services.filter(s => s.type === ServiceType.ON_DEMAND).forEach(service => service.start());
      break;
    case 'STOP':
      _services.filter(s => s.type === ServiceType.ON_DEMAND).forEach(service => service.stop());
      break;
    case 'LS':
      console.log(`all services: ${_services.map(s => s.code).join(', ')}`);
      publishToSerial('LS', _services.map(s => s.code).join(','));
      break;
    case 'LS_RUN':
      console.log(`running services: ${_services.filter(s => s.isRunning).map(s => s.code).join(', ')}`);
      publishToSerial('LS_RUN', _services.filter(s => s.isRunning).map(s => s.code).join(','));
      break;
    default:
      console.log('unknown command');
      publishToSerial('ERR', 'unknown command');
      break;
  }
};

eventBus.on('module_command', (command) => {
  console.log(`dispatching module command: ${command}`);
  dispatchModuleCommand(command);
});

setInterval(() => { digitalToggle(25); }, 500);
