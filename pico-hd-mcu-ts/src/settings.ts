/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { readFileSync, writeFileSync } from "fs";
import { HdMcuSettings } from "../../ts-schema/data.interface";

export const readSettings = (key: string): HdMcuSettings | null => {
  try {
    const data = readFileSync(`./settings.${key}.json`, "utf8");
    const storage: HdMcuSettings = JSON.parse(data);
    return storage;
  } catch (error) {
    return null;
  }
};

export const updateSettings = (key: string, data: HdMcuSettings): void => {
  try {
    writeFileSync(`./settings.${key}.json`, JSON.stringify(data));
  } catch (error) {
    console.error(error);
  }
};
