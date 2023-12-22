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
  TURN_SIGNAL_BLINK_TIMEOUT: 10000,
  TURN_SIGNAL_INTERRUPT_WAIT: 100,
};

// https://electrocredible.com/raspberry-pi-pico-w-pinout-guide-diagrams/
const Gpio = {
  // functionality: pin,      // ## - name - notes
  DEVICE_SENSOR_TEMP: 30,     // 35 - GP30 - ADC4 - virtual
  ADC2: 28,                   // 34 - GP28 - ADC2
  ADC1: 27,                   // 32 - GP27 - ADC1
  DEVICE_SENSOR_VREF: 26,     // 31 - GP26 - ADC0
  SIGNAL_IN_LEFT: 21,         // 27 - GP21
  SIGNAL_IN_RIGHT: 20,        // 26 - GP20
  SIGNAL_OUT_LEFT: 19,        // 25 - GP19  
  SIGNAL_OUT_RIGHT: 18,       // 24 - GP18
  MUX_SENSOR_CS: 13,          // 17 - GP13
  MUX_SENSOR_DATA: 12,        // 16 - GP12
  MUX_SENSOR_CLK: 11,         // 15 - GP11
  MUX_OUT_A: 9,               // 12 - GP9
  MUX_OUT_B: 8,               // 11 - GP8
  MUX_OUT_C: 7,               // 10 - GP7
  BT_SERIAL_RX: 1,            // 2 - GP1
  BT_SERIAL_TX: 0,            // 1 - GP0
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
  ALL: 'ALL',
  NONE: 'NONE',
};

module.exports = { Hardware, Gpio, ServiceType, ServiceCode, ServiceCommand };