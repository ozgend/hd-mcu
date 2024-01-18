import {Alert, PermissionsAndroid, Platform, ToastAndroid} from 'react-native';
import {IDataProvider} from './interfaces';
import RNBluetoothClassic, {
  BluetoothDevice,
  BluetoothDeviceReadEvent,
} from 'react-native-bluetooth-classic';
import {BtDataServiceKey, BtDataServiceTypes} from '../models';

const macid = '00:22:09:01:8D:2B';

export class BluetoothSerialDataProvider implements IDataProvider {
  isAvailable: boolean = false;
  hasStream: boolean = false;
  private pid: any;
  private listeners: any = {};
  private devices: BluetoothDevice[] = [];
  private connectedDevice: BluetoothDevice | null = null;
  private serviceState: {[key: string]: boolean} = {};

  constructor() {
    BtDataServiceKey.forEach(key => {
      this.serviceState[key] = false;
    });
  }

  onInitialized: () => void = () => {};
  onStreaming: (state: boolean) => void = () => {};
  onDataReceived: (data: any) => void = () => {};

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
    let granted = await PermissionsAndroid.request(
      'android.permission.ACCESS_FINE_LOCATION',
      {
        title: 'Location Permission',
        message: 'app needs access to your location ',
        buttonPositive: 'OK',
        buttonNegative: 'Cancel',
      },
    );

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

    granted = await PermissionsAndroid.request(
      'android.permission.BLUETOOTH_CONNECT',
      {
        title: 'Bluetooth Connect Permission',
        message: 'app needs bluetooth access to connect to devices',
        buttonPositive: 'OK',
        buttonNegative: 'Cancel',
      },
    );

    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      Alert.alert('Bluetooth Connect permission not granted');
      return false;
    }

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  onUpdate(serviceName: string, callback: (data: any) => void): void {
    this.listeners[serviceName] = callback;
  }

  async sendCommand(service: string, command: string): Promise<void> {
    console.log('sendCommand', service, command);
    if (
      (command === 'START' && this.serviceState[service]) ||
      (command === 'STOP' && this.serviceState[service] === false)
    ) {
      console.log(`${service} already ${command}}`);
      return;
    }
    await this.connectedDevice?.write(`${service}=${command}\n`);
    this.serviceState[service] = command === 'START';
  }

  startStream(): boolean {
    this.onDataReceived = this.listeners.dataReceived ?? this.onDataReceived;
    this.pid = this.connectedDevice?.onDataReceived(
      (event: BluetoothDeviceReadEvent) => {
        if (event.data.includes('0_heartbeat')) {
          this.hasStream = true;
        }
        console.debug('onDataReceived', event.data);
        this.onDataReceived(event.data);
        Object.keys(BtDataServiceTypes).forEach(key => {
          if (event.data.startsWith(key)) {
            try {
              const raw = event.data.replace(/.+\.UPDATE=/gm, '');
              this.listeners[key] ? this.listeners[key](JSON.parse(raw)) : null;
            } catch (err) {
              console.warn(err);
              ToastAndroid.show('Skipping corrupted data.', ToastAndroid.SHORT);
            }
          }
        });
      },
    );
    this.onStreaming(true);
    return true;
  }

  stopStream(): boolean {
    this.sendCommand('MODULE', 'STOP');
    this.pid.remove();
    this.pid = null;
    return true;
  }
}
