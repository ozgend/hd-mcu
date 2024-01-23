export interface IFieldInfo {
  order?: number;
  title: string;
  unit?: string;
  type: 'number' | 'date' | 'string' | 'array';
  precision?: number;
  available?: boolean;
  formatter?: (value: any) => string;
}

export const SensorFieldInfo: { [key: string]: IFieldInfo } = {
  temp: { title: 'ONBOARD TEMP', unit: '°C', type: 'number', precision: 1, available: true, order: 1 },
  batt: { title: 'BATTERY', unit: 'V', type: 'number', precision: 2, available: true, order: 2 },
  rpm: { title: 'REVS', unit: 'rpm', type: 'number', available: true, order: 3 },
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
  state: { title: 'TSM', type: 'string', formatter: (value: any) => `L: ${value.left}, R: ${value.right}` },
  model: { title: 'MODEL', type: 'string' },
  vin: { title: 'VIN', type: 'string' },
  year: { title: 'YEAR', type: 'number' },
  make: { title: 'MAKE', type: 'string' },
  owner: { title: 'OWNER', type: 'string' },
  plate: { title: 'PLATE', type: 'string' },
  regId: { title: 'REG ID', type: 'string' },
  oilDate: { title: 'OIL DATE', type: 'date' },
  oilInterval: { title: 'OIL INTERVAL', unit: 'km', type: 'number' },
  tireFrontInfo: { title: 'FRONT TIRE', type: 'string' },
  tireRearInfo: { title: 'REAR TIRE', type: 'string' },
  tireFrontDate: { title: 'FRONT T. DATE', type: 'date' },
  tireRearDate: { title: 'REAR T. DATE', type: 'date' },
  beltInfo: { title: 'BELT', type: 'string' },
  beltDate: { title: 'BELT DATE', type: 'date' },
  batteryInfo: { title: 'BATTERY', type: 'string' },
  batteryDate: { title: 'BATTERY DATE', type: 'date' },
  inspectDate: { title: 'INSPECT DATE', type: 'date' },
  inspectInterval: { title: 'INSPECT INTERVAL', unit: 'km', type: 'number' },
  serviceDate: { title: 'SERVICE DATE', type: 'date' },
  serviceInterval: { title: 'SERVICE INTERVAL', unit: 'km', type: 'number' },
};

export const ServiceStatusFieldInfo: { [key: string]: IFieldInfo } = {
  serviceCode: { title: 'SERVICE', type: 'string', order: 0 },
  serviceType: { title: 'TYPE', type: 'string', order: 1 },
  updateInterval: { title: 'UPDATE-TO', unit: 'ms', type: 'number', available: false },
  idleTimeout: { title: 'IDLE-TO', unit: 'ms', type: 'number', available: false },
  broadcastMode: { title: 'BROADCAST', type: 'string', available: false },
  status: { title: 'STATUS', type: 'string', order: 2 },
  commands: { title: 'COMMANDS', type: 'array', order: 3 },
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
  fi.formatter = getTypeFormatter(fi);
  return fi;
};

export const getServiceStateFieldInfo = (fieldName: string): IFieldInfo | null => {
  const fi = ServiceStatusFieldInfo[fieldName];
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

const getTypeFormatter = (fi: IFieldInfo) => {
  let formatter: (value: any) => string;
  switch (fi.type) {
    case 'number':
      formatter = (value: number) => (value?.toFixed ? value.toFixed(fi.precision ?? 0) : 'N/A');
      break;
    case 'date':
      formatter = (value: number) => (value ? new Date(value).toISOString().split('T')[1].split('.')[0] : 'N/A');
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
  VHC: { title: 'Vehicle Sensor', icon: 'engine', pollInterval: 1000 },
  THE: { title: 'Thermometer', icon: 'thermometer', pollInterval: 5000 },
  SYS: { title: 'System', icon: 'chip', pollInterval: 5000 },
  TSM: { title: 'Turn Signal', icon: 'arrow-left-right' },
};
