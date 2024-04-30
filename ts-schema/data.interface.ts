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
}

export interface IVehicleInfoData {
  model: string;
  vin: string;
  year: number;
  make: string;
  owner: string;
  plate: string;
  regId: string;
  oilDate: number;
  oilInterval: number;
  tireFrontInfo: string;
  tireRearInfo: string;
  tireFrontDate: number;
  tireRearDate: number;
  beltInfo: string;
  beltDate: number;
  batteryInfo: string;
  batteryDate: number;
  inspectDate: number;
  inspectInterval: number;
  serviceDate: number;
  serviceInterval: number;
}

export interface IVehicleSensorData extends IServiceState {
  temp?: number;
  batt?: number;
  rpm?: number;
  speed?: number;
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
  rtc?: number;
}

export interface ITsmData extends IServiceState {
  state?: ITsmControlData;
  action?: ITsmControlData;
}

export interface ITsmControlData {
  left: boolean;
  right: boolean;
}
