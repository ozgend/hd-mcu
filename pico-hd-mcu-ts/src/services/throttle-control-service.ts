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

  private inputThrottleAdcBits: Uint16Array;
  private inputThrottleAdcRunningSum: number;
  private inputThrottleAdcSampleIndex: number;
  private previousThrottleAdcBit: number;

  constructor(eventBus: IEventBus) {
    super(eventBus, {
      serviceCode: ServiceCode.ThrottleControl,
      serviceType: ServiceType.OnDemand,
      broadcastMode: BroadcastMode.OnDemandPolling,
    });
    this.inputThrottleAdcBits = new Uint16Array(tcmConfig.throttleSamplingCount);
    // this.inputThrottleAdcBits.fill(tcmConfig.throttleAdcMin);

    this.inputThrottleAdcRunningSum = 0;
    this.inputThrottleAdcSampleIndex = 0;
    this.previousThrottleAdcBit = 0;
    this.data = new ThrottleData();
  }

  setup() {
    super.setup();
    this.throttleServo = new Servo();
    this.throttleSensor = new AdcHallSensor(Gpio.VEHICLE_SENSOR_THROTTLE, tcmConfig.throttleSamplingIntervalMs, this.processThrottleServo.bind(this));
    this.throttleSensor.init();
    this.throttleServo.attach(Gpio.THROTTLE_SERVO_PWM);
    this.throttleServo.write(tcmConfig.throttleServoMinAngle);
  }

  public start(): void {
    super.start();
  }

  public processThrottleServo(adcValue: IAdcValue): void {
    this.inputThrottleAdcRunningSum -= this.inputThrottleAdcBits[this.inputThrottleAdcSampleIndex];
    this.inputThrottleAdcBits[this.inputThrottleAdcSampleIndex] = adcValue.bit;
    this.inputThrottleAdcRunningSum += adcValue.bit;
    this.inputThrottleAdcSampleIndex = (this.inputThrottleAdcSampleIndex + 1) % tcmConfig.throttleSamplingCount;
    this.data.adcBit = Math.round(this.inputThrottleAdcRunningSum / tcmConfig.throttleSamplingCount);

    // Logging.debug(ServiceCode.ThrottleControl, `PREXEC --- adc.in: ${adcValue.bit}, adc.pre: ${this.previousThrottleAdcBit}, adc.now: ${this.data.adcBit} ####### config: adc.min: ${tcmConfig.throttleAdcMin}, adc.max: ${tcmConfig.throttleAdcMax} servo.min: ${tcmConfig.throttleServoMinAngle}, servo.max: ${tcmConfig.throttleServoMaxAngle}, grip.min: ${tcmConfig.throttleGripMinAngle}, grip.max: ${tcmConfig.throttleGripMaxAngle}`);

    if (this.data.adcBit > tcmConfig.throttleAdcMax) {
      this.data.adcBit = tcmConfig.throttleAdcMax;
    }

    if (this.data.adcBit < tcmConfig.throttleAdcMin) {
      // Logging.debug(ServiceCode.ThrottleControl, `PREXEC --- adc.value set to min ${this.data.adcBit},${adcValue.bit} < ${tcmConfig.throttleAdcMin}`);
      this.data.adcBit = tcmConfig.throttleAdcMin;
    }

    const deltaAdc = Math.abs(this.data.adcBit - this.previousThrottleAdcBit);

    if (deltaAdc < tcmConfig.throttleChangeThreshold) {
      // Logging.debug(ServiceCode.ThrottleControl, `PREXEC --- no change ${deltaAdc} < ${tcmConfig.throttleChangeThreshold}`);
      return;
    }

    this.previousThrottleAdcBit = this.data.adcBit;
    this.data.servoAngle = mapRange(this.data.adcBit, tcmConfig.throttleAdcMin, tcmConfig.throttleAdcMax, tcmConfig.throttleServoMinAngle, tcmConfig.throttleServoMaxAngle);
    this.data.gripAngle = mapRange(this.data.adcBit, tcmConfig.throttleAdcMin, tcmConfig.throttleAdcMax, tcmConfig.throttleGripMinAngle, tcmConfig.throttleGripMaxAngle);
    this.throttleServo.write(this.data.servoAngle);

    Logging.debug(ServiceCode.ThrottleControl, `adc.in: ${adcValue.bit}, adc.pre: ${this.previousThrottleAdcBit}, adc.now: ${this.data.adcBit}, grip: ${this.data.gripAngle.toFixed(0).padStart(3, " ")}*, servo: ${this.data.servoAngle.toFixed(0).padStart(3, " ")}*}`);
  }

  public handleCommand(command: string, raw?: any): void {
    super.handleCommand(command);
    // set config values from command
  }

  publishData() {
    super.publishData();
  }
}
