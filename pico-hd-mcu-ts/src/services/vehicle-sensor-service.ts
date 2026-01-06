import { IEventBus } from "../event-bus";
import { BaseService } from "../base-service";
import { ServiceCode, Gpio, ServiceType, Hardware, BroadcastMode } from "../../../ts-schema/constants";
import { IVehicleSensorData } from "../../../ts-schema/data.interface";
import { VehicleSensorData } from "../../../ts-schema/data.model";
import { Logging } from "../logger";

const BATTERY_VOLTAGE_SCALING_FACTOR = (Hardware.BATTERY_VOLTAGE_R1 + Hardware.BATTERY_VOLTAGE_R2) / Hardware.BATTERY_VOLTAGE_R2;
const ADC_TO_VOLTAGE = Hardware.ADC_REF_MAX_VOLTAGE / Hardware.ADC_BIT_MAX_VALUE;

export class VehicleSensorService extends BaseService<IVehicleSensorData> {
  private rpmSignalCounter: number = 0;
  private rpmSignalLastTime: number = 0;

  constructor(eventBus: IEventBus) {
    super(eventBus, {
      serviceCode: ServiceCode.VehicleSensor,
      serviceType: ServiceType.OnDemand,
      broadcastMode: BroadcastMode.OnDemandPolling,
    });
    this.data = new VehicleSensorData();
  }

  start() {
    super.start();
    // attachInterrupt(Gpio.VEHICLE_SENSOR_RPM, this.interruptRpmHandler.bind(this), RISING);
  }

  stop() {
    super.stop();
    // detachInterrupt(Gpio.VEHICLE_SENSOR_RPM);
  }

  private interruptRpmHandler() {
    this.rpmSignalCounter++;
    console.log("rpm signal counter", this.rpmSignalCounter);
  }

  private calculateRpm() {
    this.data.rpm = -1;

    const currentTime = millis();
    const deltaTime = currentTime - this.rpmSignalLastTime;

    if (deltaTime > 0) {
      this.data.rpm = (this.rpmSignalCounter / deltaTime) * 1000 * 60;
    }

    this.rpmSignalCounter = 0;
    this.rpmSignalLastTime = currentTime;
  }

  private calculateSpeed() {
    this.data.speed = -1;
  }

  private calculateTpmsData() {
    this.data.tireFront = -1;
    this.data.tireRear = -1;
    this.data.tempFront = -1;
    this.data.tempRear = -1;
  }

  private calculateTemperature() {
    const raw_temp = analogRead(Gpio.ONCHIP_TEMP);
    const raw_temp_volts = raw_temp * Hardware.ADC_REF_MAX_VOLTAGE;
    this.data.temp = 27 - (raw_temp_volts - 0.706) / 0.001721;
  }

  private calculateVref() {
    const raw_vref = analogRead(Gpio.ONCHIP_VREF);
    this.data.vref = (raw_vref * Hardware.ADC_REF_MAX_VOLTAGE) / Hardware.ADC_BIT_MAX_VALUE;
  }

  private calculateBattery() {
    const raw_batt = analogRead(Gpio.VEHICLE_SENSOR_BATT);
    this.data.batt = ((raw_batt * Hardware.ADC_REF_MAX_VOLTAGE) / Hardware.ADC_BIT_MAX_VALUE) * BATTERY_VOLTAGE_SCALING_FACTOR;
  }

  setup() {
    super.setup();
    pinMode(Gpio.VEHICLE_SENSOR_BATT, INPUT);
    pinMode(Gpio.VEHICLE_SENSOR_RPM, INPUT);
    pinMode(Gpio.VEHICLE_SENSOR_SPEED, INPUT);
    pinMode(Gpio.VEHICLE_SENSOR_IGN, INPUT);

    this.calculateTemperature();
    Logging.debug(ServiceCode.VehicleSensor, `temp: ${this.data.temp?.toFixed(1)} °C`);
  }

  publishData() {
    this.data.uptime = millis();
    this.calculateTemperature();
    this.calculateVref();
    this.calculateBattery();
    // this.calculateRpm();
    // this.calculateSpeed();
    // this.calculateTpmsData();
    super.publishData();
  }
}
