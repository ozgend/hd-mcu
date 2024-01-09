const Hardware = {
  SERIAL_BAUD_COM: 9600,
  SERIAL_BAUD_BT: 9600,
  // SERIAL_WRITE_AT_ONCE: true,
  // HAS_BLUETOOTH: false,
  // HAS_ONBOARD_VREF: true,
  // HAS_ONBOARD_TEMP: true,
  // HAS_TURN_SIGNAL_SERVICE: true,
  // HAS_DIRECT_SENSOR_SERVICE: false,
  // HAS_MUX_SENSOR_SERVICE: false,
  MUX_SENSOR_CONNECTED_COUNT: 4,
  TURN_SIGNAL_BTN_DEBOUNCE: 50,
  TURN_SIGNAL_BLINK_RATE: 400,
  TURN_SIGNAL_BLINK_TIMEOUT: 10000,
  TURN_SIGNAL_DIAG_RATE: 100,
  TURN_SIGNAL_DIAG_COUNT: 6,
  TURN_SIGNAL_INTERRUPT_WAIT: 100,
  ADC_BIT_RESOLUTION: 12,
  ADC_BIT_MAX_VALUE: 4096, // 1 << 12
  ADC_REF_MAX_VOLTAGE: 3.3,
  ADC_CONVERSION_FACTOR: 0.0008056640625, // 3.3 / 1 << 12
  BATTERY_VOLTAGE_R1: 43000,
  BATTERY_VOLTAGE_R2: 12000,
  BATTERY_VOLTAGE_LOSS: 0.03,
};

// for purple rpi pico
// https://electrocredible.com/raspberry-pi-pico-w-pinout-guide-diagrams/
const Gpio = {
  // functionality: GP pin,   // name - notes/wiring
  DEVICE_SENSOR_TEMP: 30,     // GP30 - ADC4 - virtual
  DEVICE_SENSOR_SPEED: 28,    // GP28 - ADC2
  DEVICE_SENSOR_RPM: 27,      // GP27 - ADC1
  DEVICE_SENSOR_BATT: 26,     // GP26 - ADC0
  DEVICE_SENSOR_IGN: 21,      // GP21 - D_IGN
  DEVICE_SENSOR_AUX: 20,      // GP20 - D_AUX
  SIGNAL_IN_LEFT: 19,         // GP19 - D_SIG_L_IN
  SIGNAL_IN_RIGHT: 18,        // GP18 - D_SIG_R_IN
  SIGNAL_OUT_LEFT: 16,        // GP16 - D_SIG_L_OUT
  SIGNAL_OUT_RIGHT: 17,       // GP17 - D_SIG_R_OUT
  THERMO_SENSOR_CLK: 10,      // GP10 - D_SCK
  THERMO_SENSOR_DATA: 12,     // GP12 - D_SO
  THERMO_SENSOR_CS: 13,       // GP13 - D_CS
  MUX_OUT_A: 9,               // GP9  - D_MUX_A
  MUX_OUT_B: 8,               // GP8  - D_MUX_B
  MUX_OUT_C: 7,               // GP7  - D_MUX_C
  BT_SERIAL_RX: 1,            // GP1  - D_BT_RX
  BT_SERIAL_TX: 0,            // GP0  - D_BT_TX
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
  MuxSensor: 'MUX',
  DirectSensor: 'DCT',
  EventBus: 'BUS',
  Main: 'MAIN',
  Heartbeat: 'BEAT',
};

const ServiceCommand = {
  START: 'START',
  STOP: 'STOP',
  DIAG: 'DIAG',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  ALL: 'ALL',
  BOTH: 'BOTH',
  NONE: 'NONE',
};

const EventName = {
  CommandForModule: 'module_command',
  CommandForService: 'service_command',
  DataFromService: 'service_data',
  DataFromSerial: 'serial_data',
  SchemaFromService: 'service_schema',
};

module.exports = { Hardware, Gpio, ServiceType, ServiceCode, ServiceCommand, EventName };