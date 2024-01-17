export interface ISensorViewProps<IProvider> {
  provider: IProvider;
  serviceName: string;
}

export interface ISensorViewStateData<TSensorData> {
  data: TSensorData;
  isRunning?: boolean;
}

export interface IServiceState {}

export interface IOtaMetadata {
  appVersion: string;
  isMandatory: boolean;
  packageHash: string;
  packageSize: number;
  isFirstRun: boolean;
  label: string;
}

export interface IDeviceSensorData extends IServiceState {
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

const FieldInfo: {[key: string]: IFieldInfo} = {
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
  rpm: {title: 'REVS', unit: 'rpm', type: 'number', available: true},
  speed: {title: 'SPEED', unit: 'km/h', type: 'number', available: true},
  ch_0: {title: 'CYLINDER 1', unit: '°C', type: 'number', available: true},
  ch_1: {title: 'CYLINDER 2', unit: '°C', type: 'number', available: true},
  ch_2: {title: 'EXHAUST 1', unit: '°C', type: 'number', available: true},
  ch_3: {title: 'EXHAUST 2', unit: '°C', type: 'number', available: true},
  ch_4: {title: 'OIL TNK', unit: '°C', type: 'number', available: true},
  ch_5: {title: 'REGULATOR', unit: '°C', type: 'number', available: true},
  ch_6: {title: 'CARBURATOR', unit: '°C', type: 'number', available: true},
  ch_7: {title: 'CH7_UNC', unit: '°C', type: 'number', available: true},
  arch: {title: 'ARCH', type: 'string'},
  platform: {title: 'PLATFORM', type: 'string'},
  version: {title: 'VERSION', type: 'string'},
  name: {title: 'NAME', type: 'string'},
  uid: {title: 'UID', type: 'string'},
  heapTotal: {title: 'MEM', unit: 'b', type: 'number'},
  heapUsed: {title: 'MEM USED', unit: 'b', type: 'number'},
  heapPeak: {title: 'MEM PEAK', unit: 'b', type: 'number'},
  rtc: {title: 'UPTIME', type: 'date'},
  state: {
    title: 'TSM',
    type: 'string',
    formatter: (value: ITsmControlData) =>
      `L: ${value.left}, R: ${value.right}`,
  },
};

export const getFieldInfo = (fieldName: string): IFieldInfo | null => {
  const fi = FieldInfo[fieldName];
  if (!fi) {
    return null;
  }
  fi.available = fi.available ?? true;
  if (fi.formatter) {
    return fi;
  }
  switch (fi.type) {
    case 'number':
      fi.formatter = (value: number) => value.toFixed(fi.precision ?? 0);
      break;
    case 'date':
      fi.formatter = (value: number) =>
        new Date(value).toISOString().split('T')[1].split('.')[0];
      break;
    default:
      fi.formatter = (value: any) => value;
      break;
  }
  return fi;
};

export const BtDataServiceTypes = {
  DEV: 'DEV',
  MUX: 'MUX',
  SYS: 'SYS',
  TSM: 'TSM',
};

export type BtDataServiceKey = keyof typeof BtDataServiceTypes;
