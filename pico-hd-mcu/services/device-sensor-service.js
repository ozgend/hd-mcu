const { ServiceCode, Gpio, ServiceType, Hardware } = require('../constants');
const { scaleAdcRef, factorAdcValue } = require('../utils');
const BaseService = require('../base-service');
const { IDeviceSensorData } = require('../schema');

class DeviceSensorService extends BaseService {
  constructor(eventBus) {
    super(ServiceCode.DeviceSensor, ServiceType.ON_DEMAND, 1000, eventBus);
    this.data = IDeviceSensorData;
  }

  update() {
    this.data.uptime = millis();

    const rawTemp = analogRead(Gpio.DEVICE_SENSOR_TEMP);
    this.data.raw_temp = rawTemp;
    this.data.temp = 27 - (factorAdcValue(rawTemp) - 0.706) / 0.001721;

    const rawBatt = analogRead(Gpio.DEVICE_SENSOR_BATT);
    this.data.raw_batt = rawBatt;
    this.data.batt = factorAdcValue(rawBatt) / (Hardware.BATTERY_VOLTAGE_R2 / (Hardware.BATTERY_VOLTAGE_R1 + Hardware.BATTERY_VOLTAGE_R2));

    const rawRpm = analogRead(Gpio.DEVICE_SENSOR_RPM);
    this.data.raw_rpm = rawRpm;
    this.data.rpm = factorAdcValue(rawRpm);

    const rawSpeed = analogRead(Gpio.DEVICE_SENSOR_SPEED);
    this.data.raw_speed = rawSpeed;
    this.data.speed = factorAdcValue(rawSpeed);

    super.update();
  }
};

module.exports = DeviceSensorService;