"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
const rtc_1 = require("rtc");
const logger_1 = require("./logger");
const event_bus_1 = require("./event-bus");
const event_handler_1 = require("./event-handler");
const schema_version_1 = require("../../ts-schema/schema.version");
const constants_1 = require("../../ts-schema/constants");
const turn_signal_service_1 = require("./services/turn-signal-service");
const system_stats_service_1 = require("./services/system-stats-service");
const vehicle_sensor_service_1 = require("./services/vehicle-sensor-service");
const thermometer_service_1 = require("./services/thermometer-service");
const vehicle_info_service_1 = require("./services/vehicle-info.service");
rtc_1.default.setTime(-2209078556000);
logger_1.Pulsing.up();
logger_1.Logging.info(constants_1.ServiceCode.Main, "schema version", schema_version_1.SchemaVersion);
const services = [new vehicle_info_service_1.VehicleInfoService(event_bus_1.eventBus), new vehicle_sensor_service_1.VehicleSensorService(event_bus_1.eventBus), new system_stats_service_1.SystemStatsService(event_bus_1.eventBus), new thermometer_service_1.ThermometerService(event_bus_1.eventBus), new turn_signal_service_1.TurnSignalService(event_bus_1.eventBus)];
services.forEach((service) => {
    service.setup();
    if (service.options.serviceType === constants_1.ServiceType.AlwaysRun) {
        service.start();
    }
});
const dispatchModuleCommand = (command) => {
    switch (command) {
        case "DIAG":
            logger_1.Logging.info(constants_1.ServiceCode.Main, "diagnostic event");
            (0, event_handler_1.publishToSerial)(constants_1.ServiceCode.Main, "DIAG", "diagnostic event");
            break;
        case "START":
            services.filter((s) => s.options.serviceType === constants_1.ServiceType.OnDemand).forEach((service) => service.start());
            (0, event_handler_1.publishToSerial)(constants_1.ServiceCode.Main, "START", services.filter((s) => s.isRunning).map((s) => s.options));
            break;
        case "STOP":
            services.filter((s) => s.options.serviceType === constants_1.ServiceType.OnDemand).forEach((service) => service.stop());
            (0, event_handler_1.publishToSerial)(constants_1.ServiceCode.Main, "STOP", services.filter((s) => !s.isRunning).map((s) => s.options));
            break;
        case "LIST_ALL":
            logger_1.Logging.info(constants_1.ServiceCode.Main, "list all services", services.map((s) => s.options));
            (0, event_handler_1.publishToSerial)(constants_1.ServiceCode.Main, "LIST_ALL", services.map((s) => s.options));
            break;
        case "LIST_RUN":
            logger_1.Logging.info(constants_1.ServiceCode.Main, "list running services", services.filter((s) => s.isRunning).map((s) => s.options));
            (0, event_handler_1.publishToSerial)(constants_1.ServiceCode.Main, "LIST_RUN", services.filter((s) => s.isRunning).map((s) => s.options));
            break;
        default:
            logger_1.Logging.error(constants_1.ServiceCode.Main, "unknown module command", command);
            (0, event_handler_1.publishToSerial)(constants_1.ServiceCode.Main, "ERR", `unknown module command: ${command}`);
            break;
    }
};
event_bus_1.eventBus.on(constants_1.EventType.CommandForModule, (serviceCode, command, rawData) => {
    logger_1.Logging.debug(constants_1.ServiceCode.Main, constants_1.EventType.CommandForModule, { serviceCode, command, rawData });
    dispatchModuleCommand(command);
});
