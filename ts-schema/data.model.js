"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TsmControlData = exports.TsmData = exports.SystemStatsData = exports.ThermometerData = exports.VehicleSensorData = exports.VehicleInfoData = void 0;
var VehicleInfoData = /** @class */ (function () {
    function VehicleInfoData() {
        this.model = "";
        this.vin = "";
        this.year = 0;
        this.make = "";
        this.owner = "";
        this.plate = "";
        this.regId = "";
        this.oilDate = 0;
        this.oilInterval = 0;
        this.tireFrontInfo = "";
        this.tireRearInfo = "";
        this.tireFrontDate = 0;
        this.tireRearDate = 0;
        this.beltInfo = "";
        this.beltDate = 0;
        this.batteryInfo = "";
        this.batteryDate = 0;
        this.inspectDate = 0;
        this.inspectInterval = 0;
        this.serviceDate = 0;
        this.serviceInterval = 0;
    }
    return VehicleInfoData;
}());
exports.VehicleInfoData = VehicleInfoData;
var VehicleSensorData = /** @class */ (function () {
    function VehicleSensorData() {
    }
    return VehicleSensorData;
}());
exports.VehicleSensorData = VehicleSensorData;
var ThermometerData = /** @class */ (function () {
    function ThermometerData() {
    }
    return ThermometerData;
}());
exports.ThermometerData = ThermometerData;
var SystemStatsData = /** @class */ (function () {
    function SystemStatsData() {
    }
    return SystemStatsData;
}());
exports.SystemStatsData = SystemStatsData;
var TsmData = /** @class */ (function () {
    function TsmData() {
    }
    return TsmData;
}());
exports.TsmData = TsmData;
var TsmControlData = /** @class */ (function () {
    function TsmControlData() {
    }
    return TsmControlData;
}());
exports.TsmControlData = TsmControlData;
