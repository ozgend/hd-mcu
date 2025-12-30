export const MaxItemSize = 9999;

export const FILE_TSM_CONFIG = "data.tsm-config.json";
export const FILE_VHI_DATA = "data.vehicle-info.json";
export const FILE_TCM_CONFIG = "data.tcm-config.json";
export const FILE_BUNDLE = "bundle.js";

export const Seperator = {
  SerialCommand: "+",
  ServiceData: "=",
};

export enum ServiceType {
  AlwaysRun = "ALWAYS_RUN",
  OnDemand = "ON_DEMAND",
  OneTime = "ONE_TIME",
}

export enum ServiceStatus {
  Initialized = "INITIALIZED",
  Available = "AVAILABLE",
  Ready = "READY",
  Started = "STARTED",
  Stopped = "STOPPED",
  Error = "ERROR",
}

export enum BroadcastMode {
  ContinuousStream = "CONTINUOUS_STREAM",
  OnDemandPolling = "ON_DEMAND_POLLING",
}

export const ServiceCode = {
  SystemStats: "SYS",
  VehicleSensor: "VHC",
  VehicleInfo: "VHI",
  Thermometer: "THE",
  TurnSignalModule: "TSM",
  IgnitionModule: "IGN",
  ThrottleControl: "TCM",
  Module: "M0",
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
  MCU_NAME: "HDMCU",
  // SERIAL_BAUD_COM: 9600,
  // SERIAL_BAUD_BT: 9600,
  MUX_SENSOR_CONNECTED_ITEMS: [0, 1, 2, 3, 4, 5, 6, 7],
  MUX_SENSOR_READ_INTERVAL: 1000,
  MUX_SENSOR_READ_BATCH_TIMEOUT: 3000,
  TURN_SIGNAL_BTN_DEBOUNCE: 100,
  TURN_SIGNAL_BLINK_RATE: 400,
  TURN_SIGNAL_BLINK_TIMEOUT: 20000,
  TURN_SIGNAL_DIAG_RATE: 250,
  TURN_SIGNAL_DIAG_TIMEOUT: 2000,
  TURN_SIGNAL_DIAG_COUNT: 3,
  // TURN_SIGNAL_INTERRUPT_WAIT: 100,
  ADC_BIT_MAX_VALUE: 4095, // 1 << 12
  ADC_REF_MAX_VOLTAGE: 3.3,
  ADC_SCALING_FACTOR: 6.95,
  // ADC_CONVERSION_FACTOR: 0.0008056640625, // 3.3 / 1 << 12
  ADC_OFFSET_VOLTAGE: 0.706,
  TEMPERATURE_SCALING_FACTOR: 0.001721,
  TEMPERATURE_OFFSET: 27,
  BATTERY_VOLTAGE_R1: 33000,
  BATTERY_VOLTAGE_R2: 7500,
  // BATTERY_VOLTAGE_LOSS: 0.01,
  // BATTERY_VOLTAGE_MIN: 11.0,
  // BATTERY_VOLTAGE_MAX: 15.0,
  SERVICE_POLL_INTERVAL: 5000,
  HEARTBEAT_PUSH_INTERVAL: 5000,
  VBUS_DETECT_INTERVAL: 1500,
  ANALOG_READ_RESOLUTION_BITS: 12,

  // throttle control
  THROTTLE_CHANGE_THRESHOLD: 3,
  THROTTLE_OFFSET: 52 * 2, // 26 for 10-bit, 104 for 12-bit
  THROTTLE_ADC_MIN: 1024 + 100, // (1 << (ANALOG_READ_RESOLUTION_BITS - 2)) + THROTTLE_OFFSET
  THROTTLE_ADC_MAX: 4095, // (1 << ANALOG_READ_RESOLUTION_BITS) - 1
  THROTTLE_SAMPLING_COUNT: 5,
  THROTTLE_SAMPLING_INTERVAL_MS: 4,
  THROTTLE_SERVO_SPEED: 10,
  THROTTLE_SERVO_ANGLE_MIN: 0,
  THROTTLE_SERVO_ANGLE_MAX: 100,
};

// hardware voltage simulation
// https://www.tinkercad.com/things/irP9OkxQxpl-brilliant-leelo/

// for standard rpi pico
// https://pico.pinout.xyz/
// https://electrocredible.com/raspberry-pi-pico-w-pinout-guide-diagrams/
export const Gpio = {
  // functionality: GP pin,   // name - notes/wiring
  VBUS: 24, // GP24 - VBUS - USB power detection
  ONBOARD_LED: 25, // GP25 - LED
  VEHICLE_SENSOR_TEMP: 30, // GP30 - ADC4 - virtual
  VEHICLE_SENSOR_VREF: 29, // GP29 - ADC3 - internal voltage reference
  THROTTLE_SENSOR_AUX: 28, // GP28 - ADC2 -  secondary Hall Sensor
  THROTTLE_SENSOR_MAIN: 27, // GP27 - ADC1 - primary Hall Sensor
  VEHICLE_SENSOR_BATT: 26, // GP26 - ADC0 - battery voltage input
  THROTTLE_SERVO_PWM: 15, // GP15 - PWM_SERVO - throttle servo pwm output
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
  VEHICLE_SENSOR_IGN: 5, // GP5  - D_IGN_SENSOR - TBD - pulse input from ignition module
  VEHICLE_SENSOR_SPEED: 4, // GP4 - D_SPEED_SENSOR - TBD - pulse input from speed sensor
  VEHICLE_SENSOR_RPM: 3, // GP3 - D_RPM_SENSOR - TBD - pulse input from rpm sensor
  BT_SERIAL_RX: 1, // GP1  - D_BT_RX
  BT_SERIAL_TX: 0, // GP0  - D_BT_TX
};
