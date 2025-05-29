const { EventEmitter } = require('events');
const { UART } = require('uart');
const { writeFile } = require('./utils');
const logger = require('./logger');
const { ServiceCode, EventType, Seperator, ServiceCommand, Hardware, FILE_BUNDLE } = require('../../ts-schema/constants');

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
  logger.info(ServiceCode.EventBus, 'uart setup done', `AT+NAME${Hardware.MCU_NAME}2`);
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
