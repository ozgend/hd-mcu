const { writeObject, readFile, isFileExist } = require('../utils');
const logger = require('../logger');
const BaseService = require('../base-service');
const { ServiceCode, ServiceType, Broadcasting, FILE_VHI_DATA } = require('../../ts-schema/constants');
const { VehicleInfoData } = require('../../ts-schema/data.model');

class VehicleInfoService extends BaseService {
  constructor(eventBus) {
    super(eventBus, {
      serviceCode: ServiceCode.VehicleInfo,
      serviceType: ServiceType.ON_DEMAND,
      broadcastMode: Broadcasting.OnDemandPolling,
    });
    this.data = new VehicleInfoData();
  }

  peristSettings(raw) {
    super.peristSettings(raw);
    this.setVehicleInfo(JSON.parse(raw));
  }

  setVehicleInfo(payload) {
    if (payload) {
      logger.debug(ServiceCode.VehicleInfo, 'setVehicleInfo payload:', payload);
    }
    else {
      logger.debug(ServiceCode.VehicleInfo, 'setVehicleInfo payload: null');
    }
    const currentVehicleInfo = this.getVehicleInfo();
    const newVehicleInfo = payload ? Object.assign(currentVehicleInfo, payload) : currentVehicleInfo;
    logger.debug(ServiceCode.VehicleInfo, 'setVehicleInfo newVehicleInfo:', newVehicleInfo);
    writeObject(FILE_VHI_DATA, newVehicleInfo);
  }

  getVehicleInfo() {
    if (isFileExist(FILE_VHI_DATA)) {
      const vehicleInfo = readFile(FILE_VHI_DATA);
      logger.debug(ServiceCode.VehicleInfo, 'getVehicleInfo vehicleInfo:', vehicleInfo);
      return JSON.parse(vehicleInfo);
    }
    return new VehicleInfoData();
  }

  setup() {
    if (!isFileExist(FILE_VHI_DATA)) {
      logger.debug(ServiceCode.VehicleInfo, 'setup vehicleInfoFile:', FILE_VHI_DATA);
      this.setVehicleInfo(new VehicleInfoData());
    }
    else {
      logger.debug(ServiceCode.VehicleInfo, 'setup vehicleInfoFile exists:', FILE_VHI_DATA);
    }
    super.setup();
  }

  publishData() {
    this.data = this.getVehicleInfo();
    super.publishData();
  }
};

module.exports = VehicleInfoService;