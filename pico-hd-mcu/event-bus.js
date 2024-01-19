const { EventEmitter } = require('events');
const { UART } = require('uart');
const logger = require('./logger');
const { ServiceCode, EventType, Seperator } = require('./constants');

const uartOptions = {
  baudrate: 9600,
  bits: 8,
  partity: UART.PARTIY_NONE,
  stop: 1,
  flow: UART.FLOW_NONE,
  bufferSize: 2048,
};

const textDecoder = new TextDecoder();
const Serial = new UART(0, uartOptions);
logger.info(ServiceCode.EventBus, 'uart ready', uartOptions.baudrate);

class EventBus extends EventEmitter { }
const eventBus = new EventBus();
logger.info(ServiceCode.EventBus, 'emitter ready');

let _serialPayload = '';

Serial.on('data', (data) => {
  logger.debug(ServiceCode.EventBus, 'serial.on.data', { raw: data, length: data.length, text: textDecoder.decode(data) });

  data.forEach((byte) => {
    if (byte === 10) {
      eventBus.emit(EventType.DataFromSerial, _serialPayload.trim());
      _serialPayload = '';
    } else if (byte !== 0) {
      _serialPayload += String.fromCharCode(byte).trim();
    }
  });
});

// events from services
eventBus.on(EventType.DataFromService, (serviceCode, eventType, serviceData) => {
  logger.debug(ServiceCode.EventBus, EventType.DataFromService, { serviceCode, eventType, serviceData });
  Serial.write(`${serviceCode}${Seperator.SerialCommand}${eventType}${Seperator.ServiceData}${JSON.stringify(serviceData)}\n`);
});

// events from serial
eventBus.on(EventType.DataFromSerial, (serialPayload) => {
  logger.debug(ServiceCode.EventBus, EventType.DataFromSerial, { serialPayload });
  const parts = serialPayload.split(Seperator.SerialCommand);

  if (serialPayload.startsWith(ServiceCode.Module)) {
    eventBus.emit(EventType.CommandForModule, parts[1]);
  } else {
    eventBus.emit(EventType.CommandForService, ...parts);
  }
});

logger.info(ServiceCode.EventBus, 'eventBus ready');

setInterval(() => {
  Serial.write('0_heartbeat\n');
  //logger.info(ServiceCode.EventBus, '0_heartbeat');
}, 5000);

const publishToSerial = (serviceCode, eventType, serviceData) => {
  eventBus.emit(EventType.DataFromService, serviceCode, eventType, serviceData);
};

module.exports = { eventBus, publishToSerial };
