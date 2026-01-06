import { BroadcastMode, ServiceCode, ServiceType } from "../../../ts-schema/constants";
import { BaseService } from "../base-service";
import { IEventBus } from "../event-bus";

export class IgnitionModuleService extends BaseService<any> {
  constructor(eventBus: IEventBus) {
    super(eventBus, {
      serviceCode: ServiceCode.IgnitionModule,
      serviceType: ServiceType.AlwaysRun,
      broadcastMode: BroadcastMode.OnDemandPolling,
    });
    this.data = {};
  }

  setup() {
    super.setup();
  }

  publishData() {
    super.publishData();
  }
}
