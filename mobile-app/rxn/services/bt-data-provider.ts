import { Alert, PermissionsAndroid, Platform, ToastAndroid } from 'react-native';
import { IDataProvider } from './interfaces';
import RNBluetoothClassic, { BluetoothDevice, BluetoothDeviceReadEvent } from 'react-native-bluetooth-classic';
import { BtDataServiceCodeKeys, BtDataServiceCodeValues } from '../models';
import { Seperator, ServiceCommand } from '../constants';

const macid = '00:22:09:01:8D:2B';

export class BluetoothSerialDataProvider implements IDataProvider {
  isAvailable: boolean = false;
  hasStream: boolean = false;
  private btStream: any;
  private serviceListeners: { [key: string]: any } = {};
  private devices: BluetoothDevice[] = [];
  private connectedDevice: BluetoothDevice | null = null;

  onInitialized: () => void = () => {};
  onStreaming: (state: boolean) => void = () => {};
  // onDataReceived: (data: any) => void = () => {};

  requestServiceData(serviceCode: string): Promise<void> {
    return this.sendServiceCommand(serviceCode, ServiceCommand.DATA);
  }
  requestServiceInfo(serviceCode: string): Promise<void> {
    return this.sendServiceCommand(serviceCode, ServiceCommand.STATUS);
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

  async sendServiceCommand(serviceCode: string, serviceCommand: string): Promise<void> {
    console.log('sendCommand', serviceCode, serviceCommand);
    await this.connectedDevice?.write(`${serviceCode}${Seperator.SerialCommand}${serviceCommand}\n`);
  }

  getEventListener(serviceCode: string, serviceEvent: string): (data: any) => void {
    if (!this.serviceListeners[serviceCode]) {
      return () => {};
    }
    return this.serviceListeners[serviceCode][serviceEvent] || (() => {});
  }

  startStream(): boolean {
    this.btStream = this.connectedDevice?.onDataReceived((event: BluetoothDeviceReadEvent) => {
      console.debug('onDataReceived', event.data);

      if (event.data.includes('0_heartbeat')) {
        this.hasStream = true;
        return;
      }

      try {
        const [target, payload] = event.data.split(Seperator.ServiceData);
        const [serviceCode, serviceEvent] = target.split(Seperator.SerialCommand);
        const listener = this.getEventListener(serviceCode, serviceEvent);
        listener(JSON.parse(payload));
      } catch (err) {
        console.warn(err);
        ToastAndroid.show('Invalid or corrupted data, skipped.', ToastAndroid.SHORT);
      }
    });
    this.onStreaming(true);
    return true;
  }

  stopStream(): boolean {
    this.btStream.remove();
    this.btStream = null;
    this.hasStream = false;
    this.onStreaming(false);
    return true;
  }

  async initialize(): Promise<boolean> {
    this.isAvailable = true;
    this.isAvailable = await this.requestBt();

    if (!this.isAvailable) {
      Alert.alert('Bluetooth requested permissions not granted');
      return false;
    }

    try {
      this.isAvailable = await RNBluetoothClassic.isBluetoothAvailable();
    } catch (err) {
      console.error(err);
      Alert.alert(err as string);
    }

    if (!this.isAvailable) {
      Alert.alert('Bluetooth is not available');
      return false;
    }

    try {
      this.isAvailable = await RNBluetoothClassic.isBluetoothEnabled();
    } catch (err) {
      Alert.alert(err as string);
      console.error(err);
    }

    if (!this.isAvailable) {
      Alert.alert('Bluetooth is not enabled');
      this.isAvailable = await RNBluetoothClassic.requestBluetoothEnabled();
    }

    if (!this.isAvailable) {
      Alert.alert('Bluetooth enable request denied');
      return false;
    }

    try {
      this.connectedDevice = await RNBluetoothClassic.connectToDevice(macid, {
        delimiter: '\n',
      });
      this.isAvailable = await this.connectedDevice.isConnected();
    } catch (err) {
      console.error(err);
      Alert.alert(err as string);
    }

    if (!this.isAvailable) {
      Alert.alert('Bluetooth connection failed to device');
      return false;
    }

    this.onInitialized();
    return this.isAvailable;
  }

  requestBt = async () => {
    let granted = await PermissionsAndroid.request('android.permission.ACCESS_FINE_LOCATION', {
      title: 'Location Permission',
      message: 'app needs access to your location ',
      buttonPositive: 'OK',
      buttonNegative: 'Cancel',
    });

    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      Alert.alert('Location permission not granted');
      return false;
    }

    if (Platform.OS === 'android' && Platform.Version <= 29) {
      return true;
    }

    // granted = await PermissionsAndroid.request(
    //   'android.permission.BLUETOOTH_SCAN',
    //   {
    //     title: 'Bluetooth Scan Permission',
    //     message: 'app needs bluetooth access to scan the devices',
    //     buttonPositive: 'OK',
    //     buttonNegative: 'Cancel',
    //   },
    // );

    // if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
    //   Alert.alert('Bluetooth Scan permission not granted');
    //   return false;
    // }

    granted = await PermissionsAndroid.request('android.permission.BLUETOOTH_CONNECT', {
      title: 'Bluetooth Connect Permission',
      message: 'app needs bluetooth access to connect to devices',
      buttonPositive: 'OK',
      buttonNegative: 'Cancel',
    });

    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      Alert.alert('Bluetooth Connect permission not granted');
      return false;
    }

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };
}
