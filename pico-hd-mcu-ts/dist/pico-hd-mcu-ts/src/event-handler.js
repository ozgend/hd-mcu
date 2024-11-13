"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishToSerial = void 0;
const uart_1 = require("uart");
const utils_1 = require("./utils");
const logger_1 = require("./logger");
const constants_1 = require("../../ts-schema/constants");
const event_bus_1 = require("./event-bus");
const uartOptions = {
    baudrate: 9600,
    bits: 8,
    partity: uart_1.UART.PARTIY_NONE,
    stop: 1,
    flow: uart_1.UART.FLOW_NONE,
    bufferSize: 2048,
};
const Serial = new uart_1.UART(0, uartOptions);
logger_1.Logging.info(constants_1.ServiceCode.EventBus, "emitter ready");
setTimeout(() => {
    Serial.write(`AT+NAME${constants_1.Hardware.MCU_NAME}\n`);
    logger_1.Logging.info(constants_1.ServiceCode.EventBus, "uart setup done", `AT+NAME${constants_1.Hardware.MCU_NAME}`);
    Serial;
}, 1000);
logger_1.Logging.info(constants_1.ServiceCode.EventBus, "uart ready", uartOptions.baudrate);
let _serialPayload = "";
let fileBuffer = "";
let inFileTransferMode = false;
Serial.on("data", (data) => {
    data.forEach((byte) => {
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
const saveFileBuffer = (buffer) => {
    (0, utils_1.writeFile)(constants_1.FILE_BUNDLE, buffer);
};
// events from services
event_bus_1.eventBus.on(constants_1.EventType.DataFromService, (serviceCode, eventType, serviceData) => {
    logger_1.Logging.debug(constants_1.ServiceCode.EventBus, constants_1.EventType.DataFromService, { serviceCode, eventType, serviceData });
    Serial.write(`${serviceCode}${constants_1.Seperator.SerialCommand}${eventType}${constants_1.Seperator.ServiceData}${JSON.stringify(serviceData)}\n`);
});
// events from serial
event_bus_1.eventBus.on(constants_1.EventType.DataFromSerial, (serialPayload) => {
    logger_1.Logging.debug(constants_1.ServiceCode.EventBus, constants_1.EventType.DataFromSerial, { serialPayload });
    let parts = serialPayload.split(constants_1.Seperator.SerialCommand);
    const serviceCode = parts[0];
    let command, rawData = null;
    if (parts[1].startsWith(constants_1.ServiceCommand.SET)) {
        parts = parts[1].split(constants_1.Seperator.ServiceData);
        command = parts[0];
        rawData = parts[1];
    }
    else {
        command = parts[1];
    }
    logger_1.Logging.debug(constants_1.ServiceCode.EventBus, constants_1.EventType.DataFromSerial, { serviceCode, command, data: rawData });
    if (serialPayload.startsWith(constants_1.ServiceCode.Module)) {
        event_bus_1.eventBus.emit(constants_1.EventType.CommandForModule, serviceCode, command, rawData);
    }
    else {
        event_bus_1.eventBus.emit(constants_1.EventType.CommandForService, serviceCode, command, rawData);
    }
});
logger_1.Logging.info(constants_1.ServiceCode.EventBus, "eventBus ready");
setInterval(() => {
    Serial.write("0_heartbeat\n");
    //logger.info(ServiceCode.EventBus, '0_heartbeat');
}, constants_1.Hardware.HEARTBEAT_PUSH_INTERVAL);
const publishToSerial = (serviceCode, eventType, serviceData) => {
    event_bus_1.eventBus.emit(constants_1.EventType.DataFromService, serviceCode, eventType, serviceData);
};
exports.publishToSerial = publishToSerial;
