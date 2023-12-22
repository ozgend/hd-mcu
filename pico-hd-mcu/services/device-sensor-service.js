const { ServiceCode, Gpio } = require('../constants');
const BaseService = require('../base-service');

class DeviceSensorService extends BaseService {
  constructor(eventBus) {
    super(ServiceCode.DeviceSensor, 1000, eventBus);
  }

  update() {
    this.data.temp = analogRead(Gpio.DEVICE_SENSOR_TEMP);
    this.data.vref = analogRead(Gpio.DEVICE_SENSOR_VREF);
    super.update();
  }
};

module.exports = DeviceSensorService;