"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pulsing = exports.Logging = void 0;
const constants_1 = require("../../ts-schema/constants");
pinMode(constants_1.Gpio.ONBOARD_LED, OUTPUT);
const LEVEL_NAMES = ["DEBUG", "INFO", "ERROR"];
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["ERROR"] = 2] = "ERROR";
})(LogLevel || (LogLevel = {}));
class Logging {
    static debug(code, message, ...data) {
        this._log(LogLevel.DEBUG, code, message, data);
    }
    static info(code, message, ...data) {
        this._log(LogLevel.INFO, code, message, data);
    }
    static error(code, message, ...data) {
        this._log(LogLevel.ERROR, code, message, data);
    }
    static _log(level, code, message, ...data) {
        if (level >= this.LOG_LEVEL) {
            message = data ? `${message} ${JSON.stringify(data)}` : message;
            console.log(`${LEVEL_NAMES[level]} | [${code}] ${message}`);
        }
    }
}
exports.Logging = Logging;
Logging.LOG_LEVEL = LogLevel.DEBUG;
class Pulsing {
    static up() {
        this._state = HIGH;
        digitalWrite(constants_1.Gpio.ONBOARD_LED, HIGH);
    }
    static down() {
        this._state = LOW;
        digitalWrite(constants_1.Gpio.ONBOARD_LED, LOW);
    }
    static toggle() {
        this._state = this._state === HIGH ? LOW : HIGH;
        digitalWrite(constants_1.Gpio.ONBOARD_LED, this._state);
    }
}
exports.Pulsing = Pulsing;
Pulsing._state = HIGH;
