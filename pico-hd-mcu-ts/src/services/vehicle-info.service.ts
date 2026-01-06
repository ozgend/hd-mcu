import { writeObject, readFile, isFileExist } from "../utils";
import { ServiceCode, ServiceType, BroadcastMode, FILE_VHI_DATA } from "../../../ts-schema/constants";
import { VehicleInfoData } from "../../../ts-schema/data.model";
import { IEventBus } from "../event-bus";
import { BaseService } from "../base-service";
import { Logging } from "../logger";

export class VehicleInfoService extends BaseService<VehicleInfoData> {
  constructor(eventBus: IEventBus) {
    super(eventBus, {
      serviceCode: ServiceCode.VehicleInfo,
      serviceType: ServiceType.OnDemand,
      broadcastMode: BroadcastMode.OnDemandPolling,
    });
    this.data = new VehicleInfoData();
  }

  peristSettings(raw: string): void {
    super.peristSettings(raw);
    this.setVehicleInfo(JSON.parse(raw));
  }

  setVehicleInfo(payload: Partial<VehicleInfoData> | null): void {
    if (payload) {
      Logging.debug(ServiceCode.VehicleInfo, "setVehicleInfo payload:", payload);
    } else {
      Logging.debug(ServiceCode.VehicleInfo, "setVehicleInfo payload: null");
    }
    const currentVehicleInfo = this.getVehicleInfo();
    const newVehicleInfo = payload ? Object.assign(currentVehicleInfo, payload) : currentVehicleInfo;
    Logging.debug(ServiceCode.VehicleInfo, "setVehicleInfo newVehicleInfo:", newVehicleInfo);
    writeObject(FILE_VHI_DATA, newVehicleInfo);
  }

  getVehicleInfo(): VehicleInfoData {
    if (isFileExist(FILE_VHI_DATA)) {
      const vehicleInfo = readFile(FILE_VHI_DATA);
      Logging.debug(ServiceCode.VehicleInfo, "getVehicleInfo vehicleInfo:", vehicleInfo);
      return JSON.parse(vehicleInfo);
    }
    return new VehicleInfoData();
  }

  setup(): void {
    if (!isFileExist(FILE_VHI_DATA)) {
      Logging.debug(ServiceCode.VehicleInfo, "setup vehicleInfoFile create:", FILE_VHI_DATA);
      this.setVehicleInfo(new VehicleInfoData());
    } else {
      Logging.debug(ServiceCode.VehicleInfo, "setup vehicleInfoFile exists:", FILE_VHI_DATA);
    }
    super.setup();
  }

  publishData(): void {
    this.data = this.getVehicleInfo();
    super.publishData();
  }
}
