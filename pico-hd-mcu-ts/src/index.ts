import { Logging, Pulsing } from "./logger";
import { SchemaVersion } from "../../ts-schema/schema.version";
import { ServiceType, ServiceCode, EventType } from "../../ts-schema/constants";
import { UsbDetection } from "./vbus";

const usbDetection = new UsbDetection();

usbDetection.onChange((connected) => {
  Logging.info(ServiceCode.Main, "USB connection", { connected });
});

Pulsing.up();
Logging.info(ServiceCode.Main, "HD MCU starting up...");
Logging.info(ServiceCode.Main, "schema version", SchemaVersion);

import { eventBus } from "./event-bus";
import { publishToSerial } from "./event-handler";
import { VehicleInfoService } from "./services/vehicle-info.service";
import { VehicleSensorService } from "./services/vehicle-sensor-service";
import { SystemStatsService } from "./services/system-stats-service";
import { ThermometerService } from "./services/thermometer-service";
import { TurnSignalService } from "./services/turn-signal-service";
import { ThrottleControlService } from "./services/throttle-control-service";

const services = [new VehicleInfoService(eventBus), new VehicleSensorService(eventBus), new SystemStatsService(eventBus), new ThermometerService(eventBus), new TurnSignalService(eventBus), new ThrottleControlService(eventBus)];

services.forEach((service) => {
  service.setup();
  if (service.options.serviceType === ServiceType.AlwaysRun) {
    service.start();
  }
});

Logging.info(ServiceCode.Main, "services initialized");
Pulsing.down();

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

// diag led
Logging.info(ServiceCode.Main, "pulse.diag start");
let pulsingPid = setInterval(() => {
  Pulsing.toggle();
}, 100);

setTimeout(() => {
  clearInterval(pulsingPid);
  Pulsing.down();
  Logging.info(ServiceCode.Main, "pulse.diag end");
}, 2000);

Logging.info(ServiceCode.Main, "HD MCU ready");
