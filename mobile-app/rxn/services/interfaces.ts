export enum DataProviderType {
  Mock = 'mock',
  Bluetooth = 'bt',
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

  // app config actions
  // setAppConfig(appConfig: IAppConfig): Promise<void>;

  // serial connection actions
  addServiceEventListener(serviceCode: string, serviceCommand: string, callback: (data: any) => void): void;
  removeServiceEventListener(serviceCode: string, serviceCommand?: string): void;
  requestBtServiceData(serviceCode: string): Promise<void>;
  requestBtServiceInfo(serviceCode: string): Promise<void>;
  sendBtServiceCommand(serviceCode: string, serviceCommand: string, commandPayload?: any): Promise<void>;
}
