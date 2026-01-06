import { readObject, writeObject } from "./utils";
import { HdMcuSettings } from "../../ts-schema/data.interface";

export const readSettings = (key: string): HdMcuSettings | null => {
  try {
    const data = readObject(`./settings.${key}.json`);
    const storage: HdMcuSettings = data ? JSON.parse(data) : null;
    return storage;
  } catch (error) {
    console.error("Error reading settings:");
    console.error(error);
    return null;
  }
};

export const updateSettings = (key: string, data: HdMcuSettings): void => {
  try {
    writeObject(`./settings.${key}.json`, data);
  } catch (error) {
    console.error("Error updating settings:");
    console.error(error);
  }
};
