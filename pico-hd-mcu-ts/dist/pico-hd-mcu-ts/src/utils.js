"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scaler = exports.readObject = exports.writeObject = exports.readFile = exports.writeFile = exports.isFileExist = void 0;
const fs_1 = require("fs");
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();
const isFileExist = (filepath) => {
    return fs_1.default.existsSync(filepath);
};
exports.isFileExist = isFileExist;
const writeFile = (filepath, unencodedString) => __awaiter(void 0, void 0, void 0, function* () {
    yield fs_1.default.writeFile(filepath, textEncoder.encode(unencodedString));
});
exports.writeFile = writeFile;
const readFile = (filepath) => __awaiter(void 0, void 0, void 0, function* () {
    const raw = yield fs_1.default.readFile(filepath);
    return textDecoder.decode(raw);
});
exports.readFile = readFile;
const writeObject = (filepath, data) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.writeFile)(filepath, JSON.stringify(data));
});
exports.writeObject = writeObject;
const readObject = (filepath) => __awaiter(void 0, void 0, void 0, function* () {
    const raw = yield (0, exports.readFile)(filepath);
    return JSON.parse(raw);
});
exports.readObject = readObject;
const scaler = (rangeFrom, rangeTo) => {
    const d = (rangeTo[1] - rangeTo[0]) / (rangeFrom[1] - rangeFrom[0]);
    return (value) => (value - rangeFrom[0]) * d + rangeTo[0];
};
exports.scaler = scaler;
