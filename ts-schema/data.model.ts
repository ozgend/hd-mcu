import { ISystemStatsData, IThermometerData, ITsmControlData, ITsmData, IVehicleInfoData, IVehicleSensorData } from "./data.interface";

export class VehicleInfoData implements IVehicleInfoData {
  model: string;
  vin: string;
  year: number;
  make: string;
  owner: string;
  plate: string;
  regId: string;
  oilDate: number;
  oilKm: number;
  oilIntervalKm: number;
  tireFrontInfo: string;
  tireRearInfo: string;
  tireFrontDate: number;
  tireRearDate: number;
  tireFrontKm: number;
  tireRearKm: number;
  beltInfo: string;
  beltDate: number;
  batteryInfo: string;
  batteryDate: number;
  inspectDate: number;
  insuranceDate: number;
  serviceDate: number;
  serviceKm: number;
  serviceInterval: number;
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

export class VehicleSensorData implements IVehicleSensorData {
  temp?: number;
  batt?: number;
  rpm?: number;
  speed?: number;
  tireFront?: number;
  tempFront?: number;
  tireRear?: number;
  tempRear?: number;
}

export class ThermometerData implements IThermometerData {
  ch_0?: number;
  ch_1?: number;
  ch_2?: number;
  ch_3?: number;
  ch_4?: number;
  ch_5?: number;
  ch_6?: number;
  ch_7?: number;
}

export class SystemStatsData implements ISystemStatsData {
  arch?: string;
  platform?: string;
  version?: string;
  name?: string;
  uid?: string;
  heapTotal?: number;
  heapUsed?: number;
  heapPeak?: number;
  rtc?: number;
}

export class TsmData implements ITsmData {
  state?: ITsmControlData;
  action?: ITsmControlData;
}

export class TsmControlData implements ITsmControlData {
  left: boolean;
  right: boolean;
}
