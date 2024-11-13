"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThermometerService = void 0;
const max6675_hw_spi_1 = require("../lib/max6675-hw-spi");
const hc4051_1 = require("../lib/hc4051");
const logger_1 = require("../logger");
const base_service_1 = require("../base-service");
const data_model_1 = require("../../../ts-schema/data.model");
const constants_1 = require("../../../ts-schema/constants");
const _muxChannels = constants_1.Hardware.MUX_SENSOR_CONNECTED_ITEMS;
let _readerPid = null;
let _muxChIndex = 0;
class ThermometerService extends base_service_1.BaseService {
    constructor(eventBus) {
        super(eventBus, {
            serviceCode: constants_1.ServiceCode.Thermometer,
            serviceType: constants_1.ServiceType.OnDemand,
            broadcastMode: constants_1.BroadcastMode.OnDemandPolling,
        });
        this.data = new data_model_1.ThermometerData();
    }
    start() {
        super.start();
        super.publishData();
        _muxChannels.forEach((ch) => {
            this.data[`ch_${ch}`] = 0;
        });
        this.thermoSensor = new max6675_hw_spi_1.MAX6675({ bus: 1, cs: constants_1.Gpio.THERMO_SENSOR_CS, sck: constants_1.Gpio.THERMO_SENSOR_CLK, miso: constants_1.Gpio.THERMO_SENSOR_DATA });
        this.thermoSensor.init();
        this.mux = new hc4051_1.HC4051({ pinA: constants_1.Gpio.MUX_OUT_A, pinB: constants_1.Gpio.MUX_OUT_B, pinC: constants_1.Gpio.MUX_OUT_C, connectedChannels: _muxChannels });
        this.mux.init();
        // start delayed read
        setTimeout(() => {
            _readerPid = setInterval(() => {
                var _a;
                if (this.mux && this.thermoSensor) {
                    this.mux.enableChannelIndex(_muxChIndex);
                    this.data[`ch_${_muxChannels[_muxChIndex]}`] = (_a = this.thermoSensor.readCelcius()) !== null && _a !== void 0 ? _a : 0;
                    logger_1.Logging.debug(constants_1.ServiceCode.Thermometer, "interval.read", { ch: _muxChannels[_muxChIndex], cx: _muxChIndex, value: this.data[`ch_${_muxChannels[_muxChIndex]}`], values: this.data });
                    _muxChIndex++;
                    if (_muxChIndex >= _muxChannels.length) {
                        _muxChIndex = 0;
                    }
                }
            }, constants_1.Hardware.MUX_SENSOR_READ_INTERVAL);
        }, constants_1.Hardware.MUX_SENSOR_READ_BATCH_TIMEOUT);
    }
    stop() {
        super.stop();
        if (_readerPid) {
            clearInterval(_readerPid);
            _readerPid = null;
        }
        _muxChIndex = 0;
        if (this.thermoSensor) {
            this.thermoSensor.close();
            delete this.thermoSensor;
            delete this.mux;
        }
    }
    publishData() {
        super.publishData();
    }
}
exports.ThermometerService = ThermometerService;
