const MAX6675 = require('../lib/max6675-hw-spi');
const HC4051 = require('../lib/hc4051');
const { ServiceCode, Gpio, ServiceType, Hardware } = require('../constants');
const BaseService = require('../base-service');
const logger = require('../logger');

let _readerPid = 0;
let _muxCh = 0;
let _values = Array.from({ length: Hardware.MUX_SENSOR_CONNECTED_COUNT }, () => -1);

class MuxedSensorService extends BaseService {
  constructor(eventBus) {
    super(ServiceCode.MuxSensor, ServiceType.ON_DEMAND, 2000, eventBus);
  }

  setup() {
    super.setup();
  }

  start() {
    super.start();
    this.thermoSensor = new MAX6675({ bus: 1, cs: Gpio.THERMO_SENSOR_CS, sck: Gpio.THERMO_SENSOR_CLK, miso: Gpio.THERMO_SENSOR_DATA });
    this.thermoSensor.init();
    // this.mux = new HC4051({ pinA: Gpio.MUX_OUT_A, pinB: Gpio.MUX_OUT_B, pinC: Gpio.MUX_OUT_C, connectedChannels: [0, 1, 2, 3] });
    // this.mux.init();    
    _readerPid = setInterval(() => {
      //this.mux.enableChannel(_muxCh);
      _values[_muxCh] = this.thermoSensor.readCelcius();
      logger.debug(ServiceCode.MuxSensor, 'interval.read', { ch: _muxCh, value: _values[_muxCh], values: _values });
      // _muxCh++;
      // if (_muxCh >= Hardware.MUX_SENSOR_CONNECTED_COUNT) {
      //   _muxCh = 0;
      // }
    }, 2000);
  }

  stop() {
    super.stop();
    clearInterval(_readerPid);
    this.thermoSensor.close();
    delete this.thermoSensor;
    delete this.mux;
  }

  update() {
    this.data.values = _values;
    super.update();
  }
};

module.exports = MuxedSensorService;