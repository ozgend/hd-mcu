/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { readObject, writeObject } from "./utils";
import { HdMcuSettings } from "../../ts-schema/data.interface";

export const readSettings = (key: string): HdMcuSettings | null => {
  try {
    const data = readObject(`./settings.${key}.json`);
    const storage: HdMcuSettings = data ? JSON.parse(data) : null;
    return storage;
  } catch (error) {
    return null;
  }
};

export const updateSettings = (key: string, data: HdMcuSettings): void => {
  try {
    writeObject(`./settings.${key}.json`, JSON.stringify(data));
  } catch (error) {
    console.error(error);
  }
};
