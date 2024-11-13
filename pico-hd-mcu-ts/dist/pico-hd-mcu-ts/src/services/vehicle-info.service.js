"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleInfoService = void 0;
const utils_1 = require("../utils");
const constants_1 = require("../../../ts-schema/constants");
const data_model_1 = require("../../../ts-schema/data.model");
const base_service_1 = require("../base-service");
const logger_1 = require("../logger");
class VehicleInfoService extends base_service_1.BaseService {
    constructor(eventBus) {
        super(eventBus, {
            serviceCode: constants_1.ServiceCode.VehicleInfo,
            serviceType: constants_1.ServiceType.OnDemand,
            broadcastMode: constants_1.BroadcastMode.OnDemandPolling,
        });
        this.data = new data_model_1.VehicleInfoData();
    }
    peristSettings(raw) {
        super.peristSettings(raw);
        this.setVehicleInfo(JSON.parse(raw));
    }
    setVehicleInfo(payload) {
        if (payload) {
            logger_1.Logging.debug(constants_1.ServiceCode.VehicleInfo, "setVehicleInfo payload:", payload);
        }
        else {
            logger_1.Logging.debug(constants_1.ServiceCode.VehicleInfo, "setVehicleInfo payload: null");
        }
        const currentVehicleInfo = this.getVehicleInfo();
        const newVehicleInfo = payload ? Object.assign(currentVehicleInfo, payload) : currentVehicleInfo;
        logger_1.Logging.debug(constants_1.ServiceCode.VehicleInfo, "setVehicleInfo newVehicleInfo:", newVehicleInfo);
        (0, utils_1.writeObject)(constants_1.FILE_VHI_DATA, newVehicleInfo);
    }
    getVehicleInfo() {
        if ((0, utils_1.isFileExist)(constants_1.FILE_VHI_DATA)) {
            const vehicleInfo = (0, utils_1.readFile)(constants_1.FILE_VHI_DATA);
            logger_1.Logging.debug(constants_1.ServiceCode.VehicleInfo, "getVehicleInfo vehicleInfo:", vehicleInfo);
            return JSON.parse(vehicleInfo);
        }
        return new data_model_1.VehicleInfoData();
    }
    setup() {
        if (!(0, utils_1.isFileExist)(constants_1.FILE_VHI_DATA)) {
            logger_1.Logging.debug(constants_1.ServiceCode.VehicleInfo, "setup vehicleInfoFile:", constants_1.FILE_VHI_DATA);
            this.setVehicleInfo(new data_model_1.VehicleInfoData());
        }
        else {
            logger_1.Logging.debug(constants_1.ServiceCode.VehicleInfo, "setup vehicleInfoFile exists:", constants_1.FILE_VHI_DATA);
        }
        super.setup();
    }
    publishData() {
        this.data = this.getVehicleInfo();
        super.publishData();
    }
}
exports.VehicleInfoService = VehicleInfoService;
