const { ServiceCode, Gpio, ServiceType } = require('../constants');
const BaseService = require('../base-service');
const { IDeviceSensorData } = require('../schema');

class DeviceSensorService extends BaseService {
  constructor(eventBus) {
    super(ServiceCode.DeviceSensor, ServiceType.ON_DEMAND, 1000, eventBus);
    this.raw = IDeviceSensorData;
    this.data = IDeviceSensorData;
  }

  update() {
    this.data.temp = analogRead(Gpio.DEVICE_SENSOR_TEMP);
    this.data.vref = analogRead(Gpio.DEVICE_SENSOR_VOLTS);
    this.data.rpm = analogRead(Gpio.DEVICE_SENSOR_RPM);
    this.data.speed = analogRead(Gpio.DEVICE_SENSOR_SPEED);
    super.update();
  }
};

module.exports = DeviceSensorService;