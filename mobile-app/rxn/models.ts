import { ISystemStatsData, IThermometerData, ITsmData, IVehicleInfoData, IVehicleSensorData } from '../../ts-schema/data.interface';

export interface IField {
  order?: number;
  title: string;
  unit?: string;
  type: 'number' | 'date' | 'time' | 'string' | 'array';
  precision?: number;
  available?: boolean;
  formatter?: (value: any) => string;
}

export const ServiceDataFields: { [key: string]: { [key: string]: IField } } = {
  VHI: {
    make: { title: 'MAKE', type: 'string', order: 1 },
    model: { title: 'MODEL', type: 'string', order: 2 },
    year: { title: 'YEAR', type: 'number', order: 3 },
    owner: { title: 'OWNER', type: 'string', order: 4 },
    vin: { title: 'VIN', type: 'string', order: 5 },
    regId: { title: 'REG ID', type: 'string', order: 6 },
    plate: { title: 'PLATE', type: 'string', order: 7 },
    oilDate: { title: 'OIL DATE', type: 'date', order: 101 },
    oilKm: { title: 'OIL KM', unit: 'km', type: 'number', order: 102 },
    oilIntervalKm: { title: 'OIL INT', unit: 'km', type: 'number', order: 103 },
    tireFrontInfo: { title: 'FR TIRE', type: 'string', order: 104 },
    tireRearInfo: { title: 'RR TIRE', type: 'string', order: 105 },
    tireFrontDate: { title: 'FR TIRE DATE', type: 'date', order: 106 },
    tireRearDate: { title: 'RR TIRE DATE', type: 'date', order: 107 },
    tireFrontKm: { title: 'FR TIRE KM', type: 'number', order: 108 },
    tireRearKm: { title: 'RR TIRE KM', type: 'number', order: 109 },
    beltInfo: { title: 'BELT TYPE', type: 'string', order: 110 },
    beltDate: { title: 'BELT DATE', type: 'date', order: 111 },
    batteryInfo: { title: 'BATTERY TYPE', type: 'string', order: 112 },
    batteryDate: { title: 'BATTERY DATE', type: 'date', order: 113 },
    inspectDate: { title: 'INSPECT DATE', type: 'date', order: 201 },
    insuranceDate: { title: 'INSURANCE DATE', type: 'date', order: 202 },
    serviceDate: { title: 'SERVICE DATE', type: 'date', order: 203 },
    serviceKm: { title: 'SERVICE KM', unit: 'km', type: 'number', order: 204 },
  },
  VHC: {
    temp: { title: 'MCU TEMP', unit: '°C', type: 'number', precision: 1, order: 1 },
    batt: { title: 'BATTERY', unit: 'V', type: 'number', precision: 2, order: 2 },
    rpm: { title: 'RPM', unit: 'rev', type: 'number', order: 3 },
    speed: { title: 'SPEED', unit: 'km/h', type: 'number', order: 4 },
    tireFront: { title: 'FR TIRE', unit: 'psi', type: 'number', precision: 1, order: 5 },
    tireRear: { title: 'RR TIRE', unit: 'psi', type: 'number', precision: 1, order: 6 },
    tempFront: { title: 'FR TEMP', unit: '°C', type: 'number', precision: 1, order: 7 },
    tempRear: { title: 'RR TEMP', unit: '°C', type: 'number', precision: 1, order: 8 },
  },
  SYS: {
    arch: { title: 'ARCH', type: 'string', order: 1 },
    platform: { title: 'PLATFORM', type: 'string', order: 2 },
    version: { title: 'VERSION', type: 'string', order: 3 },
    name: { title: 'NAME', type: 'string', order: 4 },
    uid: { title: 'UID', type: 'string', order: 5 },
    heapTotal: { title: 'MEM TOTAL', unit: 'b', type: 'number', order: 6 },
    heapUsed: { title: 'MEM USED', unit: 'b', type: 'number', order: 7 },
    heapPeak: { title: 'MEM PEAK', unit: 'b', type: 'number', order: 8 },
    uptime: { title: 'UPTIME', type: 'time', order: 9 },
  },
  TSM: {
    state: { title: 'TSM', type: 'string', formatter: (value: any) => `L: ${value.left}, R: ${value.right}` },
  },
  THE: {
    ch_0: { title: 'FR CYLINDER', unit: '°C', type: 'number', order: 1 },
    ch_1: { title: 'RR CYLINDER', unit: '°C', type: 'number', order: 2 },
    ch_2: { title: 'FR EXHAUST', unit: '°C', type: 'number', order: 3 },
    ch_3: { title: 'RR EXHAUST', unit: '°C', type: 'number', order: 4 },
    ch_4: { title: 'OIL TANK', unit: '°C', type: 'number', order: 5 },
    ch_5: { title: 'REGULATOR', unit: '°C', type: 'number', order: 6 },
    ch_6: { title: 'CARB INTAKE', unit: '°C', type: 'number', order: 7 },
    ch_7: { title: 'CH7_AUX', unit: '°C', type: 'number', order: 8 },
  },
};

export const ServiceInfoFields: { [key: string]: IField } = {
  serviceCode: { title: 'SERVICE', type: 'string', order: 0 },
  serviceType: { title: 'TYPE', type: 'string', order: 1 },
  updateInterval: { title: 'UPDATE-TO', unit: 'ms', type: 'number', available: false },
  idleTimeout: { title: 'IDLE-TO', unit: 'ms', type: 'number', available: false },
  broadcastMode: { title: 'BROADCAST', type: 'string', available: false },
  status: { title: 'STATUS', type: 'string', order: 2 },
  commands: { title: 'COMMANDS', type: 'array', order: 3 },
};

export const getDataField = (serviceCode: string, fieldName: string): IField | null => {
  const fi = ServiceDataFields[serviceCode][fieldName];
  if (!fi) {
    return null;
  }
  fi.available = fi.available ?? true;
  if (fi.formatter) {
    return fi;
  }
  fi.formatter = getTypeFormatter(fi);
  return fi;
};

export const getInfoField = (fieldName: string): IField | null => {
  const fi = ServiceInfoFields[fieldName];
  if (!fi) {
    return null;
  }
  fi.available = fi.available ?? true;
  if (fi.available === false) {
    return null;
  }
  if (fi.formatter) {
    return fi;
  }
  fi.formatter = getTypeFormatter(fi);
  return fi;
};

const getTypeFormatter = (fi: IField) => {
  let formatter: (value: any) => string;
  switch (fi.type) {
    case 'number':
      formatter = (value: number) => (value?.toFixed ? value.toFixed(fi.precision ?? 0) : 'N/A');
      break;
    case 'date':
      formatter = (value: number | string) => {
        try {
          value = new Date(value).toISOString().split('T')[0];
        } catch {}
        return value?.toString();
      };
      break;
    case 'time':
      formatter = (value: number | string) => {
        try {
          value = new Date(value).toISOString().split('T')[1];
        } catch {}
        return value?.toString();
      };
      break;
    case 'array':
      formatter = (value: any) => (value?.join ? value.join(', ') : 'N/A');
      break;
    default:
      formatter = (value: any) => value ?? 'N/A';
      break;
  }
  return formatter;
};

export interface IServiceAttributes {
  title: string;
  icon: string;
  pollInterval?: number;
  pollOnce?: boolean;
  isEditable?: boolean;
}

export const ServiceProperty: { [key: string]: IServiceAttributes } = {
  VHI: { title: 'Vehicle Info', icon: 'information', pollOnce: true, isEditable: true },
  VHC: { title: 'Vehicle Sensor', icon: 'engine', pollInterval: 2000 },
  THE: { title: 'Thermometer', icon: 'thermometer', pollInterval: 5000 },
  SYS: { title: 'System', icon: 'chip', pollInterval: 5000 },
  TSM: { title: 'Turn Signal', icon: 'arrow-left-right' },
};
