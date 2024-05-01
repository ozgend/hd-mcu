const fs = require('fs');
const logger = require('../logger');
const BaseService = require('../base-service');
const { ServiceCode, ServiceType, Broadcasting } = require('../constants');
const { VehicleInfoData } = require('../../ts-schema/data.model');

const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();
const vehicleInfoFile = 'vehicle.json';

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
    fs.writeFile(vehicleInfoFile, textEncoder.encode(JSON.stringify(newVehicleInfo)));
  }

  getVehicleInfo() {
    if (fs.exists(vehicleInfoFile)) {
      const vehicleInfo = textDecoder.decode(fs.readFile(vehicleInfoFile));
      logger.debug(ServiceCode.VehicleInfo, 'getVehicleInfo vehicleInfo:', vehicleInfo);
      return JSON.parse(vehicleInfo);
    }
    return new VehicleInfoData();
  }

  setup() {
    if (!fs.exists(vehicleInfoFile)) {
      logger.debug(ServiceCode.VehicleInfo, 'setup vehicleInfoFile:', vehicleInfoFile);
      this.setVehicleInfo(new VehicleInfoData());
    }
    else {
      logger.debug(ServiceCode.VehicleInfo, 'setup vehicleInfoFile exists:', vehicleInfoFile);
    }
    super.setup();
  }

  publishData() {
    this.data = this.getVehicleInfo();
    super.publishData();
  }
};

module.exports = VehicleInfoService;