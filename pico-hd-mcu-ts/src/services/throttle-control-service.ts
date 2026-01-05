/* eslint-disable @typescript-eslint/no-explicit-any */

import { Servo } from "servo";
import { BroadcastMode, FILE_TCM_CONFIG, Gpio, Hardware, ServiceCode, ServiceType } from "../../../ts-schema/constants";
import { TcmSettings, ThrottleData } from "../../../ts-schema/data.model";
import { BaseService } from "../base-service";
import { IEventBus } from "../event-bus";
import { Logging } from "../logger";
import { mapRange, readObject, writeObject, watchADC } from "../utils";
import { IAdcValue, ITcmSettings, IThrottleData } from "../../../ts-schema/data.interface";
import { AdcHallSensor } from "../lib/adc-hall-sensor";

const defaultTcmConfig: ITcmSettings = {
  throttleAdcMin: Hardware.THROTTLE_ADC_MIN,
  throttleAdcMax: Hardware.THROTTLE_ADC_MAX,
  throttleChangeThreshold: Hardware.THROTTLE_CHANGE_THRESHOLD,
  throttleSamplingIntervalMs: Hardware.THROTTLE_SAMPLING_INTERVAL_MS,
  throttleSamplingCount: Hardware.THROTTLE_SAMPLING_COUNT,
  // throttleServoSpeed: Hardware.THROTTLE_SERVO_SPEED,
  throttleServoMinAngle: Hardware.THROTTLE_SERVO_ANGLE_MIN,
  throttleServoMaxAngle: Hardware.THROTTLE_SERVO_ANGLE_MAX,
  throttleGripMinAngle: Hardware.THROTTLE_GRIP_ANGLE_MIN,
  throttleGripMaxAngle: Hardware.THROTTLE_GRIP_ANGLE_MAX,
};

let tcmConfig: ITcmSettings = null; //readObject(FILE_TCM_CONFIG);

if (!tcmConfig) {
  Logging.debug(ServiceCode.ThrottleControl, "TCM config not found, creating default config");
  tcmConfig = TcmSettings.default(defaultTcmConfig);
  writeObject(FILE_TCM_CONFIG, tcmConfig);
}

export class ThrottleControlService extends BaseService<ThrottleData> {
  private throttleServo: Servo;
  private throttleSensor: AdcHallSensor;

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
    this.throttleServo = new Servo();
    this.throttleSensor = new AdcHallSensor(Gpio.THROTTLE_SENSOR_MAIN, tcmConfig.throttleSamplingIntervalMs, this.processThrottleServo.bind(this));
    this.throttleSensor.init();
    this.throttleServo.attach(Gpio.THROTTLE_SERVO_PWM);
    this.throttleServo.write(tcmConfig.throttleServoMinAngle);
  }

  public processThrottleServo(adcValue: IAdcValue): void {
    this.data.inputThrottleAdcRunningSum -= this.data.inputThrottleAdcValues[this.data.inputThrottleAdcSampleIndex];
    this.data.inputThrottleAdcValues[this.data.inputThrottleAdcSampleIndex] = adcValue.bit;
    this.data.inputThrottleAdcRunningSum += adcValue.bit;
    this.data.inputThrottleAdcSampleIndex = (this.data.inputThrottleAdcSampleIndex + 1) % tcmConfig.throttleSamplingCount;

    this.data.filteredThrottleAdcValue = Math.round(this.data.inputThrottleAdcRunningSum / tcmConfig.throttleSamplingCount);

    // Logging.debug(ServiceCode.ThrottleControl, `adc.bit: ${adcValue.bit}, filteredThrottleAdcValue: ${this.data.filteredThrottleAdcValue}, inputThrottleAdcRunningSum: ${this.data.inputThrottleAdcRunningSum}, data: ${JSON.stringify(this.data)}`);

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
    this.data.throttleServoAngle = mapRange(this.data.filteredThrottleAdcValue, tcmConfig.throttleAdcMin, tcmConfig.throttleAdcMax, tcmConfig.throttleServoMinAngle, tcmConfig.throttleServoMaxAngle);
    this.data.throttleGripAngle = mapRange(this.data.filteredThrottleAdcValue, tcmConfig.throttleAdcMin, tcmConfig.throttleAdcMax, tcmConfig.throttleGripMinAngle, tcmConfig.throttleGripMaxAngle);

    // this.data.throttleServoAngle = Math.max(tcmConfig.throttleServoMinAngle, Math.min(tcmConfig.throttleServoMaxAngle, this.data.throttleServoAngle));

    this.throttleServo.write(this.data.throttleServoAngle);
    Logging.debug(ServiceCode.ThrottleControl, `adc: ${this.data.filteredThrottleAdcValue}, gripAngle: ${this.data.throttleGripAngle.toFixed(0).padStart(3, " ")}, servoAngle: ${this.data.throttleServoAngle.toFixed(0).padStart(3, " ")}, }`);
  }

  public handleCommand(command: string, raw?: any): void {
    super.handleCommand(command);
    // set config values from command
  }

  publishData() {
    super.publishData();
  }
}
