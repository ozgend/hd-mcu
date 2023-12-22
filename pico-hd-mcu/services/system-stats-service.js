const { ServiceCode, ServiceType } = require('../constants');
const BaseService = require('../base-service');

class SystemStatsService extends BaseService {
  constructor(eventBus) {
    super(ServiceCode.SystemStats, ServiceType.ON_DEMAND, 2000, eventBus);
  }

  update() {
    console.log(`[${this.code}] updating`);

    try {
      this.data.board_name = board.name;
      this.data.board_uid = board.uid;
      this.data.board_LED = board.LED;
      this.data.process_arch = process.arch;
      this.data.process_platform = process.platform;
      this.data.process_version = process.version;
      this.data.mem_total = process.memoryUsage().heapTotal;
      this.data.mem_used = process.memoryUsage().heapUsed;
      this.data.mem_peak = process.memoryUsage().heapPeak;
    }
    catch (e) {
      console.log(`[${this.code}] error: ${e}`);
    }

    console.log(`[${this.code}] update: ${JSON.stringify(this.data)}`);
    super.update();
  }
};

module.exports = SystemStatsService;