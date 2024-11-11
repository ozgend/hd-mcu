const fs = require('fs');
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const isFileExist = (filepath) => {
  return fs.existsSync(filepath);
};

const writeFile = (filepath, unencodedString) => {
  fs.writeFile(filepath, textEncoder.encode(unencodedString));
};

const readFile = (filepath) => {
  const raw = textDecoder.decode(fs.readFile(filepath));
  return raw;
};

const writeObject = (filepath, data) => {
  writeFile(filepath, JSON.stringify(data));
};

const readObject = (filepath) => {
  const raw = readFile(filepath);
  const data = JSON.parse(raw);
  return data;
};

const scaler = (rangeFrom, rangeTo) => {
  const d = (rangeTo[1] - rangeTo[0]) / (rangeFrom[1] - rangeFrom[0]);
  return value => (value - rangeFrom[0]) * d + rangeTo[0];
};

module.exports = { scaler, isFileExist, writeFile, readFile, writeObject, readObject };