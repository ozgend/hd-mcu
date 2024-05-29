import { IMuxSettings, ISystemStatsData, IThermometerData, ITsmControlData, ITsmData, ITsmSettings, IVehicleInfoData, IVehicleSensorData } from "./data.interface";

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
  vref?: number;
  batt?: number;
  rpm?: number;
  speed?: number;
  tireFront?: number;
  tempFront?: number;
  tireRear?: number;
  tempRear?: number;
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

export class ThermometerData implements IThermometerData {
  ch_0?: number;
  ch_1?: number;
  ch_2?: number;
  ch_3?: number;
  ch_4?: number;
  ch_5?: number;
  ch_6?: number;
  ch_7?: number;
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

export class SystemStatsData implements ISystemStatsData {
  arch?: string;
  platform?: string;
  version?: string;
  name?: string;
  uid?: string;
  heapTotal?: number;
  heapUsed?: number;
  heapPeak?: number;
  uptime?: number;
  constructor() {
    this.arch = "";
    this.platform = "";
    this.version = "";
    this.name = "";
    this.uid = "";
    this.heapTotal = 0;
    this.heapUsed = 0;
    this.heapPeak = 0;
    this.uptime = 0;
  }
}

export class TsmData implements ITsmData {
  state?: ITsmControlData;
  action?: ITsmControlData;
  constructor() {
    this.state = new TsmControlData();
    this.action = new TsmControlData();
  }
}

export class TsmControlData implements ITsmControlData {
  left: boolean;
  right: boolean;
  constructor() {
    this.left = false;
    this.right = false;
  }
}

export class TsmSettings implements ITsmSettings {
  btnDebounce: number;
  blinkRate: number;
  blinkTimeout: number;
  diagRate: number;
  diagCount: number;
  constructor() {
    this.btnDebounce = 0;
    this.blinkRate = 0;
    this.blinkTimeout = 0;
    this.diagRate = 0;
    this.diagCount = 0;
  }
}

export class MuxSettings implements IMuxSettings {
  sensorItems: number[];
  readInterval: number;
  readBatchTimeout: number;
  constructor() {
    this.sensorItems = [];
    this.readInterval = 0;
    this.readBatchTimeout = 0;
  }
}
