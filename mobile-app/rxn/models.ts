export interface IServiceState {}

export interface IOtaMetadata {
  appVersion: string;
  isMandatory: boolean;
  packageHash: string;
  packageSize: number;
  isFirstRun: boolean;
  label: string;
}

export interface IServiceStatusInfo {
  serviceCode: string;
  serviceType: string;
  updateInterval: number;
  idleTimeout: number;
  broadcastMode: string;
  status: string;
  isRunning: boolean;
}

export interface IVehicleSensorData extends IServiceState {
  temp?: number;
  batt?: number;
  rpm?: number;
  speed?: number;
}

export interface IMuxedSensorData extends IServiceState {
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

export interface IFieldInfo {
  title: string;
  unit?: string;
  type: 'number' | 'date' | 'string';
  precision?: number;
  available?: boolean;
  formatter?: (value: any) => string;
}

const SensorFieldInfo: { [key: string]: IFieldInfo } = {
  batt: {
    title: 'BATTERY',
    unit: 'V',
    type: 'number',
    precision: 2,
    available: true,
  },
  temp: {
    title: 'ONBOARD TEMP',
    unit: '°C',
    type: 'number',
    precision: 1,
    available: true,
  },
  rpm: { title: 'REVS', unit: 'rpm', type: 'number', available: true },
  speed: { title: 'SPEED', unit: 'km/h', type: 'number', available: true },
  ch_0: { title: 'CYLINDER 1', unit: '°C', type: 'number', available: true },
  ch_1: { title: 'CYLINDER 2', unit: '°C', type: 'number', available: true },
  ch_2: { title: 'EXHAUST 1', unit: '°C', type: 'number', available: true },
  ch_3: { title: 'EXHAUST 2', unit: '°C', type: 'number', available: true },
  ch_4: { title: 'OIL TANK', unit: '°C', type: 'number', available: true },
  ch_5: { title: 'REGULATOR', unit: '°C', type: 'number', available: true },
  ch_6: { title: 'CARBURETOR', unit: '°C', type: 'number', available: true },
  ch_7: { title: 'CH7_AUX', unit: '°C', type: 'number', available: true },
  arch: { title: 'ARCH', type: 'string' },
  platform: { title: 'PLATFORM', type: 'string' },
  version: { title: 'VERSION', type: 'string' },
  name: { title: 'NAME', type: 'string' },
  uid: { title: 'UID', type: 'string' },
  heapTotal: { title: 'MEM TOTAL', unit: 'b', type: 'number' },
  heapUsed: { title: 'MEM USED', unit: 'b', type: 'number' },
  heapPeak: { title: 'MEM PEAK', unit: 'b', type: 'number' },
  uptime: { title: 'UPTIME', type: 'date' },
  state: {
    title: 'TSM',
    type: 'string',
    formatter: (value: ITsmControlData) => `L: ${value.left}, R: ${value.right}`,
  },
};

const ServiceStatusFieldInfo: { [key: string]: IFieldInfo } = {
  serviceCode: { title: 'SERVICE', type: 'string' },
  serviceType: { title: 'TYPE', type: 'string' },
  updateInterval: { title: 'UPDATE-TO', unit: 'ms', type: 'number', available: false },
  idleTimeout: { title: 'IDLE-TO', unit: 'ms', type: 'number', available: false },
  broadcastMode: { title: 'BROADCAST', type: 'string' },
  status: { title: 'STATUS', type: 'string' },
};

export const getSensorFieldInfo = (fieldName: string): IFieldInfo | null => {
  const fi = SensorFieldInfo[fieldName];
  if (!fi) {
    return null;
  }
  fi.available = fi.available ?? true;
  if (fi.formatter) {
    return fi;
  }
  switch (fi.type) {
    case 'number':
      fi.formatter = (value: number) => (value ? value.toFixed(fi.precision ?? 0) : 'N/A');
      break;
    case 'date':
      fi.formatter = (value: number) => (value ? new Date(value).toISOString().split('T')[1].split('.')[0] : 'N/A');
      break;
    default:
      fi.formatter = (value: any) => value ?? 'N/A';
      break;
  }
  return fi;
};

export const getServiceStateFieldInfo = (fieldName: string): IFieldInfo => {
  return ServiceStatusFieldInfo[fieldName];
};

export const ServiceName = {
  MODULE: 'Module',
  TSM: 'Turn Signal Module',
  SYS: 'System',
  VHC: 'Vehicle',
  MUX: 'Thermometer',
  BUS: 'Event Bus',
  MAIN: 'Main',
  BEAT: 'Heartbeat',
};

export interface IServiceAttributes {
  title: string;
  icon: string;
  pollInterval?: number;
}

export const ServiceProperty: { [key: string]: IServiceAttributes } = {
  VHC: { title: 'Vehicle', icon: 'engine', pollInterval: 1000 },
  MUX: { title: 'Thermometer', icon: 'thermometer', pollInterval: 5000 },
  SYS: { title: 'System', icon: 'chip', pollInterval: 5000 },
  TSM: { title: 'Turn Signal', icon: 'arrow-left-right' },
};

export const BtDataServiceTypes = {
  Vehicle: 'VHC',
  MuxThermo: 'MUX',
  System: 'SYS',
  TurnSignalModule: 'TSM',
};

export const BtDataServiceCodeKeys = Object.keys(BtDataServiceTypes);
export const BtDataServiceCodeValues = Object.values(BtDataServiceTypes);
