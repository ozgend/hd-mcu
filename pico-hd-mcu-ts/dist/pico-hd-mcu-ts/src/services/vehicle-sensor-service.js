"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleSensorService = void 0;
const base_service_1 = require("../base-service");
const constants_1 = require("../../../ts-schema/constants");
const data_model_1 = require("../../../ts-schema/data.model");
const BATTERY_VOLTAGE_SCALING_FACTOR = (constants_1.Hardware.BATTERY_VOLTAGE_R1 + constants_1.Hardware.BATTERY_VOLTAGE_R2) / constants_1.Hardware.BATTERY_VOLTAGE_R2;
class VehicleSensorService extends base_service_1.BaseService {
    constructor(eventBus) {
        super(eventBus, {
            serviceCode: constants_1.ServiceCode.VehicleSensor,
            serviceType: constants_1.ServiceType.OnDemand,
            broadcastMode: constants_1.BroadcastMode.OnDemandPolling,
        });
        this.rpmSignalCounter = 0;
        this.rpmSignalLastTime = 0;
        this.data = new data_model_1.VehicleSensorData();
    }
    start() {
        super.start();
        attachInterrupt(constants_1.Gpio.VEHICLE_SENSOR_RPM, this.interruptRpmHandler.bind(this), RISING);
    }
    stop() {
        super.stop();
        detachInterrupt(constants_1.Gpio.VEHICLE_SENSOR_RPM);
    }
    interruptRpmHandler() {
        this.rpmSignalCounter++;
        console.log("rpm signal counter", this.rpmSignalCounter);
    }
    calculateRpm() {
        this.data.rpm = -1;
        const currentTime = millis();
        const deltaTime = currentTime - this.rpmSignalLastTime;
        if (deltaTime > 0) {
            this.data.rpm = (this.rpmSignalCounter / deltaTime) * 1000 * 60;
        }
        this.rpmSignalCounter = 0;
        this.rpmSignalLastTime = currentTime;
    }
    calculateSpeed() {
        this.data.speed = -1;
    }
    calculateTpmsData() {
        this.data.tireFront = -1;
        this.data.tireRear = -1;
        this.data.tempFront = -1;
        this.data.tempRear = -1;
    }
    calculateTemperature() {
        const raw_temp = analogRead(constants_1.Gpio.VEHICLE_SENSOR_TEMP);
        const raw_temp_volts = raw_temp * constants_1.Hardware.ADC_REF_MAX_VOLTAGE;
        this.data.temp = constants_1.Hardware.TEMPERATURE_OFFSET - (raw_temp_volts - constants_1.Hardware.ADC_OFFSET_VOLTAGE) / constants_1.Hardware.TEMPERATURE_SCALING_FACTOR;
    }
    calculateVref() {
        const raw_vref = analogRead(constants_1.Gpio.VEHICLE_SENSOR_VREF);
        this.data.vref = raw_vref * constants_1.Hardware.ADC_SCALING_FACTOR;
    }
    calculateBattery() {
        const raw_batt = analogRead(constants_1.Gpio.VEHICLE_SENSOR_BATT);
        this.data.batt = raw_batt * constants_1.Hardware.ADC_REF_MAX_VOLTAGE * BATTERY_VOLTAGE_SCALING_FACTOR;
    }
    setup() {
        super.setup();
        pinMode(constants_1.Gpio.VEHICLE_SENSOR_BATT, INPUT);
        pinMode(constants_1.Gpio.VEHICLE_SENSOR_AUX, INPUT);
        pinMode(constants_1.Gpio.VEHICLE_SENSOR_RPM, INPUT);
        pinMode(constants_1.Gpio.VEHICLE_SENSOR_SPEED, INPUT);
        pinMode(constants_1.Gpio.VEHICLE_SENSOR_IGN, INPUT);
    }
    publishData() {
        this.data.uptime = millis();
        this.calculateTemperature();
        this.calculateVref();
        this.calculateBattery();
        this.calculateRpm();
        this.calculateSpeed();
        this.calculateTpmsData();
        super.publishData();
    }
}
exports.VehicleSensorService = VehicleSensorService;
