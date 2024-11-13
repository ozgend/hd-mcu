"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MuxSettings = exports.TsmSettings = exports.TsmControlData = exports.TsmData = exports.SystemStatsData = exports.ThermometerData = exports.VehicleSensorData = exports.VehicleInfoData = void 0;
class VehicleInfoData {
    constructor() {
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
}
exports.VehicleInfoData = VehicleInfoData;
class VehicleSensorData {
    constructor() {
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
}
exports.VehicleSensorData = VehicleSensorData;
class ThermometerData {
    constructor() {
        this.ch_0 = 0;
        this.ch_1 = 0;
        this.ch_2 = 0;
        this.ch_3 = 0;
        this.ch_4 = 0;
        this.ch_5 = 0;
        this.ch_6 = 0;
        this.ch_7 = 0;
    }
}
exports.ThermometerData = ThermometerData;
class SystemStatsData {
    constructor() {
        this.arch = "";
        this.platform = "";
        this.version = "";
        this.name = "";
        this.uid = "";
        this.heapTotal = 0;
        this.heapUsed = 0;
        this.heapPeak = 0;
    }
}
exports.SystemStatsData = SystemStatsData;
class TsmData {
    constructor() {
        this.state = new TsmControlData();
        this.action = new TsmControlData();
    }
}
exports.TsmData = TsmData;
class TsmControlData {
    constructor() {
        this.left = false;
        this.right = false;
    }
}
exports.TsmControlData = TsmControlData;
class TsmSettings {
    constructor() {
        this.blinkRate = 0;
        this.blinkTimeout = 0;
        this.btnDebounce = 0;
        this.diagCount = 0;
        this.diagRate = 0;
    }
    static default(defaults) {
        const tsm = {
            blinkRate: defaults.blinkRate,
            blinkTimeout: defaults.blinkTimeout,
            btnDebounce: defaults.btnDebounce,
            diagCount: defaults.diagCount,
            diagRate: defaults.diagRate,
        };
        return tsm;
    }
}
exports.TsmSettings = TsmSettings;
class MuxSettings {
    constructor() {
        this.sensorItems = [];
        this.readInterval = 0;
        this.readBatchTimeout = 0;
    }
}
exports.MuxSettings = MuxSettings;
