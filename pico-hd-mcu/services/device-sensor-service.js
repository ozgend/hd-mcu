const { ServiceCode, Gpio } = require('../constants');
const BaseService = require('../base-service');

class DeviceSensorService extends BaseService {
  constructor(eventBus) {
    super(ServiceCode.DeviceSensor, 1000, eventBus);
  }

  update() {
    this.data.temp = analogRead(Gpio.ADC4);
    this.data.vref = analogRead(Gpio.ADC0);
    super.update();
  }
};

module.exports = DeviceSensorService;