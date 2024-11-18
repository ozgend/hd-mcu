"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MuxSettings = exports.TsmSettings = exports.TsmControlData = exports.TsmData = exports.SystemStatsData = exports.ThermometerData = exports.VehicleSensorData = exports.VehicleInfoData = void 0;
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
        this.oilKm = 0;
        this.oilIntervalKm = 0;
        this.tireFrontInfo = "";
        this.tireRearInfo = "";
        this.tireFrontDate = 0;
        this.tireRearDate = 0;
        this.tireFrontKm = 0;
        this.tireRearKm = 0;
        this.beltInfo = "";
        this.beltDate = 0;
        this.batteryInfo = "";
        this.batteryDate = 0;
        this.inspectDate = 0;
        this.insuranceDate = 0;
        this.serviceDate = 0;
        this.serviceInterval = 0;
    }
    return VehicleInfoData;
}());
exports.VehicleInfoData = VehicleInfoData;
var VehicleSensorData = /** @class */ (function () {
    function VehicleSensorData() {
        this.temp = 0;
        this.vref = 0;
        this.batt = 0;
        this.rpm = 0;
        this.speed = 0;
        this.tireFront = 0;
        this.tempFront = 0;
        this.tireRear = 0;
        this.tempRear = 0;
    }
    return VehicleSensorData;
}());
exports.VehicleSensorData = VehicleSensorData;
var ThermometerData = /** @class */ (function () {
    function ThermometerData() {
        this.ch_0 = 0;
        this.ch_1 = 0;
        this.ch_2 = 0;
        this.ch_3 = 0;
        this.ch_4 = 0;
        this.ch_5 = 0;
        this.ch_6 = 0;
        this.ch_7 = 0;
    }
    return ThermometerData;
}());
exports.ThermometerData = ThermometerData;
var SystemStatsData = /** @class */ (function () {
    function SystemStatsData() {
        this.arch = "";
        this.platform = "";
        this.version = "";
        this.name = "";
        this.uid = "";
        this.heapTotal = 0;
        this.heapUsed = 0;
        this.heapPeak = 0;
    }
    return SystemStatsData;
}());
exports.SystemStatsData = SystemStatsData;
var TsmData = /** @class */ (function () {
    function TsmData() {
        this.state = new TsmControlData();
        this.action = new TsmControlData();
    }
    return TsmData;
}());
exports.TsmData = TsmData;
var TsmControlData = /** @class */ (function () {
    function TsmControlData() {
        this.left = false;
        this.right = false;
    }
    return TsmControlData;
}());
exports.TsmControlData = TsmControlData;
var TsmSettings = /** @class */ (function () {
    function TsmSettings() {
        this.blinkRate = 0;
        this.blinkTimeout = 0;
        this.btnDebounce = 0;
        this.diagCount = 0;
        this.diagRate = 0;
    }
    TsmSettings.default = function (defaults) {
        var tsm = {
            blinkRate: defaults.blinkRate,
            blinkTimeout: defaults.blinkTimeout,
            btnDebounce: defaults.btnDebounce,
            diagCount: defaults.diagCount,
            diagRate: defaults.diagRate,
        };
        return tsm;
    };
    return TsmSettings;
}());
exports.TsmSettings = TsmSettings;
var MuxSettings = /** @class */ (function () {
    function MuxSettings() {
        this.sensorItems = [];
        this.readInterval = 0;
        this.readBatchTimeout = 0;
    }
    return MuxSettings;
}());
exports.MuxSettings = MuxSettings;
