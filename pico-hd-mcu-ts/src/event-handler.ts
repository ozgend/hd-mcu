import { UART, UARTOptionsC } from "uart";
import { readObject, writeFile, writeObject } from "./utils";
import { Logging } from "./logger";
import { ServiceCode, EventType, Seperator, ServiceCommand, Hardware, FILE_BUNDLE, FILE_BT_UART } from "../../ts-schema/constants";
import { eventBus } from "./event-bus";

let uartOptions: UARTOptionsC = readObject(FILE_BT_UART);

if (!uartOptions) {
  Logging.debug(ServiceCode.EventBus, "BT UART config not found, creating default config");
  uartOptions = {
    baudrate: 9600, // Initial starting point
    bits: 8,
    partity: UART.PARTIY_NONE,
    stop: 1,
    flow: UART.FLOW_NONE,
    bufferSize: 2048,
  };
  writeObject(FILE_BT_UART, uartOptions);
}

Logging.debug(ServiceCode.EventBus, "BT UART config loaded", uartOptions);

let isConfigured = false;
let heartbeatMuted = false;
let _serialPayload = "";
let fileBuffer = "";
let inFileTransferMode = false;
let pidPayloadFlush = null;

// --- Execution ---
Logging.info(ServiceCode.EventBus, "BT UART init...");
const Serial = new UART(1, uartOptions);

// --- Data Handler ---
Serial.on("data", (data: number[]) => {
  var s = String.fromCharCode.apply(null, data);
  print(s);

  // if (pidPayloadFlush !== null) {
  //   clearTimeout(pidPayloadFlush);
  //   pidPayloadFlush = null;
  // }

  data.forEach((byte: number) => {
    if (byte === 0) return;

    if (byte === 10) {
      flushPayload();
    } else {
      _serialPayload += String.fromCharCode(byte);
    }

    // Start Marker Logic
    if (!inFileTransferMode && _serialPayload.endsWith("<START>")) {
      heartbeatMuted = true; // Stop heartbeats during file transfer
      inFileTransferMode = true;
      fileBuffer = "";
      _serialPayload = "";
      Logging.info(ServiceCode.EventBus, "Transfer Started: Heartbeat Muted");
    }
    // End Marker Logic
    else if (inFileTransferMode && _serialPayload.endsWith("<END>")) {
      inFileTransferMode = false;
      saveFileBuffer(fileBuffer.replace("<END>", ""));
      fileBuffer = "";
      _serialPayload = "";
      Logging.info(ServiceCode.EventBus, "Transfer Complete: Heartbeat Resumed");
      heartbeatMuted = false; // Resume heartbeats
    }
  });

  // pidPayloadFlush = setTimeout(flushPayload, 100);
});

Serial.write("AT");
Logging.debug(ServiceCode.EventBus, "BT UART ** waiting for OK");

Serial.write(`AT+NAME${Hardware.MCU_NAME}`);
Logging.info(ServiceCode.EventBus, `Name set to ${Hardware.MCU_NAME}`);

Serial.write("AT+BAUD6"); // HC-06 Index 6 = 38400
Logging.info(ServiceCode.EventBus, "Baud set to 38400");

isConfigured = true;

const flushPayload = () => {
  if (_serialPayload.length > 0) {
    if (inFileTransferMode) {
      fileBuffer += _serialPayload;
    } else {
      if (_serialPayload.includes("OK")) {
        Logging.debug(ServiceCode.EventBus, "AT_RESPONSE", _serialPayload);
      } else {
        eventBus.emit(EventType.DataFromSerial, _serialPayload.trim());
      }
    }
    _serialPayload = "";
  }
  if (pidPayloadFlush) {
    clearTimeout(pidPayloadFlush);
    pidPayloadFlush = null;
  }
};

const saveFileBuffer = (buffer: string) => {
  writeFile(FILE_BUNDLE, buffer);
};

// --- Event Bus Handlers ---

// Sending to BT
eventBus.on(EventType.DataFromService, (serviceCode: string, eventType: string, serviceData: any) => {
  if (!isConfigured) return;
  Logging.debug(ServiceCode.EventBus, EventType.DataFromService, { serviceCode, eventType });
  Serial.write(`${serviceCode}${Seperator.SerialCommand}${eventType}${Seperator.ServiceData}${JSON.stringify(serviceData)}\n`);
});

// Receiving from BT
eventBus.on(EventType.DataFromSerial, (serialPayload: string) => {
  if (!serialPayload || serialPayload.trim() === "" || serialPayload === "0_heartbeat") return;

  let parts = serialPayload.split(Seperator.SerialCommand);
  if (parts.length < 2) return;

  const serviceCode = parts[0];
  let command: string,
    rawData: string | null = null;

  if (parts[1].startsWith(ServiceCommand.SET)) {
    let subParts = parts[1].split(Seperator.ServiceData);
    command = subParts[0];
    rawData = subParts[1];
  } else {
    command = parts[1];
  }

  if (serialPayload.startsWith(ServiceCode.Module)) {
    eventBus.emit(EventType.CommandForModule, serviceCode, command, rawData);
  } else {
    eventBus.emit(EventType.CommandForService, serviceCode, command, rawData);
  }
});

// Heartbeat Interval
setInterval(() => {
  if (isConfigured && !heartbeatMuted) {
    Serial.write("0_heartbeat\n");
  }
}, Hardware.HEARTBEAT_PUSH_INTERVAL);

const publishToSerial = (serviceCode: string, eventType: string, serviceData: any) => {
  eventBus.emit(EventType.DataFromService, serviceCode, eventType, serviceData);
};

export { publishToSerial };
