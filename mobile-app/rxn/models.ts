import { IAppConfig } from './config';
import { AppThemeNames } from './themes';

export interface IItemProperties {
  appConfig: IAppConfig;
  serviceCode?: string;
  fieldName: string;
  value: string | number | boolean | null | undefined | any;
  setServiceData?: (fieldName: string, value: string | number | boolean | null | undefined | any) => void;
  availableValues?: string[] | number[] | boolean[];
}

export interface IField {
  order?: number;
  title: string;
  unit?: string;
  type: 'number' | 'date' | 'time' | 'string' | 'array';
  precision?: number;
  available?: boolean;
  formatter?: (value: any) => string;
  availableValues?: string[] | number[] | boolean[];
}

export interface IServiceAttributes {
  title: string;
  icon: string;
  pollInterval?: number;
  pollOnce?: boolean;
  isEditable?: boolean;
  autoStart?: boolean;
}

export const ServiceProperty: { [key: string]: IServiceAttributes } = {
  VHI: { title: 'Vehicle Info', icon: 'information', pollOnce: true, isEditable: true },
  VHC: { title: 'Vehicle Sensor', icon: 'engine', pollInterval: 2000 },
  THE: { title: 'Thermometer', icon: 'thermometer', pollInterval: 5000 },
  SYS: { title: 'System', icon: 'chip', pollInterval: 5000 },
  TSM: { title: 'Turn Signal', icon: 'arrow-left-right' },
  CFG: { title: 'App Config', icon: 'cog', pollOnce: true, isEditable: true },
};

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
    oilIntervalKm: { title: 'OIL INT KM', unit: 'km', type: 'number', order: 103 },
    tireFrontInfo: { title: 'FRONT TIRE INF', type: 'string', order: 104 },
    tireFrontDate: { title: 'FRONT TIRE DATE', type: 'date', order: 105 },
    tireFrontKm: { title: 'FRONT TIRE KM', type: 'number', order: 106 },
    tireRearInfo: { title: 'REAR TIRE INF', type: 'string', order: 107 },
    tireRearDate: { title: 'REAR TIRE DATE', type: 'date', order: 108 },
    tireRearKm: { title: 'REAR TIRE KM', type: 'number', order: 109 },
    beltInfo: { title: 'DRIVETRAIN INF', type: 'string', order: 110 },
    beltDate: { title: 'DRIVETRAIN DATE', type: 'date', order: 111 },
    batteryInfo: { title: 'BATTERY INF', type: 'string', order: 112 },
    batteryDate: { title: 'BATTERY DATE', type: 'date', order: 113 },
    inspectDate: { title: 'INSPECT DATE', type: 'date', order: 201 },
    insuranceDate: { title: 'INSURNC DATE', type: 'date', order: 202 },
    serviceDate: { title: 'SERVICE DATE', type: 'date', order: 203 },
    serviceKm: { title: 'SERVICE KM', unit: 'km', type: 'number', order: 204 },
  },
  VHC: {
    temp: { title: 'MCU TEMP', unit: '°C', type: 'number', precision: 1, order: 1 },
    batt: { title: 'BATTERY', unit: 'V', type: 'number', precision: 2, order: 2 },
    rpm: { title: 'RPM', unit: 'rev', type: 'number', order: 3 },
    speed: { title: 'SPEED', unit: 'km/h', type: 'number', order: 4 },
    tireFront: { title: 'FRONT TIRE PS', unit: 'psi', type: 'number', precision: 1, order: 5 },
    tempFront: { title: 'FRONT TIRE TMP', unit: '°C', type: 'number', precision: 1, order: 6 },
    tireRear: { title: 'REAR TIRE PS', unit: 'psi', type: 'number', precision: 1, order: 7 },
    tempRear: { title: 'REAR TEMP TMP', unit: '°C', type: 'number', precision: 1, order: 8 },
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
    ch_0: { title: 'FRONT CYLINDER', unit: '°C', type: 'number', order: 1 },
    ch_2: { title: 'FRONT EXHAUST', unit: '°C', type: 'number', order: 2 },
    ch_1: { title: 'REAR CYLINDER', unit: '°C', type: 'number', order: 3 },
    ch_3: { title: 'REAR EXHAUST', unit: '°C', type: 'number', order: 4 },
    ch_4: { title: 'OIL TANK', unit: '°C', type: 'number', order: 5 },
    ch_5: { title: 'REGULATOR', unit: '°C', type: 'number', order: 6 },
    ch_6: { title: 'CARB INTAKE', unit: '°C', type: 'number', order: 7 },
    ch_7: { title: 'AUX GENERIC', unit: '°C', type: 'number', order: 8 },
  },
  CFG: {
    themeName: { title: 'THEME', type: 'array', order: 1, availableValues: Object.keys(AppThemeNames) },
    ownerName: { title: 'OWNER', type: 'string', order: 2 },
    appTitle: { title: 'APP TITLE', type: 'string', order: 3 },
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

export const getFormattedValue = (fieldName: string, value: any, serviceCode?: string) => {
  const fieldInfo = serviceCode ? getDataField(serviceCode, fieldName) : getInfoField(fieldName);
  const formattedValue = fieldInfo?.formatter ? fieldInfo.formatter(value) : value ?? 'N/A';
  return { formattedValue, fieldInfo };
};

// export const getFormattedDataValue = (serviceCode: string, fieldName: string, value: any) => {
//   const fieldInfo = getDataField(serviceCode, fieldName);
//   const formattedValue = fieldInfo?.formatter ? fieldInfo.formatter(value) : value ?? 'N/A';
//   return { formattedValue, fieldInfo };
// };

// export const getFormattedServiceInfoValue = (fieldName: string, value: any) => {
//   const fieldInfo = getInfoField(fieldName);
//   const formattedValue = fieldInfo?.formatter ? fieldInfo.formatter(value) : value ?? 'N/A';
//   return { formattedValue, fieldInfo };
// };

const getDataField = (serviceCode: string, fieldName: string): IField | null => {
  const field = ServiceDataFields[serviceCode][fieldName];
  if (!field) {
    return null;
  }
  field.available = field.available ?? true;
  if (field.formatter) {
    return field;
  }
  field.formatter = getTypeFormatter(field);
  return field;
};

const getInfoField = (fieldName: string): IField | null => {
  const field = ServiceInfoFields[fieldName];
  if (!field) {
    return null;
  }
  field.available = field.available ?? true;
  if (field.available === false) {
    return null;
  }
  if (field.formatter) {
    return field;
  }
  field.formatter = getTypeFormatter(field);
  return field;
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
