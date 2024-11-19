/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 830:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/* eslint-disable @typescript-eslint/no-explicit-any */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BaseService = void 0;
var logger_1 = __webpack_require__(377);
var constants_1 = __webpack_require__(303);
var schema_version_1 = __webpack_require__(169);
var BaseService = /** @class */ (function () {
    function BaseService(eventBus, options) {
        var _this = this;
        var _a, _b, _c;
        this.options = {
            serviceCode: options.serviceCode,
            serviceType: options.serviceType,
            updateInterval: (_a = options.updateInterval) !== null && _a !== void 0 ? _a : 1000 * 5,
            idleTimeout: (_b = options.idleTimeout) !== null && _b !== void 0 ? _b : 1000 * 120,
            broadcastMode: (_c = options.broadcastMode) !== null && _c !== void 0 ? _c : constants_1.BroadcastMode.OnDemandPolling,
            commands: options.commands && options.commands.length > 0 ? __spreadArray(__spreadArray([], Object.values(constants_1.ServiceCommand), true), options.commands, true) : Object.values(constants_1.ServiceCommand),
        };
        this.eventBus = eventBus !== null && eventBus !== void 0 ? eventBus : { emit: function () { }, on: function () { } };
        this.status = constants_1.ServiceStatus.Initialized;
        this.broadcastPid = null;
        this.isRunning = false;
        this.data = {};
        this.eventBus.on(constants_1.EventType.CommandForService, function (code, command, raw) {
            if (code === _this.options.serviceCode) {
                _this.handleCommand(command, raw);
            }
        });
    }
    BaseService.prototype.handleCommand = function (command, raw) {
        logger_1.Logging.debug(this.options.serviceCode, constants_1.EventType.CommandForService, command, raw);
        switch (command) {
            case constants_1.ServiceCommand.START:
                this.start();
                break;
            case constants_1.ServiceCommand.STOP:
                this.stop();
                break;
            case constants_1.ServiceCommand.INFO:
                this.publishInformation();
                break;
            case constants_1.ServiceCommand.DATA:
                this.publishData();
                break;
            case constants_1.ServiceCommand.SET:
                this.peristSettings(raw);
                break;
            default:
                break;
        }
    };
    BaseService.prototype.isStarted = function () {
        return this.status === constants_1.ServiceStatus.Started;
    };
    BaseService.prototype.setup = function () {
        logger_1.Logging.info(this.options.serviceCode, "setup");
        this.status = constants_1.ServiceStatus.Available;
    };
    BaseService.prototype.start = function () {
        var _this = this;
        if (this.isStarted()) {
            logger_1.Logging.info(this.options.serviceCode, "already running");
            return;
        }
        logger_1.Logging.info(this.options.serviceCode, "starting");
        this.isRunning = true;
        if (this.options.broadcastMode === constants_1.BroadcastMode.ContinuousStream) {
            this.broadcastPid = setInterval(function () {
                _this.publishData();
            }, this.options.updateInterval || 1000 * 5);
        }
        logger_1.Logging.info(this.options.serviceCode, "started.");
        if (this.options.broadcastMode === constants_1.BroadcastMode.ContinuousStream) {
            setTimeout(function () {
                _this.stop();
            }, this.options.idleTimeout || 1000 * 120);
        }
        this.status = constants_1.ServiceStatus.Started;
        this.publishInformation();
    };
    BaseService.prototype.stop = function () {
        if (!this.isRunning) {
            logger_1.Logging.info(this.options.serviceCode, "already stopped");
            return;
        }
        logger_1.Logging.info(this.options.serviceCode, "stopping");
        if (this.broadcastPid) {
            clearInterval(this.broadcastPid);
        }
        this.isRunning = false;
        this.broadcastPid = null;
        logger_1.Logging.info(this.options.serviceCode, "stopped.");
        this.status = constants_1.ServiceStatus.Stopped;
        this.publishInformation();
    };
    BaseService.prototype.getInfo = function () {
        return __assign({ schemaVersion: schema_version_1.SchemaVersion, status: this.status, isRunning: this.isRunning }, this.options);
    };
    BaseService.prototype.peristSettings = function (data) {
        logger_1.Logging.debug(this.options.serviceCode, constants_1.ServiceCommand.SET, data);
    };
    BaseService.prototype.publishData = function () {
        logger_1.Logging.debug(this.options.serviceCode, constants_1.ServiceCommand.DATA);
        this.eventBus.emit(constants_1.EventType.DataFromService, this.options.serviceCode, constants_1.ServiceCommand.DATA, this.data);
    };
    BaseService.prototype.publishInformation = function () {
        logger_1.Logging.debug(this.options.serviceCode, constants_1.ServiceCommand.INFO, this.isRunning);
        this.eventBus.emit(constants_1.EventType.DataFromService, this.options.serviceCode, constants_1.ServiceCommand.INFO, this.getInfo());
    };
    return BaseService;
}());
exports.BaseService = BaseService;


/***/ }),

/***/ 698:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/* eslint-disable @typescript-eslint/no-explicit-any */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.eventBus = exports.EventBus = void 0;
var events_1 = __webpack_require__(261);
var EventBus = /** @class */ (function (_super) {
    __extends(EventBus, _super);
    function EventBus() {
        return _super.call(this) || this;
    }
    EventBus.prototype.on = function (event, listener) {
        _super.prototype.on.call(this, event, listener);
    };
    EventBus.prototype.emit = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        _super.prototype.emit.apply(this, __spreadArray([event], args, false));
    };
    return EventBus;
}(events_1.EventEmitter));
exports.EventBus = EventBus;
exports.eventBus = new EventBus();


/***/ }),

/***/ 668:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.publishToSerial = void 0;
var uart_1 = __webpack_require__(8);
var utils_1 = __webpack_require__(552);
var logger_1 = __webpack_require__(377);
var constants_1 = __webpack_require__(303);
var event_bus_1 = __webpack_require__(698);
var uartOptions = {
    baudrate: 9600,
    bits: 8,
    partity: uart_1.UART.PARTIY_NONE,
    stop: 1,
    flow: uart_1.UART.FLOW_NONE,
    bufferSize: 2048,
};
var Serial = new uart_1.UART(0, uartOptions);
logger_1.Logging.info(constants_1.ServiceCode.EventBus, "emitter ready");
setTimeout(function () {
    Serial.write("AT+NAME".concat(constants_1.Hardware.MCU_NAME, "\n"));
    logger_1.Logging.info(constants_1.ServiceCode.EventBus, "uart setup done", "AT+NAME".concat(constants_1.Hardware.MCU_NAME));
    Serial;
}, 1000);
logger_1.Logging.info(constants_1.ServiceCode.EventBus, "uart ready", uartOptions.baudrate);
var _serialPayload = "";
var fileBuffer = "";
var inFileTransferMode = false;
Serial.on("data", function (data) {
    data.forEach(function (byte) {
        // Detect start and end markers for file transfer mode
        if (!inFileTransferMode && _serialPayload.includes("<START>")) {
            inFileTransferMode = true;
            fileBuffer = ""; // Reset file buffer for new transfer
            _serialPayload = "";
            return;
        }
        else if (inFileTransferMode && _serialPayload.includes("<END>")) {
            inFileTransferMode = false;
            saveFileBuffer(fileBuffer);
            fileBuffer = "";
            _serialPayload = "";
            return;
        }
        // Regular handling for commands and file data
        if (byte === 10) {
            // Newline byte
            if (!inFileTransferMode) {
                // Command mode: handle command payload
                if (_serialPayload.includes("OK")) {
                    logger_1.Logging.debug(constants_1.ServiceCode.EventBus, "SERIAL_PAYLOAD", _serialPayload);
                }
                else {
                    event_bus_1.eventBus.emit(constants_1.EventType.DataFromSerial, _serialPayload.trim());
                }
            }
            else {
                // File transfer mode: append payload to file buffer
                fileBuffer += _serialPayload;
            }
            _serialPayload = ""; // Reset payload after processing
        }
        else if (byte !== 0) {
            _serialPayload += String.fromCharCode(byte).trim(); // Append byte to payload
        }
    });
});
var saveFileBuffer = function (buffer) {
    (0, utils_1.writeFile)(constants_1.FILE_BUNDLE, buffer);
};
// events from services
event_bus_1.eventBus.on(constants_1.EventType.DataFromService, function (serviceCode, eventType, serviceData) {
    logger_1.Logging.debug(constants_1.ServiceCode.EventBus, constants_1.EventType.DataFromService, { serviceCode: serviceCode, eventType: eventType, serviceData: serviceData });
    Serial.write("".concat(serviceCode).concat(constants_1.Seperator.SerialCommand).concat(eventType).concat(constants_1.Seperator.ServiceData).concat(JSON.stringify(serviceData), "\n"));
});
// events from serial
event_bus_1.eventBus.on(constants_1.EventType.DataFromSerial, function (serialPayload) {
    logger_1.Logging.debug(constants_1.ServiceCode.EventBus, constants_1.EventType.DataFromSerial, { serialPayload: serialPayload });
    var parts = serialPayload.split(constants_1.Seperator.SerialCommand);
    var serviceCode = parts[0];
    var command, rawData = null;
    if (parts[1].startsWith(constants_1.ServiceCommand.SET)) {
        parts = parts[1].split(constants_1.Seperator.ServiceData);
        command = parts[0];
        rawData = parts[1];
    }
    else {
        command = parts[1];
    }
    logger_1.Logging.debug(constants_1.ServiceCode.EventBus, constants_1.EventType.DataFromSerial, { serviceCode: serviceCode, command: command, data: rawData });
    if (serialPayload.startsWith(constants_1.ServiceCode.Module)) {
        event_bus_1.eventBus.emit(constants_1.EventType.CommandForModule, serviceCode, command, rawData);
    }
    else {
        event_bus_1.eventBus.emit(constants_1.EventType.CommandForService, serviceCode, command, rawData);
    }
});
logger_1.Logging.info(constants_1.ServiceCode.EventBus, "eventBus ready");
setInterval(function () {
    Serial.write("0_heartbeat\n");
    //logger.info(ServiceCode.EventBus, '0_heartbeat');
}, constants_1.Hardware.HEARTBEAT_PUSH_INTERVAL);
var publishToSerial = function (serviceCode, eventType, serviceData) {
    event_bus_1.eventBus.emit(constants_1.EventType.DataFromService, serviceCode, eventType, serviceData);
};
exports.publishToSerial = publishToSerial;


/***/ }),

/***/ 70:
/***/ ((__unused_webpack_module, exports) => {


/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HC4051 = void 0;
var MUX_CHANNEL_SIZE = 8;
// C B A - channel
var MUX_CHANNEL_SELECT = [
    [LOW, LOW, LOW], // ch 0
    [LOW, LOW, HIGH], // ch 1
    [LOW, HIGH, LOW], // ch 2
    [LOW, HIGH, HIGH], // ch 3
    [HIGH, LOW, LOW], // ch 4
    [HIGH, LOW, HIGH], // ch 5
    [HIGH, HIGH, LOW], // ch 6
    [HIGH, HIGH, HIGH], // ch 7
];
var HC4051 = /** @class */ (function () {
    function HC4051(options) {
        this.pinData = options.pinData;
        this.pinA = options.pinA;
        this.pinB = options.pinB;
        this.pinC = options.pinC;
        this.pinInhibit = options.pinInhibit;
        this.connectedChannels = options.connectedChannels || [0, 1, 2, 3, 4, 5, 6, 7];
        this.connectedChannelSize = options.connectedChannels ? options.connectedChannels.length : options.connectedChannelSize || MUX_CHANNEL_SIZE;
    }
    HC4051.prototype.init = function () {
        pinMode(this.pinA, OUTPUT);
        pinMode(this.pinB, OUTPUT);
        pinMode(this.pinC, OUTPUT);
        if (this.pinData !== undefined) {
            pinMode(this.pinData, INPUT);
        }
        if (this.pinInhibit !== undefined) {
            pinMode(this.pinInhibit, OUTPUT);
        }
        this.enableChannelIndex(0);
    };
    HC4051.prototype.enableChannel = function (channel) {
        if (this.connectedChannels.indexOf(channel) < 0) {
            console.error("HC4051: channel not connected: ".concat(channel, " (connected: ").concat(this.connectedChannels, ")"));
            return false;
        }
        return this.enableChannelIndex(this.connectedChannels.indexOf(channel));
    };
    HC4051.prototype.enableChannelIndex = function (chIndex) {
        if (chIndex >= MUX_CHANNEL_SIZE) {
            console.error("HC4051: channel out of range: ".concat(chIndex, " (max: ").concat(MUX_CHANNEL_SIZE - 1, ")"));
            return false;
        }
        if (this.pinInhibit !== undefined) {
            digitalWrite(this.pinInhibit, LOW);
        }
        digitalWrite(this.pinC, MUX_CHANNEL_SELECT[chIndex][0]);
        digitalWrite(this.pinB, MUX_CHANNEL_SELECT[chIndex][1]);
        digitalWrite(this.pinA, MUX_CHANNEL_SELECT[chIndex][2]);
        return true;
    };
    HC4051.prototype.disableAll = function () {
        if (this.pinInhibit !== undefined) {
            digitalWrite(this.pinInhibit, HIGH);
        }
    };
    return HC4051;
}());
exports.HC4051 = HC4051;


/***/ }),

/***/ 854:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


// refs
// https://github.com/zhenek-kreker/MAX6675/blob/master/MAX6675.cpp
// https://github.com/adafruit/MAX6675-library/blob/master/max6675.cpp
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MAX6675 = void 0;
var gpio_1 = __webpack_require__(291);
var spi_1 = __webpack_require__(98);
var MAX6675_BPS = 2 * 1000 * 1000;
var MAX6675_OPEN_BIT = 0x4;
var MAX6675_CONVERSION_RATIO = 0.25;
var MAX6675_READER_CMD = [0, 0, 0, 0];
var MAX6675 = /** @class */ (function () {
    function MAX6675(options) {
        this.cs = options.cs || 13;
        this.bus = options.bus || 1;
        this.spiBus = null;
        this.spiCs = null;
        this.spiOptions = {
            mode: options.mode || spi_1.SPI.MODE_1,
            baudrate: options.baudrate || MAX6675_BPS,
            bitorder: options.bitorder || spi_1.SPI.MSB,
            sck: options.sck || 10,
            clk: options.sck || 10,
            miso: options.miso || 12,
            mosi: -1,
        };
    }
    MAX6675.prototype.init = function () {
        try {
            this.spiBus = new spi_1.SPI(this.bus, this.spiOptions);
            this.spiCs = new gpio_1.GPIO(this.cs, OUTPUT);
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
    };
    MAX6675.prototype.close = function () {
        if (this.spiBus) {
            console.log("MAX6675: close");
            this.spiBus.close();
        }
    };
    MAX6675.prototype.readCelcius = function () {
        var bytes = this.readRaw();
        if (bytes & MAX6675_OPEN_BIT) {
            console.error("MAX6675: no thermocouple attached!");
            return null;
        }
        var value = (bytes >> 3) * MAX6675_CONVERSION_RATIO;
        return value;
    };
    MAX6675.prototype.readFahrenheit = function () {
        var celsius = this.readCelcius();
        if (celsius === null) {
            return null;
        }
        return celsius * 1.8 + 32;
    };
    MAX6675.prototype.readRaw = function () {
        if (this.spiCs) {
            this.spiCs.low();
            var value = this.readRaw2();
            this.spiCs.high();
            return value;
        }
        console.error("SPICS is not initialized");
        return 0;
    };
    MAX6675.prototype.readRaw1 = function () {
        try {
            this.spiBus.send(new Uint8Array(MAX6675_READER_CMD));
            var bytes = this.spiBus.recv(16);
            if (bytes === null) {
                console.error("MAX6675: recv error");
            }
            return bytes;
        }
        catch (err) {
            console.error(err);
        }
        return new Uint8Array();
    };
    MAX6675.prototype.readRaw2 = function () {
        try {
            var raw = this.spiBus.transfer(new Uint8Array([0])) << 8;
            raw |= this.spiBus.transfer(new Uint8Array([0]));
            return raw;
        }
        catch (err) {
            console.error(err);
        }
        return 0;
    };
    return MAX6675;
}());
exports.MAX6675 = MAX6675;


/***/ }),

/***/ 377:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Pulsing = exports.Logging = void 0;
var constants_1 = __webpack_require__(303);
pinMode(constants_1.Gpio.ONBOARD_LED, OUTPUT);
var LEVEL_NAMES = ["DEBUG", "INFO", "ERROR"];
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["ERROR"] = 2] = "ERROR";
})(LogLevel || (LogLevel = {}));
var Logging = /** @class */ (function () {
    function Logging() {
    }
    Logging.debug = function (code, message, data) {
        this._log(LogLevel.DEBUG, code, message, data);
    };
    Logging.info = function (code, message, data) {
        this._log(LogLevel.INFO, code, message, data);
    };
    Logging.error = function (code, message, data) {
        this._log(LogLevel.ERROR, code, message, data);
    };
    Logging._log = function (level, code, message, data) {
        if (level >= this.LOG_LEVEL) {
            message = data ? "".concat(message, " ").concat(JSON.stringify(data)) : message;
            console.log("".concat(LEVEL_NAMES[level], " | [").concat(code, "] ").concat(message));
        }
    };
    Logging.LOG_LEVEL = LogLevel.DEBUG;
    return Logging;
}());
exports.Logging = Logging;
var Pulsing = /** @class */ (function () {
    function Pulsing() {
    }
    Pulsing.up = function () {
        this._state = HIGH;
        digitalWrite(constants_1.Gpio.ONBOARD_LED, HIGH);
    };
    Pulsing.down = function () {
        this._state = LOW;
        digitalWrite(constants_1.Gpio.ONBOARD_LED, LOW);
    };
    Pulsing.toggle = function () {
        this._state = this._state === HIGH ? LOW : HIGH;
        digitalWrite(constants_1.Gpio.ONBOARD_LED, this._state);
    };
    Pulsing._state = HIGH;
    return Pulsing;
}());
exports.Pulsing = Pulsing;


/***/ }),

/***/ 685:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/* eslint-disable @typescript-eslint/no-explicit-any */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SystemStatsService = void 0;
var base_service_1 = __webpack_require__(830);
var data_model_1 = __webpack_require__(355);
var constants_1 = __webpack_require__(303);
var SystemStatsService = /** @class */ (function (_super) {
    __extends(SystemStatsService, _super);
    function SystemStatsService(eventBus) {
        var _this = _super.call(this, eventBus, {
            serviceCode: constants_1.ServiceCode.SystemStats,
            serviceType: constants_1.ServiceType.OnDemand,
            broadcastMode: constants_1.BroadcastMode.OnDemandPolling,
        }) || this;
        _this.data = new data_model_1.SystemStatsData();
        return _this;
    }
    SystemStatsService.prototype.setup = function () {
        _super.prototype.setup.call(this);
        this.data.arch = process.arch;
        this.data.platform = process.platform;
        this.data.version = process.version;
        this.data.name = board.name;
        this.data.uid = board.uid;
    };
    SystemStatsService.prototype.publishData = function () {
        var mem = process.memoryUsage();
        this.data.heapTotal = mem.heapTotal;
        this.data.heapUsed = mem.heapUsed;
        this.data.heapPeak = mem.heapPeak;
        _super.prototype.publishData.call(this);
    };
    return SystemStatsService;
}(base_service_1.BaseService));
exports.SystemStatsService = SystemStatsService;


/***/ }),

/***/ 128:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ThermometerService = void 0;
var max6675_hw_spi_1 = __webpack_require__(854);
var hc4051_1 = __webpack_require__(70);
var logger_1 = __webpack_require__(377);
var base_service_1 = __webpack_require__(830);
var data_model_1 = __webpack_require__(355);
var constants_1 = __webpack_require__(303);
var _muxChannels = constants_1.Hardware.MUX_SENSOR_CONNECTED_ITEMS;
var _readerPid = null;
var _muxChIndex = 0;
var ThermometerService = /** @class */ (function (_super) {
    __extends(ThermometerService, _super);
    function ThermometerService(eventBus) {
        var _this = _super.call(this, eventBus, {
            serviceCode: constants_1.ServiceCode.Thermometer,
            serviceType: constants_1.ServiceType.OnDemand,
            broadcastMode: constants_1.BroadcastMode.OnDemandPolling,
        }) || this;
        _this.data = new data_model_1.ThermometerData();
        return _this;
    }
    ThermometerService.prototype.start = function () {
        var _this = this;
        _super.prototype.start.call(this);
        _super.prototype.publishData.call(this);
        _muxChannels.forEach(function (ch) {
            _this.data["ch_".concat(ch)] = 0;
        });
        this.thermoSensor = new max6675_hw_spi_1.MAX6675({ bus: 1, cs: constants_1.Gpio.THERMO_SENSOR_CS, sck: constants_1.Gpio.THERMO_SENSOR_CLK, miso: constants_1.Gpio.THERMO_SENSOR_DATA });
        this.thermoSensor.init();
        this.mux = new hc4051_1.HC4051({ pinA: constants_1.Gpio.MUX_OUT_A, pinB: constants_1.Gpio.MUX_OUT_B, pinC: constants_1.Gpio.MUX_OUT_C, connectedChannels: _muxChannels });
        this.mux.init();
        // start delayed read
        setTimeout(function () {
            _readerPid = setInterval(function () {
                var _a;
                if (_this.mux && _this.thermoSensor) {
                    _this.mux.enableChannelIndex(_muxChIndex);
                    _this.data["ch_".concat(_muxChannels[_muxChIndex])] = (_a = _this.thermoSensor.readCelcius()) !== null && _a !== void 0 ? _a : 0;
                    logger_1.Logging.debug(constants_1.ServiceCode.Thermometer, "interval.read", { ch: _muxChannels[_muxChIndex], cx: _muxChIndex, value: _this.data["ch_".concat(_muxChannels[_muxChIndex])], values: _this.data });
                    _muxChIndex++;
                    if (_muxChIndex >= _muxChannels.length) {
                        _muxChIndex = 0;
                    }
                }
            }, constants_1.Hardware.MUX_SENSOR_READ_INTERVAL);
        }, constants_1.Hardware.MUX_SENSOR_READ_BATCH_TIMEOUT);
    };
    ThermometerService.prototype.stop = function () {
        _super.prototype.stop.call(this);
        if (_readerPid) {
            clearInterval(_readerPid);
            _readerPid = null;
        }
        _muxChIndex = 0;
        if (this.thermoSensor) {
            this.thermoSensor.close();
            delete this.thermoSensor;
            delete this.mux;
        }
    };
    ThermometerService.prototype.publishData = function () {
        _super.prototype.publishData.call(this);
    };
    return ThermometerService;
}(base_service_1.BaseService));
exports.ThermometerService = ThermometerService;


/***/ }),

/***/ 306:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TurnSignalService = void 0;
var utils_1 = __webpack_require__(552);
var logger_1 = __webpack_require__(377);
var button_1 = __webpack_require__(584);
var constants_1 = __webpack_require__(303);
var base_service_1 = __webpack_require__(830);
var data_model_1 = __webpack_require__(355);
var defaultTsmConfig = {
    blinkRate: constants_1.Hardware.TURN_SIGNAL_BLINK_RATE,
    blinkTimeout: constants_1.Hardware.TURN_SIGNAL_BLINK_TIMEOUT,
    btnDebounce: constants_1.Hardware.TURN_SIGNAL_BTN_DEBOUNCE,
    diagCount: constants_1.Hardware.TURN_SIGNAL_DIAG_COUNT,
    diagRate: constants_1.Hardware.TURN_SIGNAL_DIAG_RATE,
};
var tsmConfig = (_a = (0, utils_1.readObject)(constants_1.FILE_TSM_CONFIG)) !== null && _a !== void 0 ? _a : data_model_1.TsmSettings.default(defaultTsmConfig);
var _action = {
    left: false,
    right: false,
};
var _state = {
    left: false,
    right: false,
};
var _flasherPid = 0;
var _cancelerPid = 0;
var _diagCounter = 0;
var _diagnostic = function () {
    logger_1.Logging.debug(constants_1.ServiceCode.TurnSignalModule, "diagnostic", { _state: _state, _action: _action });
    logger_1.Pulsing.down();
    _disableFlasher("diag-start");
    _flasherPid = setInterval(function () {
        if (_diagCounter > tsmConfig.diagCount * 2) {
            _disableFlasher("diag-complete [" + _diagCounter + "] cycles");
            _diagCounter = 0;
            return;
        }
        _state.left = !_state.left;
        _state.right = !_state.right;
        digitalToggle(constants_1.Gpio.SIGNAL_OUT_LEFT);
        digitalToggle(constants_1.Gpio.SIGNAL_OUT_RIGHT);
        _diagCounter++;
        logger_1.Pulsing.toggle();
        logger_1.Logging.debug(constants_1.ServiceCode.TurnSignalModule, "diagnostic", { _state: _state, _diagCounter: _diagCounter });
    }, tsmConfig.diagRate);
};
var _enableFlasher = function (isLeft, isRight, blinkRate, cancelTimeout, doNotCancel) {
    logger_1.Logging.debug(constants_1.ServiceCode.TurnSignalModule, "enableFlasher", { isLeft: isLeft, isRight: isRight });
    if (doNotCancel) {
        _cancelerPid = 0;
        logger_1.Logging.debug(constants_1.ServiceCode.TurnSignalModule, "will not cancel", { isLeft: isLeft, isRight: isRight });
    }
    else {
        logger_1.Logging.debug(constants_1.ServiceCode.TurnSignalModule, "will auto-cancel", { isLeft: isLeft, isRight: isRight });
        _cancelerPid = setTimeout(function () {
            _disableFlasher("timeout");
            _action.left = false;
            _action.right = false;
        }, cancelTimeout);
    }
    _flasherPid = setInterval(function () {
        if (isLeft) {
            digitalToggle(constants_1.Gpio.SIGNAL_OUT_LEFT);
            _state.left = !_state.left;
        }
        if (isRight) {
            digitalToggle(constants_1.Gpio.SIGNAL_OUT_RIGHT);
            _state.right = !_state.right;
        }
        logger_1.Pulsing.toggle();
        logger_1.Logging.debug(constants_1.ServiceCode.TurnSignalModule, "state", _state);
    }, blinkRate);
};
var _disableFlasher = function (reason) {
    clearInterval(_flasherPid);
    clearTimeout(_cancelerPid);
    digitalWrite(constants_1.Gpio.SIGNAL_OUT_LEFT, LOW);
    digitalWrite(constants_1.Gpio.SIGNAL_OUT_RIGHT, LOW);
    _flasherPid = 0;
    _cancelerPid = 0;
    _state.left = false;
    _state.right = false;
    _diagCounter = 0;
    logger_1.Logging.debug(constants_1.ServiceCode.TurnSignalModule, "disableFlasher", { reason: reason });
    logger_1.Pulsing.up();
};
var _setFlasher = function (isLeft, isRight) {
    logger_1.Logging.debug(constants_1.ServiceCode.TurnSignalModule, "setFlasher", { isLeft: isLeft, isRight: isRight });
    logger_1.Pulsing.down();
    _disableFlasher("cancel-any");
    if (isLeft || isRight) {
        _enableFlasher(isLeft, isRight, tsmConfig.blinkRate, tsmConfig.blinkTimeout, isLeft && isRight);
    }
};
var _checkAction = function (btnLeft, btnRight) {
    var _readLeft = btnLeft.read();
    var _readRight = btnRight.read();
    logger_1.Logging.debug(constants_1.ServiceCode.TurnSignalModule, "checkAction.left-current ".concat(_action.left, ", read: ").concat(_readLeft));
    logger_1.Logging.debug(constants_1.ServiceCode.TurnSignalModule, "checkAction.right-current ".concat(_action.right, ", read: ").concat(_readRight));
    // hazard lights check
    // if (_readLeft === HIGH && _readRight === HIGH) {
    // }
    if (_readLeft === HIGH) {
        _action.left = !_action.left;
        logger_1.Logging.debug(constants_1.ServiceCode.TurnSignalModule, "checkAction.left-HIGH ".concat(_action.left));
    }
    else {
        _action.left = false;
        // logger.debug(ServiceCode.TurnSignalModule, `checkAction.left-LOW ${_action.left}`);
    }
    if (_readRight === HIGH) {
        _action.right = !_action.right;
        logger_1.Logging.debug(constants_1.ServiceCode.TurnSignalModule, "checkAction.right-HIGH ".concat(_action.right));
    }
    else {
        _action.right = false;
        // logger.debug(ServiceCode.TurnSignalModule, `checkAction.right-LOW ${_action.right}`);
    }
    _setFlasher(_action.left, _action.right);
};
var TurnSignalService = /** @class */ (function (_super) {
    __extends(TurnSignalService, _super);
    function TurnSignalService(eventBus) {
        return _super.call(this, eventBus, {
            serviceCode: constants_1.ServiceCode.TurnSignalModule,
            serviceType: constants_1.ServiceType.OnDemand,
            broadcastMode: constants_1.BroadcastMode.OnDemandPolling,
            commands: Object.values(constants_1.TurnSignalCommands),
        }) || this;
    }
    TurnSignalService.prototype.setup = function () {
        var _this = this;
        _super.prototype.setup.call(this);
        pinMode(constants_1.Gpio.SIGNAL_IN_LEFT, INPUT_PULLUP);
        pinMode(constants_1.Gpio.SIGNAL_IN_RIGHT, INPUT_PULLUP);
        pinMode(constants_1.Gpio.SIGNAL_OUT_LEFT, OUTPUT);
        pinMode(constants_1.Gpio.SIGNAL_OUT_RIGHT, OUTPUT);
        _diagnostic();
        this.leftButton = new button_1.Button(constants_1.Gpio.SIGNAL_IN_LEFT, { mode: INPUT, event: RISING, debounce: tsmConfig.btnDebounce });
        this.rightButton = new button_1.Button(constants_1.Gpio.SIGNAL_IN_RIGHT, { mode: INPUT, event: RISING, debounce: tsmConfig.btnDebounce });
        this.leftButton.on("click", function () {
            _checkAction(_this.leftButton, _this.rightButton);
        });
        this.rightButton.on("click", function () {
            _checkAction(_this.leftButton, _this.rightButton);
        });
    };
    TurnSignalService.prototype.handleCommand = function (command) {
        _super.prototype.handleCommand.call(this, command);
        if (command === constants_1.TurnSignalCommands.DIAG) {
            _diagnostic();
        }
        else {
            switch (command) {
                case constants_1.TurnSignalCommands.ALL:
                    _action.left = true;
                    _action.right = true;
                    break;
                case constants_1.TurnSignalCommands.LEFT:
                    _action.left = !_action.left;
                    _action.right = false;
                    break;
                case constants_1.TurnSignalCommands.RIGHT:
                    _action.left = false;
                    _action.right = !_action.right;
                    break;
                case constants_1.TurnSignalCommands.NONE:
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
    };
    TurnSignalService.prototype.publishData = function () {
        this.data.state = _state;
        this.data.action = _action;
        _super.prototype.publishData.call(this);
    };
    return TurnSignalService;
}(base_service_1.BaseService));
exports.TurnSignalService = TurnSignalService;


/***/ }),

/***/ 126:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VehicleInfoService = void 0;
var utils_1 = __webpack_require__(552);
var constants_1 = __webpack_require__(303);
var data_model_1 = __webpack_require__(355);
var base_service_1 = __webpack_require__(830);
var logger_1 = __webpack_require__(377);
var VehicleInfoService = /** @class */ (function (_super) {
    __extends(VehicleInfoService, _super);
    function VehicleInfoService(eventBus) {
        var _this = _super.call(this, eventBus, {
            serviceCode: constants_1.ServiceCode.VehicleInfo,
            serviceType: constants_1.ServiceType.OnDemand,
            broadcastMode: constants_1.BroadcastMode.OnDemandPolling,
        }) || this;
        _this.data = new data_model_1.VehicleInfoData();
        return _this;
    }
    VehicleInfoService.prototype.peristSettings = function (raw) {
        _super.prototype.peristSettings.call(this, raw);
        this.setVehicleInfo(JSON.parse(raw));
    };
    VehicleInfoService.prototype.setVehicleInfo = function (payload) {
        if (payload) {
            logger_1.Logging.debug(constants_1.ServiceCode.VehicleInfo, "setVehicleInfo payload:", payload);
        }
        else {
            logger_1.Logging.debug(constants_1.ServiceCode.VehicleInfo, "setVehicleInfo payload: null");
        }
        var currentVehicleInfo = this.getVehicleInfo();
        var newVehicleInfo = payload ? Object.assign(currentVehicleInfo, payload) : currentVehicleInfo;
        logger_1.Logging.debug(constants_1.ServiceCode.VehicleInfo, "setVehicleInfo newVehicleInfo:", newVehicleInfo);
        (0, utils_1.writeObject)(constants_1.FILE_VHI_DATA, newVehicleInfo);
    };
    VehicleInfoService.prototype.getVehicleInfo = function () {
        if ((0, utils_1.isFileExist)(constants_1.FILE_VHI_DATA)) {
            var vehicleInfo = (0, utils_1.readFile)(constants_1.FILE_VHI_DATA);
            logger_1.Logging.debug(constants_1.ServiceCode.VehicleInfo, "getVehicleInfo vehicleInfo:", vehicleInfo);
            return JSON.parse(vehicleInfo);
        }
        return new data_model_1.VehicleInfoData();
    };
    VehicleInfoService.prototype.setup = function () {
        if (!(0, utils_1.isFileExist)(constants_1.FILE_VHI_DATA)) {
            logger_1.Logging.debug(constants_1.ServiceCode.VehicleInfo, "setup vehicleInfoFile:", constants_1.FILE_VHI_DATA);
            this.setVehicleInfo(new data_model_1.VehicleInfoData());
        }
        else {
            logger_1.Logging.debug(constants_1.ServiceCode.VehicleInfo, "setup vehicleInfoFile exists:", constants_1.FILE_VHI_DATA);
        }
        _super.prototype.setup.call(this);
    };
    VehicleInfoService.prototype.publishData = function () {
        this.data = this.getVehicleInfo();
        _super.prototype.publishData.call(this);
    };
    return VehicleInfoService;
}(base_service_1.BaseService));
exports.VehicleInfoService = VehicleInfoService;


/***/ }),

/***/ 703:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VehicleSensorService = void 0;
var base_service_1 = __webpack_require__(830);
var constants_1 = __webpack_require__(303);
var data_model_1 = __webpack_require__(355);
var BATTERY_VOLTAGE_SCALING_FACTOR = (constants_1.Hardware.BATTERY_VOLTAGE_R1 + constants_1.Hardware.BATTERY_VOLTAGE_R2) / constants_1.Hardware.BATTERY_VOLTAGE_R2;
var VehicleSensorService = /** @class */ (function (_super) {
    __extends(VehicleSensorService, _super);
    function VehicleSensorService(eventBus) {
        var _this = _super.call(this, eventBus, {
            serviceCode: constants_1.ServiceCode.VehicleSensor,
            serviceType: constants_1.ServiceType.OnDemand,
            broadcastMode: constants_1.BroadcastMode.OnDemandPolling,
        }) || this;
        _this.rpmSignalCounter = 0;
        _this.rpmSignalLastTime = 0;
        _this.data = new data_model_1.VehicleSensorData();
        return _this;
    }
    VehicleSensorService.prototype.start = function () {
        _super.prototype.start.call(this);
        attachInterrupt(constants_1.Gpio.VEHICLE_SENSOR_RPM, this.interruptRpmHandler.bind(this), RISING);
    };
    VehicleSensorService.prototype.stop = function () {
        _super.prototype.stop.call(this);
        detachInterrupt(constants_1.Gpio.VEHICLE_SENSOR_RPM);
    };
    VehicleSensorService.prototype.interruptRpmHandler = function () {
        this.rpmSignalCounter++;
        console.log("rpm signal counter", this.rpmSignalCounter);
    };
    VehicleSensorService.prototype.calculateRpm = function () {
        this.data.rpm = -1;
        var currentTime = millis();
        var deltaTime = currentTime - this.rpmSignalLastTime;
        if (deltaTime > 0) {
            this.data.rpm = (this.rpmSignalCounter / deltaTime) * 1000 * 60;
        }
        this.rpmSignalCounter = 0;
        this.rpmSignalLastTime = currentTime;
    };
    VehicleSensorService.prototype.calculateSpeed = function () {
        this.data.speed = -1;
    };
    VehicleSensorService.prototype.calculateTpmsData = function () {
        this.data.tireFront = -1;
        this.data.tireRear = -1;
        this.data.tempFront = -1;
        this.data.tempRear = -1;
    };
    VehicleSensorService.prototype.calculateTemperature = function () {
        var raw_temp = analogRead(constants_1.Gpio.VEHICLE_SENSOR_TEMP);
        var raw_temp_volts = raw_temp * constants_1.Hardware.ADC_REF_MAX_VOLTAGE;
        this.data.temp = constants_1.Hardware.TEMPERATURE_OFFSET - (raw_temp_volts - constants_1.Hardware.ADC_OFFSET_VOLTAGE) / constants_1.Hardware.TEMPERATURE_SCALING_FACTOR;
    };
    VehicleSensorService.prototype.calculateVref = function () {
        var raw_vref = analogRead(constants_1.Gpio.VEHICLE_SENSOR_VREF);
        this.data.vref = raw_vref * constants_1.Hardware.ADC_SCALING_FACTOR;
    };
    VehicleSensorService.prototype.calculateBattery = function () {
        var raw_batt = analogRead(constants_1.Gpio.VEHICLE_SENSOR_BATT);
        this.data.batt = raw_batt * constants_1.Hardware.ADC_REF_MAX_VOLTAGE * BATTERY_VOLTAGE_SCALING_FACTOR;
    };
    VehicleSensorService.prototype.setup = function () {
        _super.prototype.setup.call(this);
        pinMode(constants_1.Gpio.VEHICLE_SENSOR_BATT, INPUT);
        pinMode(constants_1.Gpio.VEHICLE_SENSOR_AUX, INPUT);
        pinMode(constants_1.Gpio.VEHICLE_SENSOR_RPM, INPUT);
        pinMode(constants_1.Gpio.VEHICLE_SENSOR_SPEED, INPUT);
        pinMode(constants_1.Gpio.VEHICLE_SENSOR_IGN, INPUT);
    };
    VehicleSensorService.prototype.publishData = function () {
        this.data.uptime = millis();
        this.calculateTemperature();
        this.calculateVref();
        this.calculateBattery();
        this.calculateRpm();
        this.calculateSpeed();
        this.calculateTpmsData();
        _super.prototype.publishData.call(this);
    };
    return VehicleSensorService;
}(base_service_1.BaseService));
exports.VehicleSensorService = VehicleSensorService;


/***/ }),

/***/ 552:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/* eslint-disable @typescript-eslint/no-explicit-any */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.scaler = exports.readObject = exports.writeObject = exports.readFile = exports.writeFile = exports.isFileExist = void 0;
var fs_1 = __webpack_require__(383);
var textEncoder = new TextEncoder();
var textDecoder = new TextDecoder();
var isFileExist = function (filepath) {
    return fs_1.default === null || fs_1.default === void 0 ? void 0 : fs_1.default.exists(filepath);
};
exports.isFileExist = isFileExist;
var writeFile = function (filepath, unencodedString) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fs_1.default.writeFile(filepath, textEncoder.encode(unencodedString))];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.writeFile = writeFile;
var readFile = function (filepath) {
    if (!(0, exports.isFileExist)(filepath)) {
        return null;
    }
    var raw = fs_1.default.readFile(filepath);
    return textDecoder.decode(raw);
};
exports.readFile = readFile;
var writeObject = function (filepath, data) {
    (0, exports.writeFile)(filepath, JSON.stringify(data));
};
exports.writeObject = writeObject;
var readObject = function (filepath) {
    var raw = (0, exports.readFile)(filepath);
    return raw ? JSON.parse(raw) : null;
};
exports.readObject = readObject;
var scaler = function (rangeFrom, rangeTo) {
    var d = (rangeTo[1] - rangeTo[0]) / (rangeFrom[1] - rangeFrom[0]);
    return function (value) { return (value - rangeFrom[0]) * d + rangeTo[0]; };
};
exports.scaler = scaler;


/***/ }),

/***/ 303:
/***/ ((__unused_webpack_module, exports) => {


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

/***/ 355:
/***/ ((__unused_webpack_module, exports) => {


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
        this.serviceKm = 0;
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

/***/ 169:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SchemaVersion = void 0;
exports.SchemaVersion = "2024-11-18T20:56:23";


/***/ }),

/***/ 584:
/***/ ((module) => {

module.exports = require("button");

/***/ }),

/***/ 261:
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ 383:
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ 291:
/***/ ((module) => {

module.exports = require("gpio");

/***/ }),

/***/ 98:
/***/ ((module) => {

module.exports = require("spi");

/***/ }),

/***/ 8:
/***/ ((module) => {

module.exports = require("uart");

/***/ })

/******/ 	});
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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it uses a non-standard name for the exports (exports).
(() => {
var exports = __webpack_exports__;
var __webpack_unused_export__;

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
__webpack_unused_export__ = ({ value: true });
var logger_1 = __webpack_require__(377);
var event_bus_1 = __webpack_require__(698);
var event_handler_1 = __webpack_require__(668);
var schema_version_1 = __webpack_require__(169);
var constants_1 = __webpack_require__(303);
var turn_signal_service_1 = __webpack_require__(306);
var system_stats_service_1 = __webpack_require__(685);
var vehicle_sensor_service_1 = __webpack_require__(703);
var thermometer_service_1 = __webpack_require__(128);
var vehicle_info_service_1 = __webpack_require__(126);
logger_1.Pulsing.up();
logger_1.Logging.info(constants_1.ServiceCode.Main, "schema version", schema_version_1.SchemaVersion);
var services = [new vehicle_info_service_1.VehicleInfoService(event_bus_1.eventBus), new vehicle_sensor_service_1.VehicleSensorService(event_bus_1.eventBus), new system_stats_service_1.SystemStatsService(event_bus_1.eventBus), new thermometer_service_1.ThermometerService(event_bus_1.eventBus), new turn_signal_service_1.TurnSignalService(event_bus_1.eventBus)];
services.forEach(function (service) {
    service.setup();
    if (service.options.serviceType === constants_1.ServiceType.AlwaysRun) {
        service.start();
    }
});
var dispatchModuleCommand = function (command) {
    switch (command) {
        case "DIAG":
            logger_1.Logging.info(constants_1.ServiceCode.Main, "diagnostic event");
            (0, event_handler_1.publishToSerial)(constants_1.ServiceCode.Main, "DIAG", "diagnostic event");
            break;
        case "START":
            services.filter(function (s) { return s.options.serviceType === constants_1.ServiceType.OnDemand; }).forEach(function (service) { return service.start(); });
            (0, event_handler_1.publishToSerial)(constants_1.ServiceCode.Main, "START", services.filter(function (s) { return s.isRunning; }).map(function (s) { return s.options; }));
            break;
        case "STOP":
            services.filter(function (s) { return s.options.serviceType === constants_1.ServiceType.OnDemand; }).forEach(function (service) { return service.stop(); });
            (0, event_handler_1.publishToSerial)(constants_1.ServiceCode.Main, "STOP", services.filter(function (s) { return !s.isRunning; }).map(function (s) { return s.options; }));
            break;
        case "LIST_ALL":
            logger_1.Logging.info(constants_1.ServiceCode.Main, "list all services", services.map(function (s) { return s.options; }));
            (0, event_handler_1.publishToSerial)(constants_1.ServiceCode.Main, "LIST_ALL", services.map(function (s) { return s.options; }));
            break;
        case "LIST_RUN":
            logger_1.Logging.info(constants_1.ServiceCode.Main, "list running services", services.filter(function (s) { return s.isRunning; }).map(function (s) { return s.options; }));
            (0, event_handler_1.publishToSerial)(constants_1.ServiceCode.Main, "LIST_RUN", services.filter(function (s) { return s.isRunning; }).map(function (s) { return s.options; }));
            break;
        default:
            logger_1.Logging.error(constants_1.ServiceCode.Main, "unknown module command", command);
            (0, event_handler_1.publishToSerial)(constants_1.ServiceCode.Main, "ERR", "unknown module command: ".concat(command));
            break;
    }
};
event_bus_1.eventBus.on(constants_1.EventType.CommandForModule, function (serviceCode, command, rawData) {
    logger_1.Logging.debug(constants_1.ServiceCode.Main, constants_1.EventType.CommandForModule, { serviceCode: serviceCode, command: command, rawData: rawData });
    dispatchModuleCommand(command);
});

})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map