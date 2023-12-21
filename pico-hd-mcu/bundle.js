/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const textDecoder = new TextDecoder();
const { EventEmitter } = __webpack_require__(2);
const { UART } = __webpack_require__(3);
const options = {
  baudrate: 9600,
  bits: 8,
  partity: UART.PARTIY_NONE,
  stop: 1,
  flow: UART.FLOW_NONE,
  bufferSize: 2048,
};
const Serial = new UART(0, options);

class EventBus extends EventEmitter { };
const eventBus = new EventBus();

console.log('event bus ready');

let _serialPayload = '';

Serial.on('data', (data) => {
  console.log(`incoming serial: [${textDecoder.decode(data)}], length: ${data.length}, raw: ${data.join(',')}`);

  data.forEach((byte) => {
    if (byte === 10) {
      eventBus.emit('serial_data', _serialPayload);
      _serialPayload = '';
    }
    else {
      _serialPayload += String.fromCharCode(byte);
    }
  });

});

eventBus.on('service_data', (code, payload) => {
  console.log(`service_data: [${code}] [${JSON.stringify(payload)}]`);
  Serial.write(`${code}=${JSON.stringify(payload)}\n`);
});

eventBus.on('serial_data', (payload) => {
  console.log(`serial_data: [${payload}]`);
  const parts = payload.split('=');

  if (payload.startsWith('MODULE')) {
    eventBus.emit('module_command', parts[1]);
  }
  else {
    eventBus.emit('service_command', ...parts);
  }
});

console.log('serial com ready');

setInterval(() => { Serial.write('heartbeat\n') }, 2000);

const publishToSerial = (code, payload) => {
  eventBus.emit('service_data', code, payload);
};

module.exports = { eventBus, publishToSerial };

/***/ }),
/* 2 */
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),
/* 3 */
/***/ ((module) => {

"use strict";
module.exports = require("uart");

/***/ }),
/* 4 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { Button } = __webpack_require__(5);
const { Hardware, Gpio, ServiceCode, ServiceCommand } = __webpack_require__(6);
const BaseService = __webpack_require__(7);

const CurrentState = {
  Left: false,
  Right: false,
  Both: false
};

const WillBlink = {
  Left: false,
  Right: false,
  Both: false
};

let _pid = 0;
let _valueLeft = -1;
let _valueRight = -1;

class TurnSignalModuleService extends BaseService {
  constructor(messageBus) {
    super(ServiceCode.TurnSignalModule, 200, messageBus);

    pinMode(Gpio.SIGNAL_OUT_LEFT, OUTPUT);
    pinMode(Gpio.SIGNAL_OUT_RIGHT, OUTPUT);
    pinMode(Gpio.SIGNAL_IN_LEFT, INPUT);
    pinMode(Gpio.SIGNAL_IN_RIGHT, INPUT);
  }

  handleCommand(command) {
    super.handleCommand(command);

    switch (command) {
      case ServiceCommand.ALL:
        this._setTargetChannel(true, true);
        break;
      case ServiceCommand.LEFT:
        this._setTargetChannel(true, false);
        break;
      case ServiceCommand.RIGHT:
        this._setTargetChannel(false, true);
        break;
      default:
        break;
    }
  }

  update() {
    this._readSwitchInputs();
    this._processState();
    base.update();
  }

  _setTargetChannel(isLeft, isRight) {
    if (isLeft && isRight) {
      WillBlink.Both = !WillBlink.Both;
      WillBlink.Left = false;
      WillBlink.Right = false;
      console.log(`TurnSignalModuleService._setTargetChannel: BOTH ${WillBlink.Both}`);
    }
    else if (isLeft) {
      WillBlink.Both = false;
      WillBlink.Left = !WillBlink.Left;
      WillBlink.Right = false;
      console.log(`TurnSignalModuleService._setTargetChannel: LEFT ${WillBlink.Left}`);
    }
    else if (isRight) {
      WillBlink.Both = false;
      WillBlink.Left = false;
      WillBlink.Right = !WillBlink.Right;
      console.log(`TurnSignalModuleService._setTargetChannel: RIGHT ${WillBlink.Right}`);
    }
  }

  _readSwitchInputs() {
    _valueLeft = digitalRead(Gpio.SIGNAL_IN_LEFT);
    _valueRight = digitalRead(Gpio.SIGNAL_IN_RIGHT);
    // console.log(`TurnSignalModuleService._readSwitchInputs: LEFT:${_valueLeft} RIGHT:${_valueRight}`);
    this._setTargetChannel(_valueLeft === HIGH, _valueRight === HIGH);
  }

  _processState() {
    if (!CurrentState.Both && WillBlink.Both) {
      this._enableFlasher(true, true);
      console.log(`TurnSignalModuleService._processState: BOTH ENABLE`);
    }
    else if (!CurrentState.Left && WillBlink.Left) {
      this._enableFlasher(true, false);
      console.log(`TurnSignalModuleService._processState: LEFT ENABLE`);
    }
    else if (!CurrentState.Right && WillBlink.Right) {
      this._enableFlasher(false, true);
      console.log(`TurnSignalModuleService._processState: RIGHT ENABLE`);
    }
    else if (CurrentState.Both && !WillBlink.Both) {
      this._disableFlasher("cancel_both");
      console.log(`TurnSignalModuleService._processState: BOTH DISABLE`);
    }
    else if (CurrentState.Left && !WillBlink.Left) {
      this._disableFlasher("cancel_left");
      console.log(`TurnSignalModuleService._processState: LEFT DISABLE`);
    }
    else if (CurrentState.Right && !WillBlink.Right) {
      this._disableFlasher("cancel_right");
      console.log(`TurnSignalModuleService._processState: RIGHT DISABLE`);
    }
  }

  _disableFlasher(reason) {
    cancelInterval(_pid);
    _pid = 0;
    console.log(`TurnSignalModuleService.disableFlasher: ${reason}`);
  }

  _enableFlasher(isLeft, isRight) {
    this._disableFlasher(_pid, "cancel");

    _pid = setInterval(() => {
      digitalWrite(Gpio.SIGNAL_OUT_LEFT, isLeft ? HIGH : LOW);
      digitalWrite(Gpio.SIGNAL_OUT_RIGHT, isRight ? HIGH : LOW);
    }, Hardware.TURN_SIGNAL_BLINK_RATE);

    CurrentState.Both = isLeft && isRight;
    CurrentState.Left = isLeft && !isRight;
    CurrentState.Right = !isLeft && isRight;

    setTimeout(() => {
      cancelInterval(_pid);

      _pid = 0;
    }, Hardware.TURN_SIGNAL_BLINK_TIMEOUT);
  }
}

module.exports = TurnSignalModuleService;

/***/ }),
/* 5 */
/***/ ((module) => {

"use strict";
module.exports = require("button");

/***/ }),
/* 6 */
/***/ ((module) => {

const Hardware = {
  SERIAL_BAUD_COM: 9600,
  SERIAL_BAUD_BT: 9600,
  SERIAL_WRITE_AT_ONCE: true,
  HAS_BLUETOOTH: false,
  HAS_ONBOARD_VREF: true,
  HAS_ONBOARD_TEMP: true,
  HAS_TURN_SIGNAL_SERVICE: true,
  HAS_DIRECT_SENSOR_SERVICE: false,
  HAS_MUX_SENSOR_SERVICE: false,
  TURN_SIGNAL_BLINK_RATE: 500,
  TURN_SIGNAL_BLINK_TIMEOUT: 30000,
  TURN_SUGNAL_ANALOGUE_VALUE_THRESHOLD : 800,
};

// https://electrocredible.com/raspberry-pi-pico-w-pinout-guide-diagrams/
const Gpio = {
  BT_SERIAL_TX: 0,
  BT_SERIAL_RX: 1,
  SIGNAL_OUT_LEFT: 14,
  SIGNAL_OUT_RIGHT: 15,
  SIGNAL_IN_RIGHT: 20,
  SIGNAL_IN_LEFT: 21,
  DIRECT_SENSOR_VOLTAGE: 16,
  DIRECT_SENSOR_RPM: 17,
  DIRECT_SENSOR_SPEED: 18,
  MUX_OUT_A: 9,
  MUX_OUT_B: 8,
  MUX_OUT_C: 7,
  MUX_SENSOR_CLK: 6,
  MUX_SENSOR_CS: 5,
  MUX_SENSOR_DATA: 4,
  ADC0: 26,
  ADC1: 27,
  ADC2: 28,
  ADC_VREF: 35,
  ADC_TEMP: 4, 
};

const ServiceType = {
  ALWAYS_RUN: 10,
  ON_DEMAND: 20,
  ONE_TIME: 30
};

const ServiceCode = {
  TurnSignalModule: 'TSM',
  SystemStats: 'SYS',
  DeviceSensor: 'DEV',
  Dummy: 'AAA',
  MuxSensor: 'MUX',
  DirectSensor: 'DCT',
};

const ServiceCommand = {
  START: 'START',
  STOP: 'STOP',
  DIAG: 'DIAG',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  ALL: 'ALL'
};

module.exports = { Hardware, Gpio, ServiceType, ServiceCode, ServiceCommand };

/***/ }),
/* 7 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { ServiceCommand } = __webpack_require__(6);

class BaseService {
  constructor(code, updateInterval, eventBus) {
    this.code = code;
    this.updateInterval = updateInterval;
    this.eventBus = eventBus ?? { emit: () => { } };
    this.lastUpdate = 0;
    this.pid = null;
    this.isRunning = false;
    this.data = {};

    this.eventBus.on('service_command', (code, command) => {
      if (code === this.code) {
        this.handleCommand(command);
      }
    });
  }

  handleCommand(command) {
    console.log(`[${this.code}] handleCommand: ${command}`);
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
    console.log(`[${this.code}] setup`);
  }

  start() {
    console.log(`[${this.code}] starting`);
    if (this.isRunning) {
      console.log(`[${this.code}] already running`);
      return;
    }
    this.isRunning = true;
    this.pid = setInterval(() => { this.update(); }, this.updateInterval);
  }

  stop() {
    console.log(`[${this.code}] stopping`);
    if (!this.isRunning) {
      console.log(`[${this.code}] already stopped`);
      return;
    }
    clearInterval(this.pid);
    this.isRunning = false;
    this.pid = null;
  }

  toggle() {
    console.log(`[${this.code}] toggle`);
    if (this.isRunning) {
      this.stop();
    } else {
      this.start();
    }
  }

  update() {
    console.log(`[${this.code}] update`);
    this.lastUpdate = Date.now();
    this.eventBus.emit('service_data', this.code, this.data);
  }
};

module.exports = BaseService;

/***/ }),
/* 8 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { ADC } = __webpack_require__(9);
const { ServiceCode } = __webpack_require__(6);
const BaseService = __webpack_require__(7);

class DeviceSensorService extends BaseService {
  constructor(eventBus) {
    super(ServiceCode.DeviceSensor, 1000, eventBus);

    this.pinTemp = new ADC(4);
    this.pinVref = new ADC(35);
  }

  update() {
    // 27 - (volt - 0.706)/0.001721
    this.data.temp = 27 - ((this.pinTemp.read() * (2 ^ 12 / 3.3)) - 0.706) / 0.001721;
    this.data.vref = this.pinVref.read() / (2 ^ 12);
    this.data.uptime = Date.now();
    super.update();
  }
};

module.exports = DeviceSensorService;

/***/ }),
/* 9 */
/***/ ((module) => {

"use strict";
module.exports = require("adc");

/***/ }),
/* 10 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { ServiceCode } = __webpack_require__(6);
const BaseService = __webpack_require__(7);

class SystemStatsService extends BaseService {
  constructor(eventBus) {
    super(ServiceCode.SystemStats, 2000, eventBus);
  }

  update() {
    console.log(`[${this.code}] updating`);

    try {

      this.data.board_name = board.name;
      this.data.board_uid = board.uid;
      this.data.board_LED = board.LED;
      this.data.process_arch = process.arch;
      this.data.process_platform = process.platform;
      this.data.process_version = process.version;
      this.data.mem_total = process.memoryUsage().heapTotal;
      this.data.mem_used = process.memoryUsage().heapUsed;
      this.data.mem_peak = process.memoryUsage().heapPeak;
    }
    catch (e) {
      console.log(`[${this.code}] error: ${e}`);
    }

    console.log(`[${this.code}] update: ${JSON.stringify(this.data)}`);
    super.update();
  }
};

module.exports = SystemStatsService;

/***/ }),
/* 11 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { ServiceCode } = __webpack_require__(6);
const BaseService = __webpack_require__(7);

class DummyService extends BaseService {
  constructor(eventBus) {
    super(ServiceCode.Dummy, 1000, eventBus);
  }

  update() {
    this.data.uptime = Date.now();
    super.update();
  }
};

module.exports = DummyService;

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const { eventBus, publishToSerial } = __webpack_require__(1);
const TurnSignalService = __webpack_require__(4);
const DeviceSensorService = __webpack_require__(8);
const SystemStatsService = __webpack_require__(10);
const DummyService = __webpack_require__(11);

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

})();

/******/ })()
;