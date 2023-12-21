const { ADC } = require('adc');
const { ServiceCode } = require('../constants');
const BaseService = require('../base-service');

class DeviceSensorService extends BaseService {
  constructor(eventBus) {
    super(ServiceCode.DeviceSensor, 1000, eventBus);

    this.pinTemp = new ADC(4);
    this.pinVref = new ADC(35);
  }

  update() {
    // 27 - (volt - 0.706)/0.001721
    this.data.temp = 27 - ((this.pinTemp.read() * (2 ^ 12 / 3.3)) - 0.706) / 0.001721;
    this.data.vref = this.pinVref.read() / (2 ^ 12);
    this.data.uptime = Date.now();
    super.update();
  }
};

module.exports = DeviceSensorService;