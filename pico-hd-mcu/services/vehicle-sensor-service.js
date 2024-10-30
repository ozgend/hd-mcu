const logger = require('../logger');
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

  setup() {
    super.setup();
    // pinMode(Gpio.VEHICLE_SENSOR_VREF, INPUT);
    // pinMode(Gpio.VEHICLE_SENSOR_TEMP, INPUT);
    pinMode(Gpio.VEHICLE_SENSOR_BATT, INPUT);
    pinMode(Gpio.VEHICLE_SENSOR_AUX, INPUT);
    pinMode(Gpio.VEHICLE_SENSOR_RPM, INPUT);
    pinMode(Gpio.VEHICLE_SENSOR_SPEED, INPUT);
    pinMode(Gpio.VEHICLE_SENSOR_IGN, INPUT);
  }

  publishData() {
    this.data.uptime = millis();

    this.data.raw_temp = analogRead(Gpio.VEHICLE_SENSOR_TEMP);
    this.data.raw_temp_volts = this.data.raw_temp * 3.3;
    this.data.temp = 27 - (this.data.raw_temp_volts - 0.706) / 0.001721;

    this.data.raw_vref = analogRead(Gpio.VEHICLE_SENSOR_VREF);
    this.data.vref = this.data.raw_vref * Hardware.ADC_SCALING_FACTOR;

    this.data.raw_batt = analogRead(Gpio.VEHICLE_SENSOR_BATT); // 0.6843261718 -> 12.18
    this.data.batt = (this.data.raw_batt * Hardware.ADC_REF_MAX_VOLTAGE) * (Hardware.BATTERY_VOLTAGE_R1 + Hardware.BATTERY_VOLTAGE_R2) / Hardware.BATTERY_VOLTAGE_R2;

    // todo: implement with harley davidson rpm sensor output voltage reference
    const rawRpm = analogRead(Gpio.VEHICLE_SENSOR_RPM);
    this.data.raw_rpm = rawRpm;
    this.data.rpm = rawRpm;

    // todo: implement with harley davidson speed sensor output voltage reference
    const rawSpeed = analogRead(Gpio.VEHICLE_SENSOR_SPEED);
    this.data.raw_speed = rawSpeed;
    this.data.speed = rawSpeed;

    this.data.tireFront = 0;
    this.data.tireRear = 0;
    this.data.tempFront = 0;
    this.data.tempRear = 0;

    super.publishData();
  }
};

module.exports = VehicleSensorService;