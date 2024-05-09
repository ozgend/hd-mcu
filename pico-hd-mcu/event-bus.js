const { EventEmitter } = require('events');
const { UART } = require('uart');
const logger = require('./logger');
const { ServiceCode, EventType, Seperator, ServiceCommand, Hardware } = require('../ts-schema/constants');

const uartOptions = {
  baudrate: 9600,
  bits: 8,
  partity: UART.PARTIY_NONE,
  stop: 1,
  flow: UART.FLOW_NONE,
  bufferSize: 2048,
};

// const textDecoder = new TextDecoder();
const Serial = new UART(0, uartOptions);
logger.info(ServiceCode.EventBus, 'uart ready', uartOptions.baudrate);

class EventBus extends EventEmitter { }
const eventBus = new EventBus();
logger.info(ServiceCode.EventBus, 'emitter ready');

let _serialPayload = '';

Serial.on('data', (data) => {
  //logger.debug(ServiceCode.EventBus, 'serial.on.data', { raw: data, length: data.length, text: textDecoder.decode(data) });

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
