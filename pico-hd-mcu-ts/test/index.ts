import { ADC } from "adc";
import { Gpio, Hardware } from "../../ts-schema/constants";
import { Servo } from "servo";

const throttleAdcInput = new ADC(Gpio.VEHICLE_SENSOR_THROTTLE);
const temperatureAdcInput = new ADC(Gpio.ONCHIP_TEMP);
const throttleServo = new Servo();

console.log(`Gpio.VEHICLE_SENSOR_THROTTLE: ${Gpio.VEHICLE_SENSOR_THROTTLE}`);
console.log(`Gpio.VEHICLE_SENSOR_TEMP: ${Gpio.ONCHIP_TEMP}`);
console.log(`Gpio.THROTTLE_SERVO_PWM: ${Gpio.THROTTLE_SERVO_PWM}`);

let servoAngle = 0;
let previousServoAngle = -1;
throttleServo.attach(Gpio.THROTTLE_SERVO_PWM);

setInterval(() => {
  let throttleAdc = throttleAdcInput.read();
  let throttleVoltage = throttleAdc * Hardware.ADC_REF_MAX_VOLTAGE;
  console.log(` Thro Raw: ${throttleAdc.toFixed(4)} | Volts: ${throttleVoltage.toFixed(2)}V | 12Bit: ${(throttleAdc * Hardware.ADC_BIT_MAX_VALUE).toFixed(0)}`);

  let temperatureAdc = temperatureAdcInput.read();
  let tempVoltage = temperatureAdc * Hardware.ADC_REF_MAX_VOLTAGE;
  let temperatureC = 27 - (tempVoltage - 0.706) / 0.001721;
  console.log(` Temp Raw: ${temperatureAdc.toFixed(4)} | Volts: ${tempVoltage.toFixed(2)}V | 12Bit: ${(temperatureAdc * Hardware.ADC_BIT_MAX_VALUE).toFixed(0)} | °C: ${temperatureC.toFixed(2)}`);
}, 100);

setInterval(() => {
  servoAngle = (servoAngle + 10) % 100;
  throttleServo.write(servoAngle);
  console.log(`Servo SET: ${servoAngle}`);
}, 1000);

setInterval(() => {
  const currentServoAngle = throttleServo.read();
  if (currentServoAngle === previousServoAngle) {
    return;
  }
  previousServoAngle = currentServoAngle;
  console.log(`Servo GET: ${currentServoAngle}`);
}, 500);
