const { ServiceCode, ServiceType } = require('../constants');
const BaseService = require('../base-service');
const { ISystemStatsData } = require('../schema');

class SystemStatsService extends BaseService {
  constructor(eventBus) {
    super(ServiceCode.SystemStats, ServiceType.ON_DEMAND, 2000, eventBus);
    this.data = ISystemStatsData;
  }

  start() {
    super.start();
    this.data.arch = process.arch;
    this.data.platform = process.platform;
    this.data.version = process.version;
    this.data.name = board.name;
    this.data.uid = board.uid;
  }

  update() {
    const mem = process.memoryUsage();
    this.data.heapTotal = mem.heapTotal;
    this.data.heapUsed = mem.heapUsed;
    this.data.heapPeak = mem.heapPeak;
    this.data.rtc = millis();
    this.data.now = Date.now();
    super.update();
  }
};

module.exports = SystemStatsService;