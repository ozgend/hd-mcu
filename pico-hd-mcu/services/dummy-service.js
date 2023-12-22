const { ServiceCode } = require('../constants');
const BaseService = require('../base-service');

class DummyService extends BaseService {
  constructor(eventBus) {
    super(ServiceCode.Dummy, 1000, eventBus);
  }

  start() {
    super.start();
    console.log('DummyService.start');
  }

  update() {
    this.data.uptime = Date.now();
    super.update();
  }
};

module.exports = DummyService;