import { IVehicleSensorData, IMuxedSensorData, ISystemStatsData, ITsmData } from '../models';

export interface IDataSource {
  getVehicleSensorData(raw?: string): IVehicleSensorData;
  getMuxedSensorData(raw?: string): IMuxedSensorData;
  getSystemStatsData(raw?: string): ISystemStatsData;
  getTsmData(raw?: string): ITsmData;
}

export interface IDataProvider {
  isAvailable: boolean;
  hasStream: boolean;
  initialize(): Promise<boolean>;
  startStream(): boolean;
  stopStream(): boolean;
  addServiceEventListener(serviceCode: string, serviceEvent: string, callback: (data: any) => void): void;
  removeServiceEventListener(serviceCode: string, serviceEvent?: string): void;
  requestServiceData(serviceCode: string): Promise<void>;
  requestServiceInfo(serviceCode: string): Promise<void>;
  sendServiceCommand(serviceCode: string, serviceCommand: string): Promise<void>;
}
