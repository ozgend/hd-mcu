/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { Logging, Pulsing } from "./logger";
import { eventBus } from "./event-bus";
import { publishToSerial } from "./event-handler";
import { SchemaVersion } from "../../ts-schema/schema.version";
import { ServiceType, ServiceCode, EventType } from "../../ts-schema/constants";
import { TurnSignalService } from "./services/turn-signal-service";
import { SystemStatsService } from "./services/system-stats-service";
import { VehicleSensorService } from "./services/vehicle-sensor-service";
import { ThermometerService } from "./services/thermometer-service";
import { VehicleInfoService } from "./services/vehicle-info.service";

Pulsing.up();
Logging.info(ServiceCode.Main, "schema version", SchemaVersion);

const services = [new VehicleInfoService(eventBus), new VehicleSensorService(eventBus), new SystemStatsService(eventBus), new ThermometerService(eventBus), new TurnSignalService(eventBus)];

services.forEach((service) => {
  service.setup();
  if (service.options.serviceType === ServiceType.AlwaysRun) {
    service.start();
  }
});

const dispatchModuleCommand = (command: string): void => {
  switch (command) {
    case "DIAG":
      Logging.info(ServiceCode.Main, "diagnostic event");
      publishToSerial(ServiceCode.Main, "DIAG", "diagnostic event");
      break;
    case "START":
      services.filter((s) => s.options.serviceType === ServiceType.OnDemand).forEach((service) => service.start());
      publishToSerial(
        ServiceCode.Main,
        "START",
        services.filter((s) => s.isRunning).map((s) => s.options)
      );
      break;
    case "STOP":
      services.filter((s) => s.options.serviceType === ServiceType.OnDemand).forEach((service) => service.stop());
      publishToSerial(
        ServiceCode.Main,
        "STOP",
        services.filter((s) => !s.isRunning).map((s) => s.options)
      );
      break;
    case "LIST_ALL":
      Logging.info(
        ServiceCode.Main,
        "list all services",
        services.map((s) => s.options)
      );
      publishToSerial(
        ServiceCode.Main,
        "LIST_ALL",
        services.map((s) => s.options)
      );
      break;
    case "LIST_RUN":
      Logging.info(
        ServiceCode.Main,
        "list running services",
        services.filter((s) => s.isRunning).map((s) => s.options)
      );
      publishToSerial(
        ServiceCode.Main,
        "LIST_RUN",
        services.filter((s) => s.isRunning).map((s) => s.options)
      );
      break;
    default:
      Logging.error(ServiceCode.Main, "unknown module command", command);
      publishToSerial(ServiceCode.Main, "ERR", `unknown module command: ${command}`);
      break;
  }
};

eventBus.on(EventType.CommandForModule, (serviceCode: string, command: string, rawData: any) => {
  Logging.debug(ServiceCode.Main, EventType.CommandForModule, { serviceCode, command, rawData });
  dispatchModuleCommand(command);
});
