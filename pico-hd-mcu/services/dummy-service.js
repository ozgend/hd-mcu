const { ServiceCode } = require('../constants');
const BaseService = require('../base-service');

class DummyService extends BaseService {
  constructor(eventBus) {
    super(ServiceCode.Dummy, 1000, eventBus);
  }

  update() {
    this.data.uptime = Date.now();
    super.update();
  }
};

module.exports = DummyService;