import {
  IDeviceSensorData,
  IMuxedSensorData,
  ISystemStatsData,
  ITsmData,
} from '../models';
import {IDataProvider} from './interfaces';

const initialTime: number = Date.now();
const totalMemory: number = 2 * 1024 * 1024;

const mockDataSource: {[key: string]: () => any} = {
  DEV: () => {
    return {
      batt: 12.5 + Math.random() * 10,
      rpm: Math.random() * 100 + 1200,
      speed: 0,
      temp: 40 - Math.random() * 3,
    } as IDeviceSensorData;
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
      action: {left: true, right: false},
      state: {left: true, right: false},
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
  private pid: {[key: string]: any} = {};
  private listeners: any = {};

  async initialize(): Promise<boolean> {
    return true;
  }

  onUpdate(serviceName: string, callback: (data: any) => void): void {
    this.listeners[serviceName] = callback;
  }

  sendCommand(serviceName: string, command: string): Promise<void> {
    return new Promise(resolve => {
      console.log('sendCommand', serviceName, command);
      if (command === 'START') {
        if (this.pid[serviceName]) {
          console.log(`${serviceName} already running`);
          return;
        }
        this.pid[serviceName] = setInterval(() => {
          this.listeners[serviceName]
            ? this.listeners[serviceName](mockDataSource[serviceName]())
            : null;
        }, 1000);
      } else if (command === 'STOP') {
        clearInterval(this.pid[serviceName]);
        delete this.pid[serviceName];
      }
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
