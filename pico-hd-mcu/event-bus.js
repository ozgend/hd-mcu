const { EventEmitter } = require('events');
const { UART } = require('uart');
const logger = require('./logger');
const { ServiceCode, EventName } = require('./constants');

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

class EventBus extends EventEmitter { };
const eventBus = new EventBus();
logger.info(ServiceCode.EventBus, 'emitter ready');

let _serialPayload = '';

Serial.on('data', (data) => {
  logger.debug(ServiceCode.EventBus, 'serial.on.data', { raw: data, length: data.length, text: textDecoder.decode(data) });

  data.forEach((byte) => {
    if (byte === 10) {
      eventBus.emit(EventName.DataFromSerial, _serialPayload.trim());
      _serialPayload = '';
    }
    else if (byte !== 0) {
      _serialPayload += String.fromCharCode(byte).trim();
    }
  });

});

// events from services
eventBus.on(EventName.DataFromService, (serviceCode, eventName, serviceData) => {
  logger.debug(ServiceCode.EventBus, EventName.DataFromService, { serviceCode, eventName, serviceData });
  Serial.write(`${serviceCode}.${eventName}=${JSON.stringify(serviceData)}\n`);
});

// events from serial
eventBus.on(EventName.DataFromSerial, (serialPayload) => {
  logger.debug(ServiceCode.EventBus, EventName.DataFromSerial, { serialPayload });
  const parts = serialPayload.split('=');

  if (serialPayload.startsWith('MODULE')) {
    eventBus.emit(EventName.CommandForModule, parts[1]);
  }
  else {
    eventBus.emit(EventName.CommandForService, ...parts);
  }
});

logger.info(ServiceCode.EventBus, 'eventBus ready');

setInterval(() => {
  Serial.write('0_heartbeat\n');
  //logger.info(ServiceCode.EventBus, '0_heartbeat');
}, 1000);

const publishToSerial = (serviceCode, eventName, serviceData) => {
  eventBus.emit(EventName.DataFromService, serviceCode, eventName, serviceData);
};

module.exports = { eventBus, publishToSerial };