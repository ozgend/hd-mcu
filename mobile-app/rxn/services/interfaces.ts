import {
  IDeviceSensorData,
  IMuxedSensorData,
  ISystemStatsData,
  ITsmData,
} from '../models';

export interface IDataSource {
  getDeviceSensorData(raw?: string): IDeviceSensorData;
  getMuxedSensorData(raw?: string): IMuxedSensorData;
  getSystemStatsData(raw?: string): ISystemStatsData;
  getTsmData(raw?: string): ITsmData;
}

export interface IDataProvider {
  isAvailable: boolean;
  datasource?: IDataSource;
  initialize(): Promise<boolean>;
  onUpdate(service: string, callback: (data: any) => void): void;
  // onConnect(service: string, callback: () => void): void;
  // onDisconnect(service: string, callback: () => void): void;
  sendCommand(service: string, command: string): void;
  startStream(): boolean;
  stopStream(): boolean;
}
