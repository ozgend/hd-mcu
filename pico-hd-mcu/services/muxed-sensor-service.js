const MAX6675 = require("../lib/max6675-hw-spi");
const HC4051 = require("../lib/hc4051");
const { ServiceCode, Gpio, ServiceType, Broadcasting } = require("../constants");
const BaseService = require("../base-service");
const logger = require("../logger");
const { IMuxedSensorData } = require("../schema");

const _muxChannels = [0, 1, 2, 3];
let _readerPid = 0;
let _muxChIndex = 0;

class MuxedSensorService extends BaseService {
  constructor(eventBus) {
    super(eventBus, {
      serviceCode: ServiceCode.MuxSensor,
      serviceType: ServiceType.ON_DEMAND,
      broadcastMode: Broadcasting.OnDemandPolling,
    });
    this.data = IMuxedSensorData;
  }

  start() {
    super.start();
    super.publishData();

    _muxChannels.forEach((ch) => {
      this.data[`ch_${ch}`] = 0;
    });

    this.thermoSensor = new MAX6675({ bus: 1, cs: Gpio.THERMO_SENSOR_CS, sck: Gpio.THERMO_SENSOR_CLK, miso: Gpio.THERMO_SENSOR_DATA });
    this.thermoSensor.init();

    this.mux = new HC4051({ pinA: Gpio.MUX_OUT_A, pinB: Gpio.MUX_OUT_B, pinC: Gpio.MUX_OUT_C, connectedChannels: _muxChannels });
    this.mux.init();

    // start delayed read
    setTimeout(() => {
      _readerPid = setInterval(() => {
        this.mux.enableChannelIndex(_muxChIndex);
        this.data[`ch_${_muxChannels[_muxChIndex]}`] = this.thermoSensor.readCelcius() ?? 0;
        logger.debug(ServiceCode.MuxSensor, "interval.read", { ch: _muxChannels[_muxChIndex], cx: _muxChIndex, value: this.data[`ch_${_muxChannels[_muxChIndex]}`], values: this.data });
        _muxChIndex++;
        if (_muxChIndex >= _muxChannels.length) {
          _muxChIndex = 0;
        }
      }, 1000);
    }, 3000);
  }

  stop() {
    super.stop();
    clearInterval(_readerPid);
    _readerPid = 0;
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

module.exports = MuxedSensorService;
