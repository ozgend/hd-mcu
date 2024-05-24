export const MaxItemSize = 9999;

export const Seperator = {
  SerialCommand: "+",
  ServiceData: "=",
};

export const ServiceType = {
  ALWAYS_RUN: "ALWAYS_RUN",
  ON_DEMAND: "ON_DEMAND",
  ONE_TIME: "ONE_TIME",
};

export const ServiceStatus = {
  Available: "AVAILABLE",
  Ready: "READY",
  Started: "STARTED",
  Stopped: "STOPPED",
  Error: "ERROR",
};

export const Broadcasting = {
  ContinuousStream: "CONTINUOUS_STREAM",
  OnDemandPolling: "ON_DEMAND_POLLING",
};

export const ServiceCode = {
  SystemStats: "SYS",
  VehicleSensor: "VHC",
  VehicleInfo: "VHI",
  Thermometer: "THE",
  TurnSignalModule: "TSM",
  Module: "MODULE",
  EventBus: "BUS",
  Main: "MAIN",
  Heartbeat: "BEAT",
};

export const ServiceCommand = {
  START: "START",
  STOP: "STOP",
  INFO: "INFO",
  DATA: "DATA",
  SET: "SET",
};

export const TurnSignalCommands = {
  DIAG: "DIAG",
  LEFT: "LEFT",
  RIGHT: "RIGHT",
  ALL: "ALL",
  NONE: "NONE",
};

export const EventType = {
  CommandForModule: "MODULE_COMMAND",
  CommandForService: "SERVICE_COMMAND",
  DataFromService: "SERVICE_DATA",
  DataFromSerial: "SERIAL_DATA",
};

export const Hardware = {
  // SERIAL_BAUD_COM: 9600,
  // SERIAL_BAUD_BT: 9600,
  MUX_SENSOR_CONNECTED_ITEMS: [0, 1, 2, 3, 4, 5, 6, 7],
  MUX_SENSOR_READ_INTERVAL: 1000,
  MUX_SENSOR_READ_BATCH_TIMEOUT: 3000,
  TURN_SIGNAL_BTN_DEBOUNCE: 200,
  TURN_SIGNAL_BLINK_RATE: 400,
  TURN_SIGNAL_BLINK_TIMEOUT: 15000,
  TURN_SIGNAL_DIAG_RATE: 300,
  TURN_SIGNAL_DIAG_COUNT: 3,
  // TURN_SIGNAL_INTERRUPT_WAIT: 100,
  // ADC_BIT_RESOLUTION: 12,
  ADC_BIT_MAX_VALUE: 4096, // 1 << 12
  ADC_REF_MAX_VOLTAGE: 3.3,
  ADC_CONVERSION_FACTOR: 0.0008056640625, // 3.3 / 1 << 12
  BATTERY_VOLTAGE_R1: 33000,
  BATTERY_VOLTAGE_R2: 7500,
  // BATTERY_VOLTAGE_LOSS: 0.01,
  // BATTERY_VOLTAGE_MIN: 11.0,
  // BATTERY_VOLTAGE_MAX: 15.0,
  SERVICE_POLL_INTERVAL: 5000,
  HEARTBEAT_PUSH_INTERVAL: 5000,
};

// hardware voltage simulation
// https://www.tinkercad.com/things/irP9OkxQxpl-brilliant-leelo/

// for standard rpi pico
// https://pico.pinout.xyz/
// https://electrocredible.com/raspberry-pi-pico-w-pinout-guide-diagrams/
export const Gpio = {
  // functionality: GP pin,   // name - notes/wiring
  VEHICLE_SENSOR_TEMP: 30, // GP30 - ADC4 - virtual
  VEHICLE_SENSOR_SPEED: 28, // GP28 - ADC2
  VEHICLE_SENSOR_RPM: 27, // GP27 - ADC1
  VEHICLE_SENSOR_BATT: 26, // GP26 - ADC0
  VEHICLE_SENSOR_IGN: 21, // GP21 - D_IGN
  VEHICLE_SENSOR_AUX: 20, // GP20 - D_AUX
  SIGNAL_IN_LEFT: 19, // GP19 - D_SIG_L_IN
  SIGNAL_IN_RIGHT: 18, // GP18 - D_SIG_R_IN
  SIGNAL_OUT_LEFT: 16, // GP16 - D_SIG_L_OUT
  SIGNAL_OUT_RIGHT: 17, // GP17 - D_SIG_R_OUT
  THERMO_SENSOR_CLK: 10, // GP10 - D_SCK
  THERMO_SENSOR_DATA: 12, // GP12 - D_SO
  THERMO_SENSOR_CS: 13, // GP13 - D_CS
  MUX_OUT_A: 9, // GP9  - D_MUX_A
  MUX_OUT_B: 8, // GP8  - D_MUX_B
  MUX_OUT_C: 7, // GP7  - D_MUX_C
  BT_SERIAL_RX: 1, // GP1  - D_BT_RX
  BT_SERIAL_TX: 0, // GP0  - D_BT_TX
};
