const { ServiceCode, Gpio, ServiceType, Hardware } = require('../constants');
const { scaleAdcRef, factorAdcValue } = require('../utils');
const BaseService = require('../base-service');
const { IDeviceSensorData } = require('../schema');

class DeviceSensorService extends BaseService {
  constructor(eventBus) {
    super(ServiceCode.DeviceSensor, ServiceType.ON_DEMAND, 1000, eventBus);
    this.raw = IDeviceSensorData;
    this.data = IDeviceSensorData;
  }

  update() {
    this.raw.temp = analogRead(Gpio.DEVICE_SENSOR_TEMP);
    this.raw.batt = analogRead(Gpio.DEVICE_SENSOR_VOLTS);
    this.raw.rpm = analogRead(Gpio.DEVICE_SENSOR_RPM);
    this.raw.speed = analogRead(Gpio.DEVICE_SENSOR_SPEED);

    this.data.temp = 27 - (factorAdcValue(this.raw.temp) - 0.706) / 0.001721;

    let battVref = factorAdcValue(this.raw.batt);
    battVref = battVref - (battVref * Hardware.BATTERY_VOLTAGE_LOSS);
    this.data.batt = battVref / (Hardware.BATTERY_VOLTAGE_R2 / (Hardware.BATTERY_VOLTAGE_R1 + Hardware.BATTERY_VOLTAGE_R2));

    super.update();
  }
};

module.exports = DeviceSensorService;