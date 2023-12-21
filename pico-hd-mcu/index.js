const { eventBus, publishToSerial } = require('./event-bus');
const TurnSignalService = require('./services/turn-signal-module-service');
const DeviceSensorService = require('./services/device-sensor-service');
const SystemStatsService = require('./services/system-stats-service');
const DummyService = require('./services/dummy-service');

const _services = [
  new DummyService(eventBus),
  new TurnSignalService(eventBus),
  new DeviceSensorService(eventBus),
  new SystemStatsService(eventBus)
];

_services.forEach(s => s.setup());

const dispatchModuleCommand = (command) => {
  switch (command) {
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
