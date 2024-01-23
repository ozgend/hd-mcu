import { Alert, PermissionsAndroid, Platform, ToastAndroid } from 'react-native';
import { IDataProvider, IDataProviderDevice } from './interfaces';
import RNBluetoothClassic, { BluetoothDevice, BluetoothDeviceEvent, BluetoothDeviceReadEvent, BluetoothEventSubscription } from 'react-native-bluetooth-classic';
import { Seperator, ServiceCommand } from '../constants';

const macid = '00:22:09:01:8D:2B';

export class BluetoothSerialDataProvider implements IDataProvider {
  private btStream: BluetoothEventSubscription | null = null;
  private serviceListeners: { [key: string]: any } = {};
  private connectedDevice: BluetoothDevice | null = null;

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
    if (this.isInitialized) {
      // Alert.alert('Bluetooth already initialized');
      this.isInitialized = true;
      this.onProviderInitialized();
      return this.isInitialized;
    }

    const hasBluetoothPermissions = await this.requestBtPermissions();

    if (!hasBluetoothPermissions) {
      Alert.alert('Bluetooth requested permissions not granted');
      return false;
    }

    let isBluetoothAvailable = false;

    try {
      isBluetoothAvailable = await RNBluetoothClassic.isBluetoothAvailable();
    } catch (err) {
      console.error(err);
      Alert.alert(err as string);
    }

    if (!isBluetoothAvailable) {
      Alert.alert('Bluetooth is not available');
      return false;
    }

    try {
      isBluetoothAvailable = await RNBluetoothClassic.isBluetoothEnabled();
      if (!isBluetoothAvailable) {
        ToastAndroid.show('Bluetooth enable request sent', ToastAndroid.SHORT);
        isBluetoothAvailable = await RNBluetoothClassic.requestBluetoothEnabled();
      }
    } catch (err) {
      Alert.alert(err as string);
      console.error(err);
    }

    if (!isBluetoothAvailable) {
      Alert.alert('Bluetooth is not enabled or not available');
    }

    this.isInitialized = true;
    this.onProviderInitialized();
    return this.isInitialized;
  }

  public async scanDevices(): Promise<boolean> {
    // const devices = await RNBluetoothClassic.startDiscovery();
    const devices = await RNBluetoothClassic.getBondedDevices();
    const deviceList = devices.map(d => {
      return { name: d.name, address: d.address };
    });
    this.onProviderDeviceDiscovered(deviceList);
    return true;
  }

  public async connectDevice(device: IDataProviderDevice): Promise<boolean> {
    this.isDeviceConnected = (await this.connectedDevice?.isConnected()) ?? false;
    if (this.isDeviceConnected) {
      // Alert.alert('Bluetooth device already connected');
      this.onProviderDeviceConnected(device);
      return true;
    }

    try {
      this.connectedDevice = await RNBluetoothClassic.connectToDevice(device.address, { delimiter: '\n' });
      this.isDeviceConnected = await this.connectedDevice.isConnected();
      if (!this.isDeviceConnected) {
        Alert.alert(`Bluetooth connection failed to device ${device.name} [${device.address}]`);
        return false;
      } else {
        this.onProviderDeviceConnected(device);
        RNBluetoothClassic.onDeviceDisconnected((event: BluetoothDeviceEvent) => {
          this.isDeviceConnected = false;
          this.onProviderDeviceDisconnected();
        });
      }
      return this.isDeviceConnected;
    } catch (err) {
      console.error(err);
      Alert.alert(`Bluetooth connection failed to device ${device.name} [${device.address}]`);
      this.onProviderDeviceDisconnected();
      return false;
    }
  }

  public startStream(): boolean {
    if (this.isStreamStarted) {
      // Alert.alert('Bluetooth stream already started');
      this.onProviderStreamStatusChange(true);
      this.onProviderStreamStarted();
      return true;
    }

    if (!this.connectedDevice) {
      Alert.alert('Bluetooth device not connected');
      this.onProviderStreamStatusChange(false);
      this.onProviderStreamStopped();

      return false;
    }

    this.btStream = this.connectedDevice?.onDataReceived((event: BluetoothDeviceReadEvent) => {
      console.debug('onDataReceived', event.data);

      if (event.data.includes('0_heartbeat')) {
        this.isStreamStarted = true;
        return;
      }

      try {
        const [target, payload] = event.data.split(Seperator.ServiceData);
        const [serviceCode, serviceCommand] = target.split(Seperator.SerialCommand);
        const listener = this.getEventListener(serviceCode, serviceCommand);
        listener(JSON.parse(payload));
      } catch (err) {
        console.warn(err);
        ToastAndroid.show('Invalid or corrupted data, skipped.', ToastAndroid.SHORT);
      }
    });
    this.onProviderStreamStatusChange(true);
    this.onProviderStreamStarted();
    return true;
  }

  public stopStream(): boolean {
    if (!this.isStreamStarted) {
      Alert.alert('Bluetooth stream already stopped');
      return true;
    }
    this.btStream?.remove();
    this.btStream = null;
    this.isStreamStarted = false;
    this.onProviderStreamStatusChange(false);
    return true;
  }

  public addServiceEventListener(serviceCode: string, serviceCommand: string, callback: (data: any) => void): void {
    if (!this.serviceListeners[serviceCode]) {
      this.serviceListeners[serviceCode] = {};
    }
    this.serviceListeners[serviceCode][serviceCommand] = callback;
  }

  public removeServiceEventListener(serviceCode: string, serviceCommand: string): void {
    if (!this.serviceListeners[serviceCode]) {
      return;
    }
    if (serviceCommand) {
      delete this.serviceListeners[serviceCode][serviceCommand];
    } else {
      delete this.serviceListeners[serviceCode];
    }
  }

  public requestBtServiceData(serviceCode: string): Promise<void> {
    return this.sendBtServiceCommand(serviceCode, ServiceCommand.DATA);
  }

  public requestBtServiceInfo(serviceCode: string): Promise<void> {
    return this.sendBtServiceCommand(serviceCode, ServiceCommand.INFO);
  }

  public async sendBtServiceCommand(serviceCode: string, serviceCommand: string): Promise<void> {
    console.log('sendCommand', serviceCode, serviceCommand);
    await this.connectedDevice?.write(`${serviceCode}${Seperator.SerialCommand}${serviceCommand}\n`);
  }

  private getEventListener(serviceCode: string, serviceCommand: string): (data: any) => void {
    if (!this.serviceListeners[serviceCode]) {
      return () => {};
    }
    return this.serviceListeners[serviceCode][serviceCommand] || (() => {});
  }

  private async requestBtPermissions(): Promise<boolean> {
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
  }
}
