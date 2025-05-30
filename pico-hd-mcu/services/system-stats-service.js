const BaseService = require('../base-service');
const { SystemStatsData } = require('../../ts-schema/data.model');
const { ServiceCode, ServiceType, Broadcasting } = require('../../ts-schema/constants');

class SystemStatsService extends BaseService {
  constructor(eventBus) {
    super(eventBus, {
      serviceCode: ServiceCode.SystemStats,
      serviceType: ServiceType.ON_DEMAND,
      broadcastMode: Broadcasting.OnDemandPolling
    });
    this.data = new SystemStatsData();
  }

  setup() {
    super.setup();
    this.data.arch = process.arch;
    this.data.platform = process.platform;
    this.data.version = process.version;
    this.data.name = board.name;
    this.data.uid = board.uid;
  }

  publishData() {
    const mem = process.memoryUsage();
    this.data.heapTotal = mem.heapTotal;
    this.data.heapUsed = mem.heapUsed;
    this.data.heapPeak = mem.heapPeak;
    super.publishData();
  }
};

module.exports = SystemStatsService;