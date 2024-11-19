/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import fs from "fs";

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export const isFileExist = (filepath: string): boolean => {
  return fs.exists(filepath);
};

export const writeFile = async (filepath: string, unencodedString: string) => {
  await fs.writeFile(filepath, textEncoder.encode(unencodedString));
};

export const readFile = async (filepath: string): string => {
  const raw = fs.readFile(filepath);
  return textDecoder.decode(raw);
};

export const writeObject = async (filepath: string, data: object) => {
  writeFile(filepath, JSON.stringify(data));
};

export const readObject = async (filepath: string): any => {
  const raw = readFile(filepath);
  return JSON.parse(raw);
};

export const scaler = (rangeFrom: [number, number], rangeTo: [number, number]) => {
  const d = (rangeTo[1] - rangeTo[0]) / (rangeFrom[1] - rangeFrom[0]);
  return (value: number): number => (value - rangeFrom[0]) * d + rangeTo[0];
};
