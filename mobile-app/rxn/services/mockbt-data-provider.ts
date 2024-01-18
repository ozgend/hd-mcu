import { Alert } from 'react-native';
import { IDataProvider, IDataProviderDevice } from './interfaces';
import { Broadcasting, ServiceCommand, ServiceStatus, ServiceType } from '../constants';
import { IServiceStatusInfo, IVehicleSensorData, IMuxedSensorData, ITsmData, ISystemStatsData } from '../models';

export class MockBluetoothSerialDataProvider implements IDataProvider {
  private serviceListeners: { [key: string]: any } = {};
  private connectedDevice: IDataProviderDevice | null = null;

  public isInitialized: boolean = false;
  public isDeviceConnected: boolean = false;
  public isStreamStarted: boolean = false;

  public onProviderInitialized: () => void = () => {};
  public onProviderHeartbeat: (data: any) => void = () => {};
  public onProviderStreamStatusChange: (state: boolean) => void = () => {};
  public onProviderStreamStarted: () => void = () => {};
  public onProviderStreamStopped: () => void = () => {};
  public onProviderDeviceDiscovered: (devices: IDataProviderDevice[]) => void = () => {};
  public onProviderDeviceConnected: (device: IDataProviderDevice) => void = () => {};
  public onProviderDeviceDisconnected: () => void = () => {};

  public async initialize(): Promise<boolean> {
    this.onProviderInitialized();
    this.isInitialized = true;
    return this.isInitialized;
  }

  public async scanDevices(): Promise<boolean> {
    return new Promise(resolve => {
      setTimeout(() => {
        this.onProviderDeviceDiscovered(mockBtDevices);
      }, 3000);
      resolve(true);
    });
  }

  public async connectDevice(device: IDataProviderDevice): Promise<boolean> {
    if (this.isDeviceConnected) {
      this.connectedDevice = null;
      this.isDeviceConnected = false;
    }

    return new Promise(resolve => {
      setTimeout(() => {
        this.connectedDevice = device;
        this.isDeviceConnected = true;
        this.onProviderDeviceConnected(device);
      }, 2000);
      resolve(true);
    });
  }

  public startStream(): boolean {
    if (this.isStreamStarted) {
      Alert.alert('Bluetooth stream already started');
      return true;
    }

    if (!this.connectedDevice) {
      Alert.alert('Bluetooth device not connected');
      return false;
    }
    this.onProviderStreamStatusChange(true);
    this.onProviderStreamStarted();
    return true;
  }

  public stopStream(): boolean {
    if (!this.isStreamStarted) {
      Alert.alert('Bluetooth stream already stopped');
      return true;
    }
    this.isStreamStarted = false;
    this.onProviderStreamStatusChange(false);
    this.onProviderStreamStopped();
    return true;
  }

  public addServiceEventListener(serviceCode: string, serviceEvent: string, callback: (data: any) => void): void {
    if (!this.serviceListeners[serviceCode]) {
      this.serviceListeners[serviceCode] = {};
    }
    this.serviceListeners[serviceCode][serviceEvent] = callback;
  }

  public removeServiceEventListener(serviceCode: string, serviceEvent: string): void {
    if (!this.serviceListeners[serviceCode]) {
      return;
    }
    if (serviceEvent) {
      delete this.serviceListeners[serviceCode][serviceEvent];
    } else {
      delete this.serviceListeners[serviceCode];
    }
  }

  public requestBtServiceData(serviceCode: string): Promise<void> {
    return this.sendBtServiceCommand(serviceCode, ServiceCommand.DATA);
  }

  public requestBtServiceInfo(serviceCode: string): Promise<void> {
    return this.sendBtServiceCommand(serviceCode, ServiceCommand.STATUS);
  }

  public async sendBtServiceCommand(serviceCode: string, serviceCommand: string): Promise<void> {
    console.log('sendCommand', serviceCode, serviceCommand);
    return new Promise(resolve => {
      setTimeout(() => {
        const payload = serviceCommand === ServiceCommand.STATUS ? mockStatusSource(serviceCode) : mockDataSource[serviceCode]();
        this.getEventListener(serviceCode, serviceCommand)(payload);
      }, 2000);
      resolve();
    });
  }

  private getEventListener(serviceCode: string, serviceEvent: string): (data: any) => void {
    if (!this.serviceListeners[serviceCode]) {
      return () => {};
    }
    return this.serviceListeners[serviceCode][serviceEvent] || (() => {});
  }
}

const initialTime: number = Date.now();
const totalMemory: number = 2 * 1024 * 1024;

const mockBtDevices: IDataProviderDevice[] = [
  {
    name: 'HD-MCU',
    address: '00:22:09:01:8D:2B',
  },
];

const mockStatusSource = (serviceCode: string): IServiceStatusInfo => {
  return {
    broadcastMode: Broadcasting.OnDemandPolling,
    isRunning: false,
    serviceCode: serviceCode,
    serviceType: ServiceType.ON_DEMAND,
    status: ServiceStatus.Available,
    idleTimeout: 0,
    updateInterval: 0,
  } as IServiceStatusInfo;
};

const mockDataSource: { [key: string]: () => any } = {
  VHC: () => {
    return {
      batt: 12.5 + Math.random() * 10,
      rpm: Math.random() * 100 + 1200,
      speed: 0,
      temp: 40 - Math.random() * 3,
    } as IVehicleSensorData;
  },

  MUX: () => {
    return {
      ch_0: Math.random() * 10 + 500,
      ch_1: Math.random() * 10 + 500,
      ch_2: Math.random() * 10 + 500,
      ch_3: Math.random() * 10 + 500,
      ch_4: Math.random() * 10 + 500,
      ch_5: Math.random() * 10 + 500,
      ch_6: Math.random() * 10 + 500,
      ch_7: Math.random() * 10 + 500,
    } as IMuxedSensorData;
  },

  TSM: () => {
    return {
      action: { left: true, right: false },
      state: { left: true, right: false },
    } as ITsmData;
  },

  SYS: () => {
    return {
      heapTotal: totalMemory,
      heapPeak: totalMemory - Math.random() * 1024,
      heapUsed: totalMemory - Math.random() * 1024,
      arch: 'armv6',
      platform: 'rpi',
      name: 'hd-mcu',
      rtc: Date.now() - initialTime,
      uid: '1234567890',
      version: '0.0.1',
    } as ISystemStatsData;
  },
};
