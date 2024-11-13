/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { BaseService } from "../base-service";
import { SystemStatsData } from "../../../ts-schema/data.model";
import { ServiceCode, ServiceType, BroadcastMode } from "../../../ts-schema/constants";
import { IEventBus } from "../event-bus";

export class SystemStatsService extends BaseService<SystemStatsData> {
  constructor(eventBus: IEventBus) {
    super(eventBus, {
      serviceCode: ServiceCode.SystemStats,
      serviceType: ServiceType.OnDemand,
      broadcastMode: BroadcastMode.OnDemandPolling,
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
}
