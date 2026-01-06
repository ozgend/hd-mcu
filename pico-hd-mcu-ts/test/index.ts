import { ADC } from "adc";
import { Servo } from "servo";
import { UART } from "uart";
import { LED } from "led";
import { Gpio, Hardware } from "../../ts-schema/constants";
import { mapRange } from "../src/utils";
import { AdcHallSensor } from "../src/lib/adc-hall-sensor";
import { IAdcValue } from "../../ts-schema/data.interface";

const serial = new UART(0, { baudrate: 9600, bits: 8, partity: UART.PARTIY_NONE, stop: 1, flow: UART.FLOW_NONE, bufferSize: 2048 });

serial.on("data", (data: number[]) => {
  var s = String.fromCharCode.apply(null, data);
  console.log(`Received ${data.length} bytes: [${s}]`);
});

let previousServoAngle = -1;

const throttleAdcInput = new AdcHallSensor(Gpio.VEHICLE_SENSOR_THROTTLE, 5, throttleReadCallback);
const temperatureAdcInput = new ADC(Gpio.ONCHIP_TEMP);
const throttleServo = new Servo();
const onboardLed = new LED(Gpio.ONCHIP_LED);

throttleServo.attach(Gpio.THROTTLE_SERVO_PWM);
throttleAdcInput.init();

setInterval(() => {
  let temperatureAdc = temperatureAdcInput.read();
  let tempVoltage = temperatureAdc * Hardware.ADC_REF_MAX_VOLTAGE;
  let temperatureC = 27 - (tempVoltage - 0.706) / 0.001721;
  console.log(`Temp Raw: ${temperatureAdc.toFixed(4)} | Volts: ${tempVoltage.toFixed(2)}V | 12Bit: ${(temperatureAdc * Hardware.ADC_BIT_MAX_VALUE).toFixed(0)} | °C: ${temperatureC.toFixed(2)}`);
  serial.write(`Temp Raw: ${temperatureAdc.toFixed(4)} | Volts: ${tempVoltage.toFixed(2)}V | 12Bit: ${(temperatureAdc * Hardware.ADC_BIT_MAX_VALUE).toFixed(0)} | °C: ${temperatureC.toFixed(2)}\n`);
}, 5000);

setInterval(() => {
  serial.write(`Heartbeat: ${new Date().toISOString()}\n`);
  onboardLed.toggle();
}, 1000);

function throttleReadCallback(adcValue: IAdcValue) {
  const servoAngle = mapRange(adcValue.bit, Hardware.THROTTLE_ADC_MIN, Hardware.THROTTLE_ADC_MAX, Hardware.THROTTLE_SERVO_ANGLE_MIN, Hardware.THROTTLE_SERVO_ANGLE_MAX);
  if (Math.abs(servoAngle - previousServoAngle) < Hardware.THROTTLE_CHANGE_THRESHOLD) {
    return;
  }
  previousServoAngle = servoAngle;
  throttleServo.write(servoAngle);
  console.log(`Throttle ADC Bit: ${adcValue.bit} | Servo Angle: ${servoAngle.toFixed(1)}`);
  serial.write(`Throttle ADC Bit: ${adcValue.bit} | Servo Angle: ${servoAngle.toFixed(1)}\n`);
}
