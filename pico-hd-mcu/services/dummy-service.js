const { ServiceCode, ServiceType } = require('../constants');
const BaseService = require('../base-service');

class DummyService extends BaseService {
  constructor(eventBus) {
    super(ServiceCode.Dummy, ServiceType.ON_DEMAND, 1000, eventBus);
  }

  start() {
    super.start();
    console.log('DummyService.start');
  }

  update() {
    this.data.dummy = true;
    super.update();
  }
};

module.exports = DummyService;