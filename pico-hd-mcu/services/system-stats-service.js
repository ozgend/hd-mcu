const { ServiceCode, ServiceType } = require('../constants');
const BaseService = require('../base-service');

class SystemStatsService extends BaseService {
  constructor(eventBus) {
    super(ServiceCode.SystemStats, ServiceType.ON_DEMAND, 2000, eventBus);
  }

  start() {
    super.start();
    this.data.arch = process.arch;
    this.data.platform = process.platform;
    this.data.version = process.version;
    this.data.name = board.name;
    this.data.uid = board.uid;
    this.data.led = board.LED;
  }

  update() {
    this.data.memory = process.memoryUsage();
    super.update();
  }
};

module.exports = SystemStatsService;