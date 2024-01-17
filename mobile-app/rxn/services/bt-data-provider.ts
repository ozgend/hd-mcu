import {PermissionsAndroid} from 'react-native';
import {IDataProvider, IDataSource} from './interfaces';
import RNBluetoothClassic, {
  BluetoothDevice,
  BluetoothDeviceReadEvent,
} from 'react-native-bluetooth-classic';
import {BtDataServiceTypes} from '../models';

const macid = '00:22:09:01:8D:2B';

export class BluetoothSerialDataProvider implements IDataProvider {
  datasource?: IDataSource | undefined;
  isAvailable: boolean = false;
  private pid: any;
  private listeners: any = {};
  private devices: BluetoothDevice[] = [];
  private connectedDevice: BluetoothDevice | null = null;

  onInitialized: () => void = () => {};
  onStreaming: (state: boolean) => void = () => {};
  onDataReceived: (data: any) => void = () => {};

  async initialize(): Promise<boolean> {
    this.isAvailable = true;
    this.isAvailable = await this.requestBt();

    if (!this.isAvailable) {
      return false;
    }

    try {
      this.isAvailable = await RNBluetoothClassic.isBluetoothAvailable();
    } catch (err) {
      console.error(err);
    }

    if (!this.isAvailable) {
      return false;
    }

    try {
      this.isAvailable = await RNBluetoothClassic.isBluetoothEnabled();
    } catch (err) {
      console.error(err);
    }

    if (!this.isAvailable) {
      this.isAvailable = await RNBluetoothClassic.requestBluetoothEnabled();
    }

    if (!this.isAvailable) {
      return false;
    }

    try {
      this.connectedDevice = await RNBluetoothClassic.connectToDevice(macid, {
        delimiter: '\n',
      });
      this.isAvailable = await this.connectedDevice.isConnected();
    } catch (err) {
      console.error(err);
    }

    this.onInitialized();
    return this.isAvailable;
  }

  requestBt = async () => {
    let granted = await PermissionsAndroid.request(
      'android.permission.ACCESS_FINE_LOCATION',
      {
        title: 'Location Permission',
        message: 'app needs access to your location ',
        buttonPositive: 'OK',
        buttonNegative: 'Cancel',
      },
    );

    granted = await PermissionsAndroid.request(
      'android.permission.BLUETOOTH_CONNECT',
      {
        title: 'Bluetooth Connect Permission',
        message: 'app needs bluetooth access to connect to devices',
        buttonPositive: 'OK',
        buttonNegative: 'Cancel',
      },
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  onUpdate(serviceName: string, callback: (data: any) => void): void {
    this.listeners[serviceName] = callback;
  }

  async sendCommand(service: string, command: string): Promise<void> {
    await this.connectedDevice?.write(`${service}=${command}\n`);
  }

  startStream(): boolean {
    this.onDataReceived = this.listeners.dataReceived ?? this.onDataReceived;
    this.pid = this.connectedDevice?.onDataReceived(
      (event: BluetoothDeviceReadEvent) => {
        this.onDataReceived(event.data);
        Object.keys(BtDataServiceTypes).find(key => {
          if (event.data.startsWith(key)) {
            const raw = event.data.replace(/.+\.UPDATE=/gm, '');
            this.listeners[key] ? this.listeners[key](JSON.parse(raw)) : null;
            return true;
          }
        });
      },
    );

    this.onStreaming(true);
    return true;
  }

  stopStream(): boolean {
    this.pid.remove();
    this.pid = null;
    return true;
  }
}
