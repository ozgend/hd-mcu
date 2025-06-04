/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { MAX6675 } from "../lib/max6675-hw-spi";
import { HC4051 } from "../lib/hc4051";
import { Logging } from "../logger";
import { BaseService } from "../base-service";
import { ThermometerData } from "../../../ts-schema/data.model";
import { ServiceCode, Gpio, ServiceType, BroadcastMode, Hardware } from "../../../ts-schema/constants";
import { IEventBus } from "../event-bus";

const _muxChannels = Hardware.MUX_SENSOR_CONNECTED_ITEMS;
let _readerPid: number | null = null;
let _muxChIndex = 0;

export class ThermometerService extends BaseService<ThermometerData> {
  private thermoSensor: MAX6675 | undefined;
  private mux: HC4051 | undefined;

  constructor(eventBus: IEventBus) {
    super(eventBus, {
      serviceCode: ServiceCode.Thermometer,
      serviceType: ServiceType.OnDemand,
      broadcastMode: BroadcastMode.OnDemandPolling,
    });
    this.data = new ThermometerData();
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
        if (this.mux && this.thermoSensor) {
          this.mux.enableChannelIndex(_muxChIndex);
          this.data[`ch_${_muxChannels[_muxChIndex]}`] = this.thermoSensor.readCelcius() ?? 0;
          Logging.debug(ServiceCode.Thermometer, "interval.read", { ch: _muxChannels[_muxChIndex], cx: _muxChIndex, value: this.data[`ch_${_muxChannels[_muxChIndex]}`], values: this.data });
          _muxChIndex++;
          if (_muxChIndex >= _muxChannels.length) {
            _muxChIndex = 0;
          }
        }
      }, Hardware.MUX_SENSOR_READ_INTERVAL);
    }, Hardware.MUX_SENSOR_READ_BATCH_TIMEOUT);
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
