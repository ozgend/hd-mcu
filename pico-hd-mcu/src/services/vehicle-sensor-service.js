const logger = require('../logger');
const BaseService = require('../base-service');
const { VehicleSensorData } = require('../../../ts-schema/data.model');
const { ServiceCode, Gpio, ServiceType, Hardware, Broadcasting } = require('../../../ts-schema/constants');

const BATTERY_VOLTAGE_SCALING_FACTOR = (Hardware.BATTERY_VOLTAGE_R1 + Hardware.BATTERY_VOLTAGE_R2) / Hardware.BATTERY_VOLTAGE_R2;

class VehicleSensorService extends BaseService {
  rpmSignalCounter = 0;
  rpmSignalLastTime = 0;

  constructor(eventBus) {
    super(eventBus, {
      serviceCode: ServiceCode.VehicleSensor,
      serviceType: ServiceType.ON_DEMAND,
      broadcastMode: Broadcasting.OnDemandPolling,
    });
    this.data = new VehicleSensorData();
  }

  start() {
    super.start();
    attachInterrupt(Gpio.VEHICLE_SENSOR_RPM, this.interruptRpmHandler, RISING);
  }

  stop() {
    super.stop();
    detachInterrupt(Gpio.VEHICLE_SENSOR_RPM);
  }

  interruptRpmHandler() {
    this.rpmSignalCounter++;
    console.log('rpm signal counter', this.rpmSignalCounter);
  }

  calculateRpm() {
    // todo: implement with harley davidson rpm sensor output voltage reference
    // const rawRpm = analogRead(Gpio.VEHICLE_SENSOR_RPM);
    // this.data.raw_rpm = rawRpm;
    // this.data.rpm = rawRpm;
    this.data.rpm = -1;

    const currentTime = millis();
    const deltaTime = currentTime - this.rpmSignalLastTime;

    if (deltaTime > 0) {
      this.data.rpm = this.rpmSignalCounter / deltaTime * 1000 * 60;
    }

    this.rpmSignalCounter = 0;
    this.rpmSignalLastTime = currentTime;
  }

  calculateSpeed() {
    // todo: implement with harley davidson speed sensor output voltage reference
    // const rawSpeed = analogRead(Gpio.VEHICLE_SENSOR_SPEED);
    // this.data.raw_speed = rawSpeed;
    // this.data.speed = rawSpeed;
    this.data.speed = -1;
  }

  calculateTpmsData() {
    // todo: implement with tpms sensor output
    this.data.tireFront = -1;
    this.data.tireRear = -1;
    this.data.tempFront = -1;
    this.data.tempRear = -1;
  }

  calculateTemperature() {
    this.data.raw_temp = analogRead(Gpio.VEHICLE_SENSOR_TEMP);
    this.data.raw_temp_volts = this.data.raw_temp * Hardware.ADC_REF_MAX_VOLTAGE;
    this.data.temp = Hardware.TEMPERATURE_OFFSET - (this.data.raw_temp_volts - Hardware.ADC_OFFSET_VOLTAGE) / Hardware.TEMPERATURE_SCALING_FACTOR;
  }

  calculateVref() {
    this.data.raw_vref = analogRead(Gpio.VEHICLE_SENSOR_VREF);
    this.data.vref = this.data.raw_vref * Hardware.ADC_SCALING_FACTOR;
  }

  calculateBattery() {
    this.data.raw_batt = analogRead(Gpio.VEHICLE_SENSOR_BATT);
    this.data.batt = this.data.raw_batt * Hardware.ADC_REF_MAX_VOLTAGE * BATTERY_VOLTAGE_SCALING_FACTOR;
  }

  setup() {
    super.setup();
    // pinMode(Gpio.VEHICLE_SENSOR_VREF, INPUT);
    // pinMode(Gpio.VEHICLE_SENSOR_TEMP, INPUT);
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


};

module.exports = VehicleSensorService;