import { Broadcasting, ServiceEvent, ServiceStatus, ServiceType } from '../constants';
import { IVehicleSensorData, IMuxedSensorData, ISystemStatsData, ITsmData, IServiceStatusInfo } from '../models';
import { IDataProvider } from './interfaces';

const initialTime: number = Date.now();
const totalMemory: number = 2 * 1024 * 1024;

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

export class MockDataProvider implements IDataProvider {
  isAvailable = true;
  hasStream = false;
  private serviceListeners: { [key: string]: any } = {};

  async initialize(): Promise<boolean> {
    return true;
  }

  addServiceEventListener(serviceCode: string, serviceEvent: string, callback: (data: any) => void): void {
    if (!this.serviceListeners[serviceCode]) {
      this.serviceListeners[serviceCode] = {};
    }
    this.serviceListeners[serviceCode][serviceEvent] = callback;
  }

  removeServiceEventListener(serviceCode: string, serviceEvent: string): void {
    if (!this.serviceListeners[serviceCode]) {
      return;
    }
    if (serviceEvent) {
      delete this.serviceListeners[serviceCode][serviceEvent];
    } else {
      delete this.serviceListeners[serviceCode];
    }
  }

  getEventListener(serviceCode: string, serviceEvent: string): (data: any) => void {
    if (!this.serviceListeners[serviceCode]) {
      return () => {};
    }
    return this.serviceListeners[serviceCode][serviceEvent] || (() => {});
  }

  requestServiceData(serviceCode: string): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        this.getEventListener(serviceCode, ServiceEvent.DATA)(mockDataSource[serviceCode]());
      }, 1000);
      resolve();
    });
  }

  requestServiceInfo(serviceCode: string): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        this.getEventListener(serviceCode, ServiceEvent.STATUS)(mockDataSource[serviceCode]());
      }, 1000);
      resolve();
    });
  }

  sendServiceCommand(serviceName: string, serviceCommand: string): Promise<void> {
    return new Promise(resolve => {
      console.log('sendCommand', serviceName, serviceCommand);
      resolve();
    });
  }

  startStream(): boolean {
    this.hasStream = true;
    return true;
  }
  stopStream(): boolean {
    return true;
  }
}
