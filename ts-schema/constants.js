"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gpio = exports.Hardware = exports.EventType = exports.TurnSignalCommands = exports.ServiceCommand = exports.ServiceCode = exports.Broadcasting = exports.ServiceStatus = exports.ServiceType = exports.Seperator = exports.MaxItemSize = void 0;
exports.MaxItemSize = 9999;
exports.Seperator = {
    SerialCommand: "+",
    ServiceData: "=",
};
exports.ServiceType = {
    ALWAYS_RUN: "ALWAYS_RUN",
    ON_DEMAND: "ON_DEMAND",
    ONE_TIME: "ONE_TIME",
};
exports.ServiceStatus = {
    Available: "AVAILABLE",
    Ready: "READY",
    Started: "STARTED",
    Stopped: "STOPPED",
    Error: "ERROR",
};
exports.Broadcasting = {
    ContinuousStream: "CONTINUOUS_STREAM",
    OnDemandPolling: "ON_DEMAND_POLLING",
};
exports.ServiceCode = {
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
exports.ServiceCommand = {
    START: "START",
    STOP: "STOP",
    INFO: "INFO",
    DATA: "DATA",
    SET: "SET",
};
exports.TurnSignalCommands = {
    DIAG: "DIAG",
    LEFT: "LEFT",
    RIGHT: "RIGHT",
    ALL: "ALL",
    NONE: "NONE",
};
exports.EventType = {
    CommandForModule: "MODULE_COMMAND",
    CommandForService: "SERVICE_COMMAND",
    DataFromService: "SERVICE_DATA",
    DataFromSerial: "SERIAL_DATA",
};
exports.Hardware = {
    // SERIAL_BAUD_COM: 9600,
    // SERIAL_BAUD_BT: 9600,
    MUX_SENSOR_CONNECTED_ITEMS: [0, 1, 2, 3, 4, 5, 6, 7],
    MUX_SENSOR_READ_INTERVAL: 1000,
    MUX_SENSOR_READ_BATCH_TIMEOUT: 3000,
    TURN_SIGNAL_BTN_DEBOUNCE: 200,
    TURN_SIGNAL_BLINK_RATE: 400,
    TURN_SIGNAL_BLINK_TIMEOUT: 15000,
    TURN_SIGNAL_DIAG_RATE: 100,
    TURN_SIGNAL_DIAG_COUNT: 3,
    // TURN_SIGNAL_INTERRUPT_WAIT: 100,
    // ADC_BIT_RESOLUTION: 12,
    ADC_BIT_MAX_VALUE: 4096,
    ADC_REF_MAX_VOLTAGE: 3.3,
    ADC_CONVERSION_FACTOR: 0.0008056640625,
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
exports.Gpio = {
    // functionality: GP pin,   // name - notes/wiring
    VEHICLE_SENSOR_TEMP: 30,
    VEHICLE_SENSOR_VREF: 4,
    VEHICLE_SENSOR_SPEED: 28,
    VEHICLE_SENSOR_RPM: 27,
    VEHICLE_SENSOR_BATT: 26,
    VEHICLE_SENSOR_IGN: 21,
    VEHICLE_SENSOR_AUX: 20,
    SIGNAL_IN_LEFT: 19,
    SIGNAL_IN_RIGHT: 18,
    SIGNAL_OUT_LEFT: 16,
    SIGNAL_OUT_RIGHT: 17,
    THERMO_SENSOR_CLK: 10,
    THERMO_SENSOR_DATA: 12,
    THERMO_SENSOR_CS: 13,
    MUX_OUT_A: 9,
    MUX_OUT_B: 8,
    MUX_OUT_C: 7,
    BT_SERIAL_RX: 1,
    BT_SERIAL_TX: 0, // GP0  - D_BT_TX
};
