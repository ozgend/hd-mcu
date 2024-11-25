/* eslint-disable @typescript-eslint/no-explicit-any */

import { UART, UARTOptionsC } from "uart";
import { writeFile } from "./utils";
import { Logging } from "./logger";
import { ServiceCode, EventType, Seperator, ServiceCommand, Hardware, FILE_BUNDLE } from "../../ts-schema/constants";
import { eventBus } from "./event-bus";

const uartOptions: UARTOptionsC = {
  baudrate: 9600,
  bits: 8,
  partity: UART.PARTIY_NONE,
  stop: 1,
  flow: UART.FLOW_NONE,
  bufferSize: 2048,
};

const Serial = new UART(0, uartOptions);
Logging.info(ServiceCode.EventBus, "emitter ready");

setTimeout(() => {
  Serial.write(`AT+NAME${Hardware.MCU_NAME}\n`);
  Logging.info(ServiceCode.EventBus, "uart setup done", `AT+NAME${Hardware.MCU_NAME}`);
  Serial;
}, 1000);

Logging.info(ServiceCode.EventBus, "uart ready", uartOptions.baudrate);

let _serialPayload = "";
let fileBuffer = "";
let inFileTransferMode = false;

Serial.on("data", (data: number[]) => {
  data.forEach((byte: number) => {
    // Detect start and end markers for file transfer mode
    if (!inFileTransferMode && _serialPayload.includes("<START>")) {
      inFileTransferMode = true;
      fileBuffer = ""; // Reset file buffer for new transfer
      _serialPayload = "";
      return;
    } else if (inFileTransferMode && _serialPayload.includes("<END>")) {
      inFileTransferMode = false;
      saveFileBuffer(fileBuffer);
      fileBuffer = "";
      _serialPayload = "";
      return;
    }

    // Regular handling for commands and file data
    if (byte === 10) {
      // Newline byte
      if (!inFileTransferMode) {
        // Command mode: handle command payload
        if (_serialPayload.includes("OK")) {
          Logging.debug(ServiceCode.EventBus, "SERIAL_PAYLOAD", _serialPayload);
        } else {
          eventBus.emit(EventType.DataFromSerial, _serialPayload.trim());
        }
      } else {
        // File transfer mode: append payload to file buffer
        fileBuffer += _serialPayload;
      }
      _serialPayload = ""; // Reset payload after processing
    } else if (byte !== 0) {
      _serialPayload += String.fromCharCode(byte).trim(); // Append byte to payload
    }
  });
});

const saveFileBuffer = (buffer: string) => {
  writeFile(FILE_BUNDLE, buffer);
};

// events from services
eventBus.on(EventType.DataFromService, (serviceCode: string, eventType: string, serviceData: any) => {
  Logging.debug(ServiceCode.EventBus, EventType.DataFromService, { serviceCode, eventType, serviceData });
  Serial.write(`${serviceCode}${Seperator.SerialCommand}${eventType}${Seperator.ServiceData}${JSON.stringify(serviceData)}\n`);
});

// events from serial
eventBus.on(EventType.DataFromSerial, (serialPayload: string) => {
  Logging.debug(ServiceCode.EventBus, EventType.DataFromSerial, { serialPayload });
  let parts = serialPayload.split(Seperator.SerialCommand);
  const serviceCode = parts[0];
  let command: string,
    rawData: string | null = null;

  if (parts[1].startsWith(ServiceCommand.SET)) {
    parts = parts[1].split(Seperator.ServiceData);
    command = parts[0];
    rawData = parts[1];
  } else {
    command = parts[1];
  }

  Logging.debug(ServiceCode.EventBus, EventType.DataFromSerial, { serviceCode, command, data: rawData });

  if (serialPayload.startsWith(ServiceCode.Module)) {
    eventBus.emit(EventType.CommandForModule, serviceCode, command, rawData);
  } else {
    eventBus.emit(EventType.CommandForService, serviceCode, command, rawData);
  }
});

Logging.info(ServiceCode.EventBus, "eventBus ready");

setInterval(() => {
  Serial.write("0_heartbeat\n");
  //logger.info(ServiceCode.EventBus, '0_heartbeat');
}, Hardware.HEARTBEAT_PUSH_INTERVAL);

const publishToSerial = (serviceCode: string, eventType: string, serviceData: any) => {
  eventBus.emit(EventType.DataFromService, serviceCode, eventType, serviceData);
};

export { publishToSerial };
