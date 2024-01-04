const { Hardware } = require("./constants");

const scaler = (rangeFrom, rangeTo) => {
  const d = (rangeTo[1] - rangeTo[0]) / (rangeFrom[1] - rangeFrom[0]);
  return value => (value - rangeFrom[0]) * d + rangeTo[0];
};

const scaleAdcRef = (value, rangeTo) => {
  return scaler([0, Hardware.ADC_REF_MAX_VOLTAGE], rangeTo)(value);
};

const scaleAdcBit = scaler([0, Hardware.ADC_REF_MAX_VOLTAGE], [0, Hardware.ADC_BIT_MAX_VALUE]);

const factorAdcValue = value => value * Hardware.ADC_CONVERSION_FACTOR;

module.exports = { scaler, scaleAdcRef, scaleAdcBit, factorAdcValue };