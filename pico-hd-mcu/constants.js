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
  TURN_SIGNAL_BLINK_TIMEOUT: 30000,
  TURN_SUGNAL_ANALOGUE_VALUE_THRESHOLD : 800,
};

// https://electrocredible.com/raspberry-pi-pico-w-pinout-guide-diagrams/
const Gpio = {
  BT_SERIAL_TX: 0,
  BT_SERIAL_RX: 1,
  SIGNAL_OUT_LEFT: 14,
  SIGNAL_OUT_RIGHT: 15,
  SIGNAL_IN_RIGHT: 20,
  SIGNAL_IN_LEFT: 21,
  DIRECT_SENSOR_VOLTAGE: 16,
  DIRECT_SENSOR_RPM: 17,
  DIRECT_SENSOR_SPEED: 18,
  MUX_OUT_A: 9,
  MUX_OUT_B: 8,
  MUX_OUT_C: 7,
  MUX_SENSOR_CLK: 6,
  MUX_SENSOR_CS: 5,
  MUX_SENSOR_DATA: 4,
  ADC0: 26,
  ADC1: 27,
  ADC2: 28,
  ADC_VREF: 35,
  ADC_TEMP: 4, 
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
  ALL: 'ALL'
};

module.exports = { Hardware, Gpio, ServiceType, ServiceCode, ServiceCommand };