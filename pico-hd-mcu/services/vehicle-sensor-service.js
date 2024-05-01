const { factorAdcValue } = require('../utils');
const BaseService = require('../base-service');
const { VehicleSensorData } = require('../../ts-schema/data.model');
const { ServiceCode, Gpio, ServiceType, Hardware, Broadcasting } = require('../../ts-schema/constants');

class VehicleSensorService extends BaseService {
  constructor(eventBus) {
    super(eventBus, {
      serviceCode: ServiceCode.VehicleSensor,
      serviceType: ServiceType.ON_DEMAND,
      broadcastMode: Broadcasting.OnDemandPolling,
    });
    this.data = new VehicleSensorData();
  }

  publishData() {
    this.data.uptime = millis();

    const rawTemp = analogRead(Gpio.VEHICLE_SENSOR_TEMP);
    this.data.raw_temp = rawTemp;
    this.data.temp = 27 - (factorAdcValue(rawTemp) - 0.706) / 0.001721;

    const rawBatt = analogRead(Gpio.VEHICLE_SENSOR_BATT);
    this.data.raw_batt = rawBatt;
    this.data.batt = factorAdcValue(rawBatt) / (Hardware.BATTERY_VOLTAGE_R2 / (Hardware.BATTERY_VOLTAGE_R1 + Hardware.BATTERY_VOLTAGE_R2));

    const rawRpm = analogRead(Gpio.VEHICLE_SENSOR_RPM);
    this.data.raw_rpm = rawRpm;
    this.data.rpm = factorAdcValue(rawRpm);

    const rawSpeed = analogRead(Gpio.VEHICLE_SENSOR_SPEED);
    this.data.raw_speed = rawSpeed;
    this.data.speed = factorAdcValue(rawSpeed);

    this.data.tireFront = 0;
    this.data.tireRear = 0;
    this.data.tempFront = 0;
    this.data.tempRear = 0;

    super.publishData();
  }
};

module.exports = VehicleSensorService;