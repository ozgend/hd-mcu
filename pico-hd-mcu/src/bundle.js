/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

"use strict";
module.exports = require("rtc");

/***/ }),
/* 2 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// const { PWM } = require('pwm');
const { Gpio } = __webpack_require__(3);
pinMode(Gpio.ONBOARD_LED, OUTPUT);

// const _ledPwm = new PWM(Gpio.ONBOARD_LED, 1000, 0.01);
// _ledPwm.start();

// ledPwm.start();
// ledPwm.setFrequency(1000);
// ledPwm.setDuty(0.01);

const LEVELS = { DEBUG: 0, INFO: 1, ERROR: 2 };
const LEVEL_NAMES = ['DEBUG', 'INFO', 'ERROR'];
const LOG_LEVEL = LEVELS.DEBUG;

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
  // _ledPwm.setDuty(0.25);
  if (level >= LOG_LEVEL) {
    message = data ? `${message} ${JSON.stringify(data)}` : message;
    console.log(`${LEVEL_NAMES[level]} | [${code}] ${message}`);
  }
  // _ledPwm.setDuty(0.01);
}

const pulse = {
  _state: HIGH,
  up: () => {
    // _ledPwm.setDuty(duty ?? 1.0);
    pulse._state = HIGH;
    digitalWrite(Gpio.ONBOARD_LED, HIGH);
  },
  down: () => {
    // _ledPwm.setDuty(0.01);
    pulse._state = LOW;
    digitalWrite(Gpio.ONBOARD_LED, LOW);
  },
  toggle: () => {
    // _ledPwm.setDuty(_ledPwm.getDuty() === 1.0 ? 0.01 : 1.0);
    pulse._state = pulse._state === HIGH ? LOW : HIGH;
    digitalWrite(Gpio.ONBOARD_LED, pulse._state);
  }
};

module.exports = { info, error, debug, pulse };

/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Gpio = exports.Hardware = exports.EventType = exports.TurnSignalCommands = exports.ServiceCommand = exports.ServiceCode = exports.BroadcastMode = exports.ServiceStatus = exports.ServiceType = exports.Seperator = exports.FILE_BUNDLE = exports.FILE_VHI_DATA = exports.FILE_TSM_CONFIG = exports.MaxItemSize = void 0;
exports.MaxItemSize = 9999;
exports.FILE_TSM_CONFIG = "data.tsm-config.json";
exports.FILE_VHI_DATA = "data-vehicle-info.json";
exports.FILE_BUNDLE = "bundle.js";
exports.Seperator = {
    SerialCommand: "+",
    ServiceData: "=",
};
var ServiceType;
(function (ServiceType) {
    ServiceType["AlwaysRun"] = "ALWAYS_RUN";
    ServiceType["OnDemand"] = "ON_DEMAND";
    ServiceType["OneTime"] = "ONE_TIME";
})(ServiceType || (exports.ServiceType = ServiceType = {}));
var ServiceStatus;
(function (ServiceStatus) {
    ServiceStatus["Initialized"] = "INITIALIZED";
    ServiceStatus["Available"] = "AVAILABLE";
    ServiceStatus["Ready"] = "READY";
    ServiceStatus["Started"] = "STARTED";
    ServiceStatus["Stopped"] = "STOPPED";
    ServiceStatus["Error"] = "ERROR";
})(ServiceStatus || (exports.ServiceStatus = ServiceStatus = {}));
var BroadcastMode;
(function (BroadcastMode) {
    BroadcastMode["ContinuousStream"] = "CONTINUOUS_STREAM";
    BroadcastMode["OnDemandPolling"] = "ON_DEMAND_POLLING";
})(BroadcastMode || (exports.BroadcastMode = BroadcastMode = {}));
exports.ServiceCode = {
    SystemStats: "SYS",
    VehicleSensor: "VHC",
    VehicleInfo: "VHI",
    Thermometer: "THE",
    TurnSignalModule: "TSM",
    Module: "M0",
    EventBus: "BUS",
    Main: "MAIN",
    Heartbeat: "BEAT",
};
exports.ServiceCommand = {
    START: "START",
    STOP: "STOP",
    INFO: "INFO",
    DATA: "DATA",
    SET: "SET",
};
exports.TurnSignalCommands = {
    DIAG: "DIAG",
    LEFT: "LEFT",
    RIGHT: "RIGHT",
    ALL: "ALL",
    NONE: "NONE",
};
exports.EventType = {
    CommandForModule: "MODULE_COMMAND",
    CommandForService: "SERVICE_COMMAND",
    DataFromService: "SERVICE_DATA",
    DataFromSerial: "SERIAL_DATA",
};
exports.Hardware = {
    MCU_NAME: "HDMCU",
    // SERIAL_BAUD_COM: 9600,
    // SERIAL_BAUD_BT: 9600,
    MUX_SENSOR_CONNECTED_ITEMS: [0, 1, 2, 3, 4, 5, 6, 7],
    MUX_SENSOR_READ_INTERVAL: 1000,
    MUX_SENSOR_READ_BATCH_TIMEOUT: 3000,
    TURN_SIGNAL_BTN_DEBOUNCE: 100,
    TURN_SIGNAL_BLINK_RATE: 400,
    TURN_SIGNAL_BLINK_TIMEOUT: 20000,
    TURN_SIGNAL_DIAG_RATE: 100,
    TURN_SIGNAL_DIAG_TIMEOUT: 2000,
    TURN_SIGNAL_DIAG_COUNT: 3,
    // TURN_SIGNAL_INTERRUPT_WAIT: 100,
    ADC_BIT_MAX_VALUE: 4096, // 1 << 12
    ADC_REF_MAX_VOLTAGE: 3.3,
    ADC_SCALING_FACTOR: 6.95,
    // ADC_CONVERSION_FACTOR: 0.0008056640625, // 3.3 / 1 << 12
    ADC_OFFSET_VOLTAGE: 0.706,
    TEMPERATURE_SCALING_FACTOR: 0.001721,
    TEMPERATURE_OFFSET: 27,
    BATTERY_VOLTAGE_R1: 33000,
    BATTERY_VOLTAGE_R2: 7500,
    // BATTERY_VOLTAGE_LOSS: 0.01,
    // BATTERY_VOLTAGE_MIN: 11.0,
    // BATTERY_VOLTAGE_MAX: 15.0,
    SERVICE_POLL_INTERVAL: 5000,
    HEARTBEAT_PUSH_INTERVAL: 5000,
};
// hardware voltage simulation
// https://www.tinkercad.com/things/irP9OkxQxpl-brilliant-leelo/
// for standard rpi pico
// https://pico.pinout.xyz/
// https://electrocredible.com/raspberry-pi-pico-w-pinout-guide-diagrams/
exports.Gpio = {
    // functionality: GP pin,   // name - notes/wiring
    ONBOARD_LED: 25, // GP25 - LED
    VEHICLE_SENSOR_TEMP: 30, // GP30 - ADC4 - virtual
    VEHICLE_SENSOR_VREF: 29, // GP29 - ADC3
    VEHICLE_SENSOR_SPEED: 28, // GP28 - ADC2
    VEHICLE_SENSOR_RPM: 27, // GP27 - ADC1
    VEHICLE_SENSOR_BATT: 26, // GP26 - ADC0
    VEHICLE_SENSOR_IGN: 21, // GP21 - D_IGN
    VEHICLE_SENSOR_AUX: 20, // GP20 - D_AUX
    SIGNAL_IN_LEFT: 19, // GP19 - D_SIG_L_IN
    SIGNAL_IN_RIGHT: 18, // GP18 - D_SIG_R_IN
    SIGNAL_OUT_LEFT: 16, // GP16 - D_SIG_L_OUT
    SIGNAL_OUT_RIGHT: 17, // GP17 - D_SIG_R_OUT
    THERMO_SENSOR_CLK: 10, // GP10 - D_SCK
    THERMO_SENSOR_DATA: 12, // GP12 - D_SO
    THERMO_SENSOR_CS: 13, // GP13 - D_CS
    MUX_OUT_A: 9, // GP9  - D_MUX_A
    MUX_OUT_B: 8, // GP8  - D_MUX_B
    MUX_OUT_C: 7, // GP7  - D_MUX_C
    BT_SERIAL_RX: 1, // GP1  - D_BT_RX
    BT_SERIAL_TX: 0, // GP0  - D_BT_TX
};


/***/ }),
/* 4 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { EventEmitter } = __webpack_require__(5);
const { UART } = __webpack_require__(6);
const { writeFile } = __webpack_require__(7);
const logger = __webpack_require__(2);
const { ServiceCode, EventType, Seperator, ServiceCommand, Hardware, FILE_BUNDLE } = __webpack_require__(3);

const uartOptions = {
  baudrate: 9600,
  bits: 8,
  partity: UART.PARTIY_NONE,
  stop: 1,
  flow: UART.FLOW_NONE,
  bufferSize: 2048,
};

const Serial = new UART(0, uartOptions);

setTimeout(() => {
  Serial.write(`AT+NAME${Hardware.MCU_NAME}\n`);
  logger.info(ServiceCode.EventBus, 'uart setup done', `AT+NAME${Hardware.MCU_NAME}`);
  Serial
}, 1000);

logger.info(ServiceCode.EventBus, 'uart ready', uartOptions.baudrate);

class EventBus extends EventEmitter { }
const eventBus = new EventBus();
logger.info(ServiceCode.EventBus, 'emitter ready');

let _serialPayload = '';
let fileBuffer = '';
let inFileTransferMode = false;

// Serial.on('data', (data) => {
//   //logger.debug(ServiceCode.EventBus, 'serial.on.data', { raw: data, length: data.length, text: textDecoder.decode(data) });

//   data.forEach((byte) => {
//     if (byte === 10) {
//       if (_serialPayload.includes('OK')) {
//         logger.debug(ServiceCode.EventBus, 'SERIAL_PAYLOAD', _serialPayload);
//       }
//       else {
//         eventBus.emit(EventType.DataFromSerial, _serialPayload.trim());
//       }
//       _serialPayload = '';
//     } else if (byte !== 0) {
//       _serialPayload += String.fromCharCode(byte).trim();
//     }
//   });
// });

Serial.on('data', (data) => {
  data.forEach((byte) => {
    // Detect start and end markers for file transfer mode
    if (!inFileTransferMode && _serialPayload.includes("<START>")) {
      inFileTransferMode = true;
      fileBuffer = ''; // Reset file buffer for new transfer
      _serialPayload = '';
      return;
    } else if (inFileTransferMode && _serialPayload.includes("<END>")) {
      inFileTransferMode = false;
      saveFileBuffer(fileBuffer);
      fileBuffer = '';
      _serialPayload = '';
      return;
    }

    // Regular handling for commands and file data
    if (byte === 10) { // Newline byte
      if (!inFileTransferMode) {
        // Command mode: handle command payload
        if (_serialPayload.includes('OK')) {
          logger.debug(ServiceCode.EventBus, 'SERIAL_PAYLOAD', _serialPayload);
        } else {
          eventBus.emit(EventType.DataFromSerial, _serialPayload.trim());
        }
      } else {
        // File transfer mode: append payload to file buffer
        fileBuffer += _serialPayload;
      }
      _serialPayload = ''; // Reset payload after processing
    } else if (byte !== 0) {
      _serialPayload += String.fromCharCode(byte).trim(); // Append byte to payload
    }
  });
});

const saveFileBuffer = (buffer) => {
  writeFile(FILE_BUNDLE, buffer);
};

// events from services
eventBus.on(EventType.DataFromService, (serviceCode, eventType, serviceData) => {
  logger.debug(ServiceCode.EventBus, EventType.DataFromService, { serviceCode, eventType, serviceData });
  Serial.write(`${serviceCode}${Seperator.SerialCommand}${eventType}${Seperator.ServiceData}${JSON.stringify(serviceData)}\n`);
});

// events from serial
eventBus.on(EventType.DataFromSerial, (serialPayload) => {
  logger.debug(ServiceCode.EventBus, EventType.DataFromSerial, { serialPayload });
  let parts = serialPayload.split(Seperator.SerialCommand);
  const serviceCode = parts[0];
  let command, rawData = null;

  if (parts[1].startsWith(ServiceCommand.SET)) {
    parts = parts[1].split(Seperator.ServiceData);
    command = parts[0];
    rawData = parts[1];
  }
  else {
    command = parts[1];
  }

  logger.debug(ServiceCode.EventBus, EventType.DataFromSerial, { serviceCode, command, data: rawData });

  if (serialPayload.startsWith(ServiceCode.Module)) {
    eventBus.emit(EventType.CommandForModule, serviceCode, command, rawData);
  } else {
    eventBus.emit(EventType.CommandForService, serviceCode, command, rawData);
  }
});

logger.info(ServiceCode.EventBus, 'eventBus ready');

setInterval(() => {
  Serial.write('0_heartbeat\n');
  //logger.info(ServiceCode.EventBus, '0_heartbeat');
}, Hardware.HEARTBEAT_PUSH_INTERVAL);

const publishToSerial = (serviceCode, eventType, serviceData) => {
  eventBus.emit(EventType.DataFromService, serviceCode, eventType, serviceData);
};

module.exports = { eventBus, publishToSerial };


/***/ }),
/* 5 */
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),
/* 6 */
/***/ ((module) => {

"use strict";
module.exports = require("uart");

/***/ }),
/* 7 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const fs = __webpack_require__(8);
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const isFileExist = (filepath) => {
  return fs.existsSync(filepath);
};

const writeFile = (filepath, unencodedString) => {
  fs.writeFile(filepath, textEncoder.encode(unencodedString));
};

const readFile = (filepath) => {
  const raw = textDecoder.decode(fs.readFile(filepath));
  return raw;
};

const writeObject = (filepath, data) => {
  writeFile(filepath, JSON.stringify(data));
};

const readObject = (filepath) => {
  const raw = readFile(filepath);
  const data = JSON.parse(raw);
  return data;
};

const scaler = (rangeFrom, rangeTo) => {
  const d = (rangeTo[1] - rangeTo[0]) / (rangeFrom[1] - rangeFrom[0]);
  return value => (value - rangeFrom[0]) * d + rangeTo[0];
};

module.exports = { scaler, isFileExist, writeFile, readFile, writeObject, readObject };

/***/ }),
/* 8 */
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SchemaVersion = void 0;
exports.SchemaVersion = "2024-11-18T20:56:23";


/***/ }),
/* 10 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { readObject, writeObject } = __webpack_require__(7);
const logger = __webpack_require__(2);
const { Button } = __webpack_require__(11);
const { Hardware, Gpio, ServiceCode, TurnSignalCommands, ServiceType, Broadcasting, FILE_TSM_CONFIG } = __webpack_require__(3);
const BaseService = __webpack_require__(12);
const { TsmSettings } = __webpack_require__(13);

const defaultTsmConfig = {
  blinkRate: Hardware.TURN_SIGNAL_BLINK_RATE,
  blinkTimeout: Hardware.blinkTimeout,
  btnDebounce: Hardware.TURN_SIGNAL_BTN_DEBOUNCE,
  diagCount: Hardware.TURN_SIGNAL_DIAG_COUNT,
  diagRate: Hardware.TURN_SIGNAL_DIAG_RATE,
};
const tsmConfig = readObject(FILE_TSM_CONFIG) || TsmSettings.default(defaultTsmConfig);

const _action = {
  left: false,
  right: false
};

const _state = {
  left: false,
  right: false
};

let _flasherPid = 0;
let _cancelerPid = 0;
let _diagCounter = 0;

const _diagnostic = () => {
  logger.debug(ServiceCode.TurnSignalModule, 'diagnostic', { _state, _action });
  logger.pulse.down();
  _disableFlasher("diag-start");

  _flasherPid = setInterval(() => {
    if (_diagCounter > ((tsmConfig.diagCount) * 2)) {
      _disableFlasher("diag-complete [" + _diagCounter + "] cycles");
      _diagCounter = 0;
      return;
    }
    _state.left = !_state.left;
    _state.right = !_state.right;
    digitalToggle(Gpio.SIGNAL_OUT_LEFT);
    digitalToggle(Gpio.SIGNAL_OUT_RIGHT);
    _diagCounter++;
    logger.pulse.toggle();
    logger.debug(ServiceCode.TurnSignalModule, 'diagnostic', { _state, _diagCounter });
  }, tsmConfig.diagRate);
}

const _enableFlasher = (isLeft, isRight, blinkRate, cancelTimeout, doNotCancel) => {
  logger.debug(ServiceCode.TurnSignalModule, 'enableFlasher', { isLeft, isRight });

  if (doNotCancel) {
    _cancelerPid = 0;
    logger.debug(ServiceCode.TurnSignalModule, 'will not cancel', { isLeft, isRight });
  }
  else {
    logger.debug(ServiceCode.TurnSignalModule, 'will auto-cancel', { isLeft, isRight });
    _cancelerPid = setTimeout(() => {
      _disableFlasher("timeout");
      _action.left = false;
      _action.right = false;
    }, cancelTimeout);
  }

  _flasherPid = setInterval(() => {
    if (isLeft) {
      digitalToggle(Gpio.SIGNAL_OUT_LEFT);
      _state.left = !_state.left;
    }
    if (isRight) {
      digitalToggle(Gpio.SIGNAL_OUT_RIGHT);
      _state.right = !_state.right;
    }
    logger.pulse.toggle();
    logger.debug(ServiceCode.TurnSignalModule, 'state', _state);
  }, blinkRate);
}

const _disableFlasher = (reason) => {
  clearInterval(_flasherPid);
  clearTimeout(_cancelerPid);
  digitalWrite(Gpio.SIGNAL_OUT_LEFT, LOW);
  digitalWrite(Gpio.SIGNAL_OUT_RIGHT, LOW);

  _flasherPid = 0;
  _cancelerPid = 0;
  _state.left = false;
  _state.right = false;
  _diagCounter = 0;

  logger.debug(ServiceCode.TurnSignalModule, 'disableFlasher', { reason });
  logger.pulse.up();
}

const _setFlasher = (isLeft, isRight) => {
  logger.debug(ServiceCode.TurnSignalModule, 'setFlasher', { isLeft, isRight });
  logger.pulse.down();
  _disableFlasher("cancel-any");
  if (isLeft || isRight) {
    _enableFlasher(isLeft, isRight, tsmConfig.blinkRate, tsmConfig.blinkTimeout, isLeft && isRight);
  }
}

const _checkAction = (btnLeft, btnRight) => {
  let _readLeft = btnLeft.read();
  let _readRight = btnRight.read();

  logger.debug(ServiceCode.TurnSignalModule, `checkAction.left-current ${_action.left}, read: ${_readLeft}`);
  logger.debug(ServiceCode.TurnSignalModule, `checkAction.right-current ${_action.right}, read: ${_readRight}`);

  // hazard lights check
  if (_readLeft === HIGH && _readRight === HIGH) {

  }

  if (_readLeft === HIGH) {
    _action.left = !_action.left;
    logger.debug(ServiceCode.TurnSignalModule, `checkAction.left-HIGH ${_action.left}`);
  }
  else {
    _action.left = false;
    // logger.debug(ServiceCode.TurnSignalModule, `checkAction.left-LOW ${_action.left}`);
  }

  if (_readRight === HIGH) {
    _action.right = !_action.right;
    logger.debug(ServiceCode.TurnSignalModule, `checkAction.right-HIGH ${_action.right}`);
  }
  else {
    _action.right = false;
    // logger.debug(ServiceCode.TurnSignalModule, `checkAction.right-LOW ${_action.right}`);
  }

  _setFlasher(_action.left, _action.right);
};

class TurnSignalService extends BaseService {
  constructor(eventBus) {
    super(eventBus, {
      serviceCode: ServiceCode.TurnSignalModule,
      serviceType: ServiceType.ON_DEMAND,
      broadcastMode: Broadcasting.OnDemandPolling,
      commands: Object.values(TurnSignalCommands),
    });
  }

  setup() {
    super.setup();
    pinMode(Gpio.SIGNAL_IN_LEFT, INPUT_PULLUP);
    pinMode(Gpio.SIGNAL_IN_RIGHT, INPUT_PULLUP);
    pinMode(Gpio.SIGNAL_OUT_LEFT, OUTPUT);
    pinMode(Gpio.SIGNAL_OUT_RIGHT, OUTPUT);

    _diagnostic();

    this.leftButton = new Button(Gpio.SIGNAL_IN_LEFT, { mode: INPUT, event: RISING, debounce: tsmConfig.btnDebounce });
    this.rightButton = new Button(Gpio.SIGNAL_IN_RIGHT, { mode: INPUT, event: RISING, debounce: tsmConfig.btnDebounce });

    this.leftButton.on('click', () => {
      _checkAction(this.leftButton, this.rightButton);
    });

    this.rightButton.on('click', () => {
      _checkAction(this.leftButton, this.rightButton);
    });
  }

  handleCommand(command) {
    super.handleCommand(command);

    if (command === TurnSignalCommands.DIAG) {
      _diagnostic();
    }
    else {
      switch (command) {
        case TurnSignalCommands.ALL:
          _action.left = true;
          _action.right = true;
          break;
        case TurnSignalCommands.LEFT:
          _action.left = !_action.left;
          _action.right = false;
          break;
        case TurnSignalCommands.RIGHT:
          _action.left = false;
          _action.right = !_action.right;
          break;
        case TurnSignalCommands.NONE:
          _action.left = false;
          _action.right = false;
          break;
        default:
          _action.left = false;
          _action.right = false;
          break;
      }
      _setFlasher(_action.left, _action.right);
    }
  }

  publishData() {
    this.data.state = _state;
    this.data.action = _action;
    super.publishData();
  }
}

module.exports = TurnSignalService;

/***/ }),
/* 11 */
/***/ ((module) => {

"use strict";
module.exports = require("button");

/***/ }),
/* 12 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const logger = __webpack_require__(2);
const { ServiceCommand, EventType, ServiceStatus, Broadcasting } = __webpack_require__(3);
const { SchemaVersion } = __webpack_require__(9);

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


/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MuxSettings = exports.TsmSettings = exports.TsmControlData = exports.TsmData = exports.SystemStatsData = exports.ThermometerData = exports.VehicleSensorData = exports.VehicleInfoData = void 0;
var VehicleInfoData = /** @class */ (function () {
    function VehicleInfoData() {
        this.model = "";
        this.vin = "";
        this.year = 0;
        this.make = "";
        this.owner = "";
        this.plate = "";
        this.regId = "";
        this.oilDate = 0;
        this.oilKm = 0;
        this.oilIntervalKm = 0;
        this.tireFrontInfo = "";
        this.tireRearInfo = "";
        this.tireFrontDate = 0;
        this.tireRearDate = 0;
        this.tireFrontKm = 0;
        this.tireRearKm = 0;
        this.beltInfo = "";
        this.beltDate = 0;
        this.batteryInfo = "";
        this.batteryDate = 0;
        this.inspectDate = 0;
        this.insuranceDate = 0;
        this.serviceDate = 0;
        this.serviceInterval = 0;
    }
    return VehicleInfoData;
}());
exports.VehicleInfoData = VehicleInfoData;
var VehicleSensorData = /** @class */ (function () {
    function VehicleSensorData() {
        this.temp = 0;
        this.vref = 0;
        this.batt = 0;
        this.rpm = 0;
        this.speed = 0;
        this.tireFront = 0;
        this.tempFront = 0;
        this.tireRear = 0;
        this.tempRear = 0;
    }
    return VehicleSensorData;
}());
exports.VehicleSensorData = VehicleSensorData;
var ThermometerData = /** @class */ (function () {
    function ThermometerData() {
        this.ch_0 = 0;
        this.ch_1 = 0;
        this.ch_2 = 0;
        this.ch_3 = 0;
        this.ch_4 = 0;
        this.ch_5 = 0;
        this.ch_6 = 0;
        this.ch_7 = 0;
    }
    return ThermometerData;
}());
exports.ThermometerData = ThermometerData;
var SystemStatsData = /** @class */ (function () {
    function SystemStatsData() {
        this.arch = "";
        this.platform = "";
        this.version = "";
        this.name = "";
        this.uid = "";
        this.heapTotal = 0;
        this.heapUsed = 0;
        this.heapPeak = 0;
    }
    return SystemStatsData;
}());
exports.SystemStatsData = SystemStatsData;
var TsmData = /** @class */ (function () {
    function TsmData() {
        this.state = new TsmControlData();
        this.action = new TsmControlData();
    }
    return TsmData;
}());
exports.TsmData = TsmData;
var TsmControlData = /** @class */ (function () {
    function TsmControlData() {
        this.left = false;
        this.right = false;
    }
    return TsmControlData;
}());
exports.TsmControlData = TsmControlData;
var TsmSettings = /** @class */ (function () {
    function TsmSettings() {
        this.blinkRate = 0;
        this.blinkTimeout = 0;
        this.btnDebounce = 0;
        this.diagCount = 0;
        this.diagRate = 0;
    }
    TsmSettings.default = function (defaults) {
        var tsm = {
            blinkRate: defaults.blinkRate,
            blinkTimeout: defaults.blinkTimeout,
            btnDebounce: defaults.btnDebounce,
            diagCount: defaults.diagCount,
            diagRate: defaults.diagRate,
        };
        return tsm;
    };
    return TsmSettings;
}());
exports.TsmSettings = TsmSettings;
var MuxSettings = /** @class */ (function () {
    function MuxSettings() {
        this.sensorItems = [];
        this.readInterval = 0;
        this.readBatchTimeout = 0;
    }
    return MuxSettings;
}());
exports.MuxSettings = MuxSettings;


/***/ }),
/* 14 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const BaseService = __webpack_require__(12);
const { SystemStatsData } = __webpack_require__(13);
const { ServiceCode, ServiceType, Broadcasting } = __webpack_require__(3);

class SystemStatsService extends BaseService {
  constructor(eventBus) {
    super(eventBus, {
      serviceCode: ServiceCode.SystemStats,
      serviceType: ServiceType.ON_DEMAND,
      broadcastMode: Broadcasting.OnDemandPolling
    });
    this.data = new SystemStatsData();
  }

  setup() {
    super.setup();
    this.data.arch = process.arch;
    this.data.platform = process.platform;
    this.data.version = process.version;
    this.data.name = board.name;
    this.data.uid = board.uid;
  }

  publishData() {
    const mem = process.memoryUsage();
    this.data.heapTotal = mem.heapTotal;
    this.data.heapUsed = mem.heapUsed;
    this.data.heapPeak = mem.heapPeak;
    super.publishData();
  }
};

module.exports = SystemStatsService;

/***/ }),
/* 15 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const logger = __webpack_require__(2);
const BaseService = __webpack_require__(12);
const { VehicleSensorData } = __webpack_require__(13);
const { ServiceCode, Gpio, ServiceType, Hardware, Broadcasting } = __webpack_require__(3);

const BATTERY_VOLTAGE_SCALING_FACTOR = (Hardware.BATTERY_VOLTAGE_R1 + Hardware.BATTERY_VOLTAGE_R2) / Hardware.BATTERY_VOLTAGE_R2;

class VehicleSensorService extends BaseService {
  rpmSignalCounter = 0;
  rpmSignalLastTime = 0;

  constructor(eventBus) {
    super(eventBus, {
      serviceCode: ServiceCode.VehicleSensor,
      serviceType: ServiceType.ON_DEMAND,
      broadcastMode: Broadcasting.OnDemandPolling,
    });
    this.data = new VehicleSensorData();
  }

  start() {
    super.start();
    attachInterrupt(Gpio.VEHICLE_SENSOR_RPM, this.interruptRpmHandler, RISING);
  }

  stop() {
    super.stop();
    detachInterrupt(Gpio.VEHICLE_SENSOR_RPM);
  }

  interruptRpmHandler() {
    this.rpmSignalCounter++;
    console.log('rpm signal counter', this.rpmSignalCounter);
  }

  calculateRpm() {
    // todo: implement with harley davidson rpm sensor output voltage reference
    // const rawRpm = analogRead(Gpio.VEHICLE_SENSOR_RPM);
    // this.data.raw_rpm = rawRpm;
    // this.data.rpm = rawRpm;
    this.data.rpm = -1;

    const currentTime = millis();
    const deltaTime = currentTime - this.rpmSignalLastTime;

    if (deltaTime > 0) {
      this.data.rpm = this.rpmSignalCounter / deltaTime * 1000 * 60;
    }

    this.rpmSignalCounter = 0;
    this.rpmSignalLastTime = currentTime;
  }

  calculateSpeed() {
    // todo: implement with harley davidson speed sensor output voltage reference
    // const rawSpeed = analogRead(Gpio.VEHICLE_SENSOR_SPEED);
    // this.data.raw_speed = rawSpeed;
    // this.data.speed = rawSpeed;
    this.data.speed = -1;
  }

  calculateTpmsData() {
    // todo: implement with tpms sensor output
    this.data.tireFront = -1;
    this.data.tireRear = -1;
    this.data.tempFront = -1;
    this.data.tempRear = -1;
  }

  calculateTemperature() {
    this.data.raw_temp = analogRead(Gpio.VEHICLE_SENSOR_TEMP);
    this.data.raw_temp_volts = this.data.raw_temp * Hardware.ADC_REF_MAX_VOLTAGE;
    this.data.temp = Hardware.TEMPERATURE_OFFSET - (this.data.raw_temp_volts - Hardware.ADC_OFFSET_VOLTAGE) / Hardware.TEMPERATURE_SCALING_FACTOR;
  }

  calculateVref() {
    this.data.raw_vref = analogRead(Gpio.VEHICLE_SENSOR_VREF);
    this.data.vref = this.data.raw_vref * Hardware.ADC_SCALING_FACTOR;
  }

  calculateBattery() {
    this.data.raw_batt = analogRead(Gpio.VEHICLE_SENSOR_BATT);
    this.data.batt = this.data.raw_batt * Hardware.ADC_REF_MAX_VOLTAGE * BATTERY_VOLTAGE_SCALING_FACTOR;
  }

  setup() {
    super.setup();
    // pinMode(Gpio.VEHICLE_SENSOR_VREF, INPUT);
    // pinMode(Gpio.VEHICLE_SENSOR_TEMP, INPUT);
    pinMode(Gpio.VEHICLE_SENSOR_BATT, INPUT);
    pinMode(Gpio.VEHICLE_SENSOR_AUX, INPUT);
    pinMode(Gpio.VEHICLE_SENSOR_RPM, INPUT);
    pinMode(Gpio.VEHICLE_SENSOR_SPEED, INPUT);
    pinMode(Gpio.VEHICLE_SENSOR_IGN, INPUT);
  }

  publishData() {
    this.data.uptime = millis();

    this.calculateTemperature();
    this.calculateVref();
    this.calculateBattery();
    this.calculateRpm();
    this.calculateSpeed();
    this.calculateTpmsData();

    super.publishData();
  }


};

module.exports = VehicleSensorService;

/***/ }),
/* 16 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const MAX6675 = __webpack_require__(17);
const HC4051 = __webpack_require__(20);
const logger = __webpack_require__(2);
const BaseService = __webpack_require__(12);
const { ThermometerData } = __webpack_require__(13);
const { ServiceCode, Gpio, ServiceType, Broadcasting, Hardware } = __webpack_require__(3);

const _muxChannels = Hardware.MUX_SENSOR_CONNECTED_ITEMS;
let _readerPid = 0;
let _muxChIndex = 0;

class ThermometerService extends BaseService {
  constructor(eventBus) {
    super(eventBus, {
      serviceCode: ServiceCode.Thermometer,
      serviceType: ServiceType.ON_DEMAND,
      broadcastMode: Broadcasting.OnDemandPolling,
    });
    this.data = new ThermometerData();
  }

  start() {
    super.start();
    super.publishData();

    _muxChannels.forEach((ch) => {
      this.data[`ch_${ch}`] = 0;
    });

    this.thermoSensor = new MAX6675({ bus: 1, cs: Gpio.THERMO_SENSOR_CS, sck: Gpio.THERMO_SENSOR_CLK, miso: Gpio.THERMO_SENSOR_DATA });
    this.thermoSensor.init();

    this.mux = new HC4051({ pinA: Gpio.MUX_OUT_A, pinB: Gpio.MUX_OUT_B, pinC: Gpio.MUX_OUT_C, connectedChannels: _muxChannels });
    this.mux.init();

    // start delayed read
    setTimeout(() => {
      _readerPid = setInterval(() => {
        this.mux.enableChannelIndex(_muxChIndex);
        this.data[`ch_${_muxChannels[_muxChIndex]}`] = this.thermoSensor.readCelcius() ?? 0;
        logger.debug(ServiceCode.Thermometer, 'interval.read', { ch: _muxChannels[_muxChIndex], cx: _muxChIndex, value: this.data[`ch_${_muxChannels[_muxChIndex]}`], values: this.data });
        _muxChIndex++;
        if (_muxChIndex >= _muxChannels.length) {
          _muxChIndex = 0;
        }
      }, Hardware.MUX_SENSOR_READ_INTERVAL);
    }, Hardware.MUX_SENSOR_READ_BATCH_TIMEOUT);
  }

  stop() {
    super.stop();
    clearInterval(_readerPid);
    _readerPid = 0;
    _muxChIndex = 0;
    if (this.thermoSensor) {
      this.thermoSensor.close();
      delete this.thermoSensor;
      delete this.mux;
    }
  }

  publishData() {
    super.publishData();
  }
}

module.exports = ThermometerService;


/***/ }),
/* 17 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// refs
// https://github.com/zhenek-kreker/MAX6675/blob/master/MAX6675.cpp
// https://github.com/adafruit/MAX6675-library/blob/master/max6675.cpp

const { GPIO } = __webpack_require__(18);
const { SPI } = __webpack_require__(19);

const MAX6675_BPS = 2 * 1000 * 1000;
const MAX6675_OPEN_BIT = 0x4;
const MAX6675_CONVERSION_RATIO = 0.25;
let MAX6675_READER_CMD = [0, 0, 0, 0];

class MAX6675 {
  constructor(options) {
    this.cs = options.cs || 13;
    this.bus = options.bus || 1;
    this.spiOptions = {
      mode: options.mode || SPI.MODE_1,
      baudrate: options.baudrate || MAX6675_BPS,
      bitorder: options.bitorder || SPI.MSB,
      sck: options.sck || 10,
      clk: options.sck || 10,
      miso: options.miso || 12,
      mosi: -1,
    };
  }

  init() {
    try {
      this.spiBus = new SPI(this.bus, this.spiOptions);
      this.spiCs = new GPIO(this.cs, OUTPUT);
      this.spiCs.high();
      console.log("MAX6675: init");
      console.log(this.spiCs);
      console.log(this.spiBus);
      return true;
    }
    catch (err) {
      console.error(err);
      return false;
    }
  }

  close() {
    if (this.spiBus) {
      console.log("MAX6675: close");
      this.spiBus.close();
    }
  }

  readCelcius() {
    // console.log('MAX6675: readCelcius');

    let bytes = this.readRaw();

    if (bytes & MAX6675_OPEN_BIT) {
      console.error("MAX6675: no thermocouple attached!");
      return null;
    }
    const value = (bytes >> 3) * MAX6675_CONVERSION_RATIO;
    return value;
  }

  readFahrenheit() {
    return this.readCelcius() * 1.8 + 32;
  }

  readRaw() {
    if (this.spiCs) {
      this.spiCs.low();
      let val = this.readRaw2();
      this.spiCs.high();
      return val;
    }
    console.error('SPICS is not initialized')
    return 0;
  }

  readRaw1() {
    try {
      const sent = this.spiBus.send(new Uint8Array(MAX6675_READER_CMD));
      // console.log(`MAX6675: readRaw.sent: ${sent}b`);
      let bytes = this.spiBus.recv(16);
      if (bytes === null) {
        console.error("MAX6675: recv error");
      }
      // console.log(`MAX6675: readRaw.bytes: ${bytes} length: ${bytes.length}`);
      return bytes;
    } catch (err) {
      console.error(err);
    }
    return [];
  }

  readRaw2() {
    try {
      let raw = this.spiBus.transfer(new Uint8Array([0])) << 8;
      raw |= this.spiBus.transfer(new Uint8Array([0]));
      // console.log(`MAX6675: readRaw.bytes: ${raw}`);
      return raw;
    } catch (err) {
      console.error(err);
    }
    return [];
  }
}

module.exports = MAX6675;


/***/ }),
/* 18 */
/***/ ((module) => {

"use strict";
module.exports = require("gpio");

/***/ }),
/* 19 */
/***/ ((module) => {

"use strict";
module.exports = require("spi");

/***/ }),
/* 20 */
/***/ ((module) => {

const MUX_CHANNEL_SIZE = 8;

// C B A - channel
const MUX_CHANNEL_SELECT = [
  [LOW, LOW, LOW],    // ch 0
  [LOW, LOW, HIGH],   // ch 1
  [LOW, HIGH, LOW],   // ch 2
  [LOW, HIGH, HIGH],  // ch 3
  [HIGH, LOW, LOW],   // ch 4
  [HIGH, LOW, HIGH],  // ch 5
  [HIGH, HIGH, LOW],  // ch 6
  [HIGH, HIGH, HIGH]  // ch 7
];

class HC4051 {
  constructor(options) {
    this.pinData = options.pinData;
    this.pinA = options.pinA;
    this.pinB = options.pinB;
    this.pinC = options.pinC;
    this.pinInhibit = options.pinInhibit;
    this.connectedChannels = options.connectedChannels || [0, 1, 2, 3, 4, 5, 6, 7];
    if (options.connectedChannels) {
      this.connectedChannelSize = options.connectedChannels.length;
    }
    else {
      this.connectedChannelSize = options.connectedChannelSize || MUX_CHANNEL_SIZE;
    }
  }

  init() {
    pinMode(this.pinA, OUTPUT);
    pinMode(this.pinB, OUTPUT);
    pinMode(this.pinC, OUTPUT);
    if (this.pinData) {
      pinMode(this.pinData, INPUT);
    }
    if (this.pinInhibit) {
      pinMode(this.pinInhibit, OUTPUT);
    }
    this.enableChannelIndex(0);
  }

  enableChannel(channel) {
    if (this.connectedChannels.indexOf(channel) < 0) {
      console.error(`HC4051: channel not connected: ${channel} (connected: ${this.connectedChannels})`);
      return false;
    }
    return this.enableChannelIndex(this.connectedChannels.indexOf(channel));
  }

  enableChannelIndex(chIndex) {
    if (chIndex >= MUX_CHANNEL_SIZE) {
      console.error(`HC4051: channel out of range: ${chIndex} (max: ${MUX_CHANNEL_SIZE - 1})`);
      return false;
    }
    if (this.pinInhibit) {
      digitalWrite(this.pinInhibit, LOW);
    }
    digitalWrite(this.pinC, MUX_CHANNEL_SELECT[chIndex][0]);
    digitalWrite(this.pinB, MUX_CHANNEL_SELECT[chIndex][1]);
    digitalWrite(this.pinA, MUX_CHANNEL_SELECT[chIndex][2]);
    return true;
  }

  disableAll() {
    if (this.pinInhibit) {
      digitalWrite(this.pinInhibit, HIGH);
    }
  }
}

module.exports = HC4051;

/***/ }),
/* 21 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { writeObject, readFile, isFileExist } = __webpack_require__(7);
const logger = __webpack_require__(2);
const BaseService = __webpack_require__(12);
const { ServiceCode, ServiceType, Broadcasting, FILE_VHI_DATA } = __webpack_require__(3);
const { VehicleInfoData } = __webpack_require__(13);

class VehicleInfoService extends BaseService {
  constructor(eventBus) {
    super(eventBus, {
      serviceCode: ServiceCode.VehicleInfo,
      serviceType: ServiceType.ON_DEMAND,
      broadcastMode: Broadcasting.OnDemandPolling,
    });
    this.data = new VehicleInfoData();
  }

  peristSettings(raw) {
    super.peristSettings(raw);
    this.setVehicleInfo(JSON.parse(raw));
  }

  setVehicleInfo(payload) {
    if (payload) {
      logger.debug(ServiceCode.VehicleInfo, 'setVehicleInfo payload:', payload);
    }
    else {
      logger.debug(ServiceCode.VehicleInfo, 'setVehicleInfo payload: null');
    }
    const currentVehicleInfo = this.getVehicleInfo();
    const newVehicleInfo = payload ? Object.assign(currentVehicleInfo, payload) : currentVehicleInfo;
    logger.debug(ServiceCode.VehicleInfo, 'setVehicleInfo newVehicleInfo:', newVehicleInfo);
    writeObject(FILE_VHI_DATA, newVehicleInfo);
  }

  getVehicleInfo() {
    if (isFileExist(FILE_VHI_DATA)) {
      const vehicleInfo = readFile(FILE_VHI_DATA);
      logger.debug(ServiceCode.VehicleInfo, 'getVehicleInfo vehicleInfo:', vehicleInfo);
      return JSON.parse(vehicleInfo);
    }
    return new VehicleInfoData();
  }

  setup() {
    if (!isFileExist(FILE_VHI_DATA)) {
      logger.debug(ServiceCode.VehicleInfo, 'setup vehicleInfoFile:', FILE_VHI_DATA);
      this.setVehicleInfo(new VehicleInfoData());
    }
    else {
      logger.debug(ServiceCode.VehicleInfo, 'setup vehicleInfoFile exists:', FILE_VHI_DATA);
    }
    super.setup();
  }

  publishData() {
    this.data = this.getVehicleInfo();
    super.publishData();
  }
};

module.exports = VehicleInfoService;

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
const rtc = __webpack_require__(1);
rtc.setTime(-2209078556000);

const logger = __webpack_require__(2);
logger.pulse.up();

const { eventBus, publishToSerial } = __webpack_require__(4);
const { SchemaVersion } = __webpack_require__(9);
const { ServiceType, ServiceCode, EventType } = __webpack_require__(3);
const TurnSignalService = __webpack_require__(10);
const SystemStatsService = __webpack_require__(14);
const VehicleSensorService = __webpack_require__(15);
const ThermometerService = __webpack_require__(16);
const VehicleInfoService = __webpack_require__(21);

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
      _services.filter(s => s.options.serviceType === ServiceType.ON_DEMAND).forEach(service => service.start());
      publishToSerial(ServiceCode.Main, 'START', _services.filter(s => s.isRunning).map(s => s.options));
      break;
    case 'STOP':
      _services.filter(s => s.options.serviceType === ServiceType.ON_DEMAND).forEach(service => service.stop());
      publishToSerial(ServiceCode.Main, 'STOP', _services.filter(s => !s.isRunning).map(s => s.options));
      break;
    case 'LIST_ALL':
      logger.info(ServiceCode.Main, 'list all services', _services.map(s => s.options));
      publishToSerial(ServiceCode.Main, 'LIST_ALL', _services.map(s => s.options));
      break;
    case 'LIST_RUN':
      logger.info(ServiceCode.Main, 'list running services', _services.filter(s => s.isRunning).map(s => s.options));
      publishToSerial(ServiceCode.Main, 'LIST_RUN', _services.filter(s => s.isRunning).map(s => s.options));
      break;
    default:
      logger.error(ServiceCode.Main, 'unknown module command', command);
      publishToSerial(ServiceCode.Main, 'ERR', `unknown module command: ${command}`);
      break;
  }
};

eventBus.on(EventType.CommandForModule, (serviceCode, command, rawData) => {
  logger.debug(ServiceCode.Main, EventType.CommandForModule, { serviceCode, command, rawData });
  dispatchModuleCommand(command);
});
})();

/******/ })()
;