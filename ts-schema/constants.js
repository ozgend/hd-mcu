"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventType = exports.TurnSignalCommands = exports.ServiceCommand = exports.ServiceCode = exports.Broadcasting = exports.ServiceStatus = exports.ServiceType = exports.Seperator = exports.MaxItemSize = void 0;
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
