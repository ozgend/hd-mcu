/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { IEventBus } from "../event-bus";
import { BaseService } from "../base-service";
import { ServiceCode, Gpio, ServiceType, Hardware, BroadcastMode } from "../../../ts-schema/constants";
import { IVehicleSensorData } from "../../../ts-schema/data.interface";
import { VehicleSensorData } from "../../../ts-schema/data.model";

const BATTERY_VOLTAGE_SCALING_FACTOR = (Hardware.BATTERY_VOLTAGE_R1 + Hardware.BATTERY_VOLTAGE_R2) / Hardware.BATTERY_VOLTAGE_R2;

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
    attachInterrupt(Gpio.VEHICLE_SENSOR_RPM, this.interruptRpmHandler.bind(this), RISING);
  }

  stop() {
    super.stop();
    detachInterrupt(Gpio.VEHICLE_SENSOR_RPM);
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
    const raw_temp = analogRead(Gpio.VEHICLE_SENSOR_TEMP);
    const raw_temp_volts = raw_temp * Hardware.ADC_REF_MAX_VOLTAGE;
    this.data.temp = Hardware.TEMPERATURE_OFFSET - (raw_temp_volts - Hardware.ADC_OFFSET_VOLTAGE) / Hardware.TEMPERATURE_SCALING_FACTOR;
  }

  private calculateVref() {
    const raw_vref = analogRead(Gpio.VEHICLE_SENSOR_VREF);
    this.data.vref = raw_vref * Hardware.ADC_SCALING_FACTOR;
  }

  private calculateBattery() {
    const raw_batt = analogRead(Gpio.VEHICLE_SENSOR_BATT);
    this.data.batt = raw_batt * Hardware.ADC_REF_MAX_VOLTAGE * BATTERY_VOLTAGE_SCALING_FACTOR;
  }

  setup() {
    super.setup();
    pinMode(Gpio.VEHICLE_SENSOR_BATT, INPUT);
    pinMode(Gpio.VEHICLE_SENSOR_AUX, INPUT);
    pinMode(Gpio.VEHICLE_SENSOR_RPM, INPUT);
    pinMode(Gpio.VEHICLE_SENSOR_SPEED, INPUT);
    pinMode(Gpio.VEHICLE_SENSOR_IGN, INPUT);
  }

  publishData() {
    this.data.uptime = millis();
    this.calculateTemperature();
    this.calculateVref();
    this.calculateBattery();
    this.calculateRpm();
    this.calculateSpeed();
    this.calculateTpmsData();
    super.publishData();
  }
}
