/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import fs from "fs";

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export const isFileExist = (filepath: string): boolean => {
  return fs.existsSync(filepath);
};

export const writeFile = async (filepath: string, unencodedString: string): Promise<void> => {
  await fs.writeFile(filepath, textEncoder.encode(unencodedString));
};

export const readFile = async (filepath: string): Promise<string> => {
  const raw = await fs.readFile(filepath);
  return textDecoder.decode(raw);
};

export const writeObject = async (filepath: string, data: object): Promise<void> => {
  await writeFile(filepath, JSON.stringify(data));
};

export const readObject = async (filepath: string): Promise<any> => {
  const raw = await readFile(filepath);
  return JSON.parse(raw);
};

export const scaler = (rangeFrom: [number, number], rangeTo: [number, number]) => {
  const d = (rangeTo[1] - rangeTo[0]) / (rangeFrom[1] - rangeFrom[0]);
  return (value: number): number => (value - rangeFrom[0]) * d + rangeTo[0];
};
