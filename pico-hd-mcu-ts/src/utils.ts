/* eslint-disable @typescript-eslint/no-explicit-any */

import fs from "fs";

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export const isFileExist = (filepath: string): boolean => {
  return fs?.exists(filepath);
};

export const writeFile = async (filepath: string, unencodedString: string) => {
  await fs.writeFile(filepath, textEncoder.encode(unencodedString));
};

export const readFile = (filepath: string): string | null => {
  if (!isFileExist(filepath)) {
    return null;
  }
  const raw = fs.readFile(filepath);
  return textDecoder.decode(raw);
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
