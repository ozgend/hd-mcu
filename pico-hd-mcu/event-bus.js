const textDecoder = new TextDecoder();
const { EventEmitter } = require('events');
const { UART } = require('uart');
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
      console.log(`serial_data EOL: raw:[${_serialPayload}] trim:[${_serialPayload.trim()}]`);
      eventBus.emit('serial_data', _serialPayload.trim());
      _serialPayload = '';
    }
    else if (byte !== 0) {
      _serialPayload += String.fromCharCode(byte).trim();
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
    console.log(`module_command: [${JSON.stringify(parts)}]`);
    eventBus.emit('module_command', parts[1]);
  }
  else {
    console.log(`service_command: [${JSON.stringify(parts)}]`);
    eventBus.emit('service_command', ...parts);
  }
});

console.log('serial com ready');

setInterval(() => { Serial.write('heartbeat\n') }, 2000);

const publishToSerial = (code, payload) => {
  eventBus.emit('service_data', code, payload);
};

module.exports = { eventBus, publishToSerial };