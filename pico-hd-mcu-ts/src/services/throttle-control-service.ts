/* eslint-disable @typescript-eslint/no-explicit-any */

import { ServoPWM } from "../lib/servo-pwm";
import { BroadcastMode, FILE_TCM_CONFIG, Gpio, Hardware, ServiceCode, ServiceType } from "../../../ts-schema/constants";
import { TcmSettings, ThrottleData } from "../../../ts-schema/data.model";
import { BaseService } from "../base-service";
import { IEventBus } from "../event-bus";
import { Logging } from "../logger";
import { mapRange, readObject, writeObject, watchADC } from "../utils";
import { ITcmSettings, IThrottleData } from "../../../ts-schema/data.interface";

const defaultTcmConfig: ITcmSettings = {
  throttleAdcMin: Hardware.THROTTLE_ADC_MIN,
  throttleAdcMax: Hardware.THROTTLE_ADC_MAX,
  throttleChangeThreshold: Hardware.THROTTLE_CHANGE_THRESHOLD,
  throttleSamplingCount: Hardware.THROTTLE_SAMPLING_COUNT,
  throttleSamplingIntervalMs: Hardware.THROTTLE_SAMPLING_INTERVAL_MS,
  throttleServoSpeed: Hardware.THROTTLE_SERVO_SPEED,
  throttleServoMinAngle: Hardware.THROTTLE_SERVO_ANGLE_MIN,
  throttleServoMaxAngle: Hardware.THROTTLE_SERVO_ANGLE_MAX,
};

const throttleServo = new ServoPWM();

let tcmConfig: ITcmSettings = null; //readObject(FILE_TCM_CONFIG);
let adcWatcherPid: number | null = null;

if (!tcmConfig) {
  Logging.debug(ServiceCode.ThrottleControl, "TCM config not found, creating default config");
  tcmConfig = TcmSettings.default(defaultTcmConfig);
  writeObject(FILE_TCM_CONFIG, tcmConfig);
}

export class ThrottleControlService extends BaseService<ThrottleData> {
  constructor(eventBus: IEventBus) {
    super(eventBus, {
      serviceCode: ServiceCode.ThrottleControl,
      serviceType: ServiceType.AlwaysRun,
      broadcastMode: BroadcastMode.OnDemandPolling,
    });
    this.data = new ThrottleData();
  }

  setup() {
    super.setup();
    pinMode(Gpio.THROTTLE_SENSOR_MAIN, INPUT);
  }

  public start(): void {
    super.start();
    adcWatcherPid = watchADC(Gpio.THROTTLE_SENSOR_MAIN, tcmConfig.throttleSamplingIntervalMs, this.processThrottleServo.bind(this));
    throttleServo.attach(Gpio.THROTTLE_SERVO_PWM);
    throttleServo.write(tcmConfig.throttleServoMinAngle);
    Logging.info(ServiceCode.ThrottleControl, `Throttle Control Service started with ADC on pin ${Gpio.THROTTLE_SENSOR_MAIN} and Servo on pin ${Gpio.THROTTLE_SERVO_PWM} @ PID ${adcWatcherPid}`);
  }

  public stop(): void {
    super.stop();
    if (adcWatcherPid) {
      clearInterval(adcWatcherPid);
      adcWatcherPid = null;
    }
    throttleServo.detach();
    Logging.info(ServiceCode.ThrottleControl, "Throttle Control Service stopped");
  }

  public processThrottleServo(adcValue: number): void {
    this.data.inputThrottleAdcRunningSum -= this.data.inputThrottleAdcValues[this.data.inputThrottleAdcSampleIndex];
    this.data.inputThrottleAdcValues[this.data.inputThrottleAdcSampleIndex] = adcValue;
    this.data.inputThrottleAdcRunningSum += adcValue;
    this.data.inputThrottleAdcSampleIndex = (this.data.inputThrottleAdcSampleIndex + 1) % tcmConfig.throttleSamplingCount;

    this.data.filteredThrottleAdcValue = Math.round(this.data.inputThrottleAdcRunningSum / tcmConfig.throttleSamplingCount);

    // Logging.debug(ServiceCode.ThrottleControl, `adcValue: ${adcValue}, filteredThrottleAdcValue: ${this.data.filteredThrottleAdcValue}, inputThrottleAdcRunningSum: ${this.data.inputThrottleAdcRunningSum}, data: ${JSON.stringify(this.data)}`);

    if (this.data.filteredThrottleAdcValue < tcmConfig.throttleAdcMin) {
      this.data.filteredThrottleAdcValue = tcmConfig.throttleAdcMin;
    }

    if (this.data.filteredThrottleAdcValue === this.data.filteredThrottleAdcValuePrevious) {
      return;
    }

    if (Math.abs(this.data.filteredThrottleAdcValue - this.data.filteredThrottleAdcValuePrevious) < tcmConfig.throttleChangeThreshold) {
      return;
    }

    this.data.filteredThrottleAdcValuePrevious = this.data.filteredThrottleAdcValue;
    this.data.throttleServoAngleFinal = mapRange(this.data.filteredThrottleAdcValue, tcmConfig.throttleAdcMin, tcmConfig.throttleAdcMax, tcmConfig.throttleServoMinAngle, tcmConfig.throttleServoMaxAngle);

    // this.data.throttleServoAngleFinal = Math.max(tcmConfig.throttleServoMinAngle, Math.min(tcmConfig.throttleServoMaxAngle, this.data.throttleServoAngleFinal));

    throttleServo.write(this.data.throttleServoAngleFinal);
    Logging.debug(ServiceCode.ThrottleControl, `filteredThrottleAdcValue: ${this.data.filteredThrottleAdcValue}, throttleAngle: ${this.data.throttleServoAngleFinal.toFixed(0).padStart(3, " ")}`);

    // if (inputThrottleAdcValues.length >= tcmConfig.throttleSamplingCount) {
    //   inputThrottleAdcValues.shift();
    // }
    // inputThrottleAdcValues.push(adcValue);
    // const sum = inputThrottleAdcValues.reduce((a, b) => a + b, 0);
    // const avg = sum / inputThrottleAdcValues.length;
    // const filteredValue = Math.round(avg);
    // filteredThrottleAdcValue = filteredValue;
    // filteredThrottleAdcValue = adcValue;
    // Logging.debug(ServiceCode.ThrottleControl, `Raw Throttle ADC Value: ${adcValue}, Filtered Throttle ADC Value: ${filteredThrottleAdcValue}`);
    // if (filteredThrottleAdcValue < tcmConfig.throttleAdcMin) {
    //   filteredThrottleAdcValue = tcmConfig.throttleAdcMin;
    //   return;
    // }
    // if (
    //   filteredThrottleAdcValue != filteredThrottleAdcValuePrevious &&
    //   Math.abs(filteredThrottleAdcValue - filteredThrottleAdcValuePrevious) >= tcmConfig.throttleChangeThreshold &&
    //   filteredThrottleAdcValue >= tcmConfig.throttleAdcMin &&
    //   filteredThrottleAdcValue <= tcmConfig.throttleAdcMax
    // ) {
    //   filteredThrottleAdcValuePrevious = filteredThrottleAdcValue;
    //   throttleServoAngleFinal = mapRange(filteredThrottleAdcValue, tcmConfig.throttleAdcMin, tcmConfig.throttleAdcMax, tcmConfig.throttleServoMinAngle, tcmConfig.throttleServoMaxAngle);
    //   throttleServo.write(throttleServoAngleFinal);
    //   Logging.debug(ServiceCode.ThrottleControl, `throttleADC: ${filteredThrottleAdcValue}, throttleAngle: ${throttleServoAngleFinal}`);
    // }
  }

  publishData() {
    super.publishData();
  }
}
