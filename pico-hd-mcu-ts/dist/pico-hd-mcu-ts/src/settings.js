"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSettings = exports.readSettings = void 0;
const fs_1 = require("fs");
const readSettings = (key) => {
    try {
        const data = (0, fs_1.readFileSync)(`./settings.${key}.json`, "utf8");
        const storage = JSON.parse(data);
        return storage;
    }
    catch (error) {
        return null;
    }
};
exports.readSettings = readSettings;
const updateSettings = (key, data) => {
    try {
        (0, fs_1.writeFileSync)(`./settings.${key}.json`, JSON.stringify(data));
    }
    catch (error) {
        console.error(error);
    }
};
exports.updateSettings = updateSettings;
