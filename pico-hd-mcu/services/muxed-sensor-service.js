const MAX6675 = require('../lib/max6675');
const HC4051 = require('../lib/hc4051');
const { ServiceCode, Gpio, ServiceType, Hardware } = require('../constants');
const BaseService = require('../base-service');
const logger = require('../logger');

let _readerPid = 0;

class MuxedSensorService extends BaseService {
  constructor(eventBus) {
    super(ServiceCode.MuxSensor, ServiceType.ON_DEMAND, 1000, eventBus);
  }

  setup() {
    this.data.values = Array.from({ length: Hardware.MUX_SENSOR_CONNECTED_COUNT }, () => -1);
  }

  start() {
    super.start();

    this.thermoSensor = new MAX6675(Gpio.THERMO_SENSOR_CLK, Gpio.THERMO_SENSOR_CS, Gpio.THERMO_SENSOR_DATA);
    this.thermoSensor.init();

    this.mux = new HC4051({ pinA: Gpio.MUX_OUT_A, pinB: Gpio.MUX_OUT_B, pinC: Gpio.MUX_OUT_C, connectedChannels: [0, 1, 2, 3] });
    this.mux.init();

    _readerPid = setInterval(() => {
      for (let i = 0; i < Hardware.MUX_SENSOR_CONNECTED_COUNT; i++) {
        this.mux.enableChannel(i);
        this.data.values[i] = this.thermoSensor.readCelcius();
        logger.debug(ServiceCode.MuxSensor, 'interval.read', this.data.values);
      }
    }, 150);
  }

  stop() {
    super.stop();
    clearInterval(_readerPid);
    delete this.thermoSensor;
    delete this.mux;
  }

  update() {
    super.update();
  }
};

module.exports = MuxedSensorService;