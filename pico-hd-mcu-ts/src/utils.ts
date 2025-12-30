/* eslint-disable @typescript-eslint/no-explicit-any */

const fs = require("fs");
import { Hardware } from "../../ts-schema/constants";
import { Logging } from "./logger";

if (!fs) {
  Logging.error("FileSystem", "File system module is not available. Ensure you are running in a compatible environment");
}

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export const isFileExist = (filepath: string): boolean => {
  Logging.debug("FileSystem.isFileExist", `Checking if file exists: ${filepath}`);
  return fs?.exists(filepath);
};

export const writeFile = (filepath: string, unencodedString: string) => {
  Logging.debug("FileSystem.writeFile", `Writing file ${filepath}`);
  try {
    fs.writeFile(filepath, textEncoder.encode(unencodedString));
  } catch (error) {
    Logging.error("FileSystem.writeFile", `Failed to write file ${filepath}`);
    Logging.error("FileSystem.writeFile", (error as any).toString());
  }
};

export const readFile = (filepath: string): string | null => {
  Logging.debug("FileSystem.readFile", `Reading file ${filepath}`);
  if (!isFileExist(filepath)) {
    return null;
  }
  try {
    const raw = fs.readFile(filepath);
    return textDecoder.decode(raw);
  } catch (error) {
    Logging.error("FileSystem.readFile", `Failed to read file ${filepath}`);
    Logging.error("FileSystem.readFile", (error as any).toString());
    return null;
  }
};

export const writeObject = (filepath: string, data: object) => {
  writeFile(filepath, JSON.stringify(data));
};

export const readObject = (filepath: string): any => {
  const raw = readFile(filepath);
  return raw ? JSON.parse(raw) : null;
};

export const scaler = (rangeFrom: [number, number], rangeTo: [number, number]) => {
  const d = (rangeTo[1] - rangeTo[0]) / (rangeFrom[1] - rangeFrom[0]);
  return (value: number): number => (value - rangeFrom[0]) * d + rangeTo[0];
};

export const mapRange = (value: number, inMin: number, inMax: number, outMin: number, outMax: number): number => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

export const watchADC = (adcPinNumber, intervalMs, callback) => {
  const pid = setInterval(() => {
    const rawAdcValue = analogRead(adcPinNumber);
    const bit12Value = Math.round(rawAdcValue * Hardware.ADC_BIT_MAX_VALUE);
    const voltageValue = rawAdcValue * Hardware.ADC_REF_MAX_VOLTAGE;
    //Logging.debug("watchADC", `ADC Read ${adcPinNumber}: ${rawAdcValue.toFixed(8)}, bit12: ${bit12Value.toFixed(0).padStart(4, " ")}, voltage: ${voltageValue.toFixed(2)} V`);
    callback(bit12Value);
  }, intervalMs);
  Logging.debug("watchADC", `Started ADC watcher on pin ${adcPinNumber} with interval ${intervalMs} ms @ PID ${pid}`);
  return pid;
};
