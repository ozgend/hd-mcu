import { IVehicleSensorData, IMuxedSensorData, ISystemStatsData, ITsmData } from '../models';

export interface IDataSource {
  getVehicleSensorData(raw?: string): IVehicleSensorData;
  getMuxedSensorData(raw?: string): IMuxedSensorData;
  getSystemStatsData(raw?: string): ISystemStatsData;
  getTsmData(raw?: string): ITsmData;
}

export interface IDataProviderDevice {
  name: string;
  address: string;
}

export interface IDataProviderEvents {
  onProviderInitialized: () => void;
  onProviderHeartbeat: (hasHeartbeat: boolean) => void;
  onProviderStreamStatusChange: (state: boolean) => void;
  onProviderStreamStarted: () => void;
  onProviderStreamStopped: () => void;
  onProviderDeviceDiscovered: (devices: IDataProviderDevice[]) => void;
  onProviderDeviceConnected: (device: IDataProviderDevice) => void;
  onProviderDeviceDisconnected: () => void;
}

export interface IDataProvider extends IDataProviderEvents {
  isInitialized: boolean;
  isDeviceConnected: boolean;
  isStreamStarted: boolean;

  // data provider actions
  initialize(): Promise<boolean>;
  scanDevices(): Promise<boolean>;
  connectDevice(device: IDataProviderDevice): Promise<boolean>;
  startStream(): boolean;
  stopStream(): boolean;

  // serial connection actions
  addServiceEventListener(serviceCode: string, serviceEvent: string, callback: (data: any) => void): void;
  removeServiceEventListener(serviceCode: string, serviceEvent?: string): void;
  requestBtServiceData(serviceCode: string): Promise<void>;
  requestBtServiceInfo(serviceCode: string): Promise<void>;
  sendBtServiceCommand(serviceCode: string, serviceCommand: string): Promise<void>;
}
