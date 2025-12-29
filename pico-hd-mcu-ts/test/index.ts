/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { ADC } from "adc";
import { Gpio, Hardware } from "../../ts-schema/constants";

const throttleAdcInput = new ADC(Gpio.THROTTLE_SENSOR_MAIN);
const temperatureAdcInput = new ADC(Gpio.VEHICLE_SENSOR_TEMP);

console.log(`Gpio.THROTTLE_SENSOR_MAIN: ${Gpio.THROTTLE_SENSOR_MAIN}`);
console.log(`Gpio.VEHICLE_SENSOR_TEMP: ${Gpio.VEHICLE_SENSOR_TEMP}`);

setInterval(() => {
  let throttleAdc = throttleAdcInput.read();
  let throttleVoltage = throttleAdc * Hardware.ADC_REF_MAX_VOLTAGE;
  console.log(`Thro Raw: ${throttleAdc.toFixed(4)} | Volts: ${throttleVoltage.toFixed(2)}V | 12Bit: ${(throttleAdc * Hardware.ADC_BIT_MAX_VALUE).toFixed(0)}`);

  let temperatureAdc = temperatureAdcInput.read();
  let tempVoltage = temperatureAdc * Hardware.ADC_REF_MAX_VOLTAGE;
  let temperatureC = 27 - (tempVoltage - 0.706) / 0.001721;
  console.log(`Temp Raw: ${temperatureAdc.toFixed(4)} | Volts: ${tempVoltage.toFixed(2)}V | 12Bit: ${(temperatureAdc * Hardware.ADC_BIT_MAX_VALUE).toFixed(0)} | °C: ${temperatureC.toFixed(2)}`);
}, 100);
