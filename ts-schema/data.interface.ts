export interface IServiceState {}

export interface IServiceStatusInfo {
  serviceCode: string;
  serviceType: string;
  commands: string[];
  updateInterval: number;
  idleTimeout: number;
  broadcastMode: string;
  status: string;
  isRunning: boolean;
  schemaVersion: string;
}

export interface IVehicleInfoData {
  make: string;
  model: string;
  year: number;
  owner: string;
  vin: string;
  regId: string;
  plate: string;
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
}

export interface IVehicleSensorData extends IServiceState {
  temp?: number;
  vref?: number;
  batt?: number;
  rpm?: number;
  speed?: number;
  uptime?: number;
  tireFront?: number;
  tempFront?: number;
  tireRear?: number;
  tempRear?: number;
}

export interface IThermometerData extends IServiceState {
  ch_0?: number;
  ch_1?: number;
  ch_2?: number;
  ch_3?: number;
  ch_4?: number;
  ch_5?: number;
  ch_6?: number;
  ch_7?: number;
}

export interface ISystemStatsData extends IServiceState {
  arch?: string;
  platform?: string;
  version?: string;
  name?: string;
  uid?: string;
  heapTotal?: number;
  heapUsed?: number;
  heapPeak?: number;
}

export interface ITsmData extends IServiceState {
  state?: ITsmControlData;
  action?: ITsmControlData;
}

export interface ITsmControlData {
  left: boolean;
  right: boolean;
}

export interface IThrottleData {
  inputThrottleAdcValues: Uint16Array;
  inputThrottleAdcRunningSum: number;
  inputThrottleAdcSampleIndex: number;
  filteredThrottleAdcValue: number;
  filteredThrottleAdcValuePrevious: number;
  throttleServoAngleFinal: number;
}

export interface ITsmSettings {
  btnDebounce: number;
  blinkRate: number;
  blinkTimeout: number;
  diagRate: number;
  diagCount: number;
}

export interface ITcmSettings {
  throttleAdcMin: number;
  throttleAdcMax: number;
  throttleChangeThreshold: number;
  throttleSamplingCount: number;
  throttleSamplingIntervalMs: number;
  throttleServoSpeed: number;
  throttleServoMinAngle: number;
  throttleServoMaxAngle: number;
}

export interface IMuxSettings {
  sensorItems: number[];
  readInterval: number;
  readBatchTimeout: number;
}

export interface HdMcuSettings {
  [key: string]: string | number | boolean;
}
