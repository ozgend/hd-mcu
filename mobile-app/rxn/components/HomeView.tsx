import React, { Component } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { NavigationContainer, PreventRemoveContext } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Progress from 'react-native-progress';
import { styles, tabTheme, getIcon } from './shared';
import { IDataProvider, IDataProviderDevice, IDataProviderEvents } from '../services/interfaces';
import { BtDataServiceTypes } from '../models';
import { ServiceSensorView } from './ServiceSensorView';

interface IProps {
  provider: IDataProvider;
}

interface IState {
  status: string;
  isBusy: boolean;
  isProviderStreamStarted: boolean;
  isProviderInitialized: boolean;
  isDeviceDiscovered: boolean;
  isDeviceConnected: boolean;
  devices: IDataProviderDevice[];
  connectedDevice: IDataProviderDevice | null;
}

const Tab = createBottomTabNavigator();

class HomeView extends Component<IProps, IState> implements IDataProviderEvents {
  constructor(props: any) {
    super(props);
    this.state = { isProviderStreamStarted: false, isProviderInitialized: false, devices: [], connectedDevice: null, isDeviceConnected: false, isDeviceDiscovered: false, status: '', isBusy: false };

    this.props.provider.onProviderInitialized = () => this.onProviderInitialized();
    this.props.provider.onProviderStreamStarted = () => this.onProviderStreamStarted();
    this.props.provider.onProviderStreamStopped = () => this.onProviderStreamStopped();
    this.props.provider.onProviderHeartbeat = (hasHeartbeat: boolean) => this.onProviderHeartbeat(hasHeartbeat);
    this.props.provider.onProviderStreamStatusChange = (state: boolean) => this.onProviderStreamStatusChange(state);
    this.props.provider.onProviderDeviceDiscovered = (devices: IDataProviderDevice[]) => this.onProviderDeviceDiscovered(devices);
    this.props.provider.onProviderDeviceConnected = (device: IDataProviderDevice) => this.onProviderDeviceConnected(device);
    this.props.provider.onProviderDeviceDisconnected = () => this.onProviderDeviceDisconnected();
  }

  onProviderInitialized() {
    console.debug('provider initialized');
    this.setState({ status: 'provider initialized' });
    this.setState({ isBusy: false });

    this.setState({ isProviderInitialized: true });

    this.setState({ status: 'scanning devices' });
    this.setState({ isBusy: true });

    this.props.provider.scanDevices();
  }

  onProviderStreamStarted() {
    console.debug('provider stream started');
    this.setState({ status: 'provider stream started' });
    this.setState({ isBusy: false });

    this.setState({ isProviderStreamStarted: true });
  }

  onProviderStreamStopped() {
    console.debug('provider stream stopped');
    this.setState({ status: 'provider stream stopped' });
    this.setState({ isBusy: false });
    this.setState({ isProviderStreamStarted: false });
    this.setState({ isDeviceDiscovered: false });
    this.setState({ isDeviceConnected: false });
    this.setState({ isProviderInitialized: false });
  }

  onProviderHeartbeat: (hasHeartbeat: boolean) => void = (hasHeartbeat: boolean) => {
    console.debug('provider heartbeat', hasHeartbeat);
  };

  onProviderStreamStatusChange: (state: boolean) => void = (state: boolean) => {
    console.debug('provider stream status change', state);
    this.setState({ isProviderStreamStarted: state });
  };

  onProviderDeviceDiscovered: (devices: IDataProviderDevice[]) => void = (devices: IDataProviderDevice[]) => {
    console.debug('discovered devices', devices);
    this.setState({ status: 'discovered devices' });
    this.setState({ isBusy: false });

    this.setState({ devices });
    this.setState({ isDeviceDiscovered: true });
  };

  onProviderDeviceConnected: (device: IDataProviderDevice) => void = (device: IDataProviderDevice) => {
    console.debug('device connected', device);
    this.setState({ status: 'device connected' });
    this.setState({ isBusy: false });

    this.setState({ connectedDevice: device });
    this.setState({ isDeviceConnected: true });
  };

  onProviderDeviceDisconnected: () => void = () => {
    console.debug('device disconnected');
    this.setState({ status: 'device disconnected' });
    this.setState({ isBusy: false });

    this.setState({ connectedDevice: null });
    this.setState({ isDeviceConnected: false });
  };

  selectDevice: (device: IDataProviderDevice) => void = (device: IDataProviderDevice) => {
    console.debug('selecting device', device);
    this.setState({ status: 'selecting device' });
    this.setState({ isBusy: true });

    this.props.provider.connectDevice(device);
  };

  initializeProvider() {
    console.debug('initializing provider');
    this.setState({ status: 'initializing provider' });
    this.setState({ isBusy: true });

    this.props.provider.initialize();
  }

  render() {
    return (
      <NavigationContainer theme={tabTheme}>
        {!this.state.isDeviceConnected && this.state.isBusy && <Progress.Bar indeterminate={true} color={styles.container.color} borderRadius={0} unfilledColor={styles.container.backgroundColor} borderWidth={0} width={1000} />}
        {!this.state.isDeviceConnected && !this.state.isBusy && <Progress.Bar progress={1} color={styles.container.color} borderRadius={0} unfilledColor={styles.container.backgroundColor} borderWidth={0} width={1000} />}

        {this.state.isDeviceConnected && (
          <Tab.Navigator>
            <Tab.Screen
              name={BtDataServiceTypes.Vehicle}
              options={{ unmountOnBlur: true, header: () => undefined, tabBarIcon: () => getIcon('engine') }}
              children={() => <ServiceSensorView provider={this.props.provider} serviceCode={BtDataServiceTypes.Vehicle} />}
            />
            <Tab.Screen
              name={BtDataServiceTypes.MuxThermo}
              options={{ unmountOnBlur: true, header: () => undefined, tabBarIcon: () => getIcon('thermometer') }}
              children={() => <ServiceSensorView provider={this.props.provider} serviceCode={BtDataServiceTypes.MuxThermo} />}
            />
            <Tab.Screen
              name={BtDataServiceTypes.System}
              options={{ unmountOnBlur: true, header: () => undefined, tabBarIcon: () => getIcon('chip') }}
              children={() => <ServiceSensorView provider={this.props.provider} serviceCode={BtDataServiceTypes.System} />}
            />
            <Tab.Screen
              name={BtDataServiceTypes.TurnSignalModule}
              options={{ unmountOnBlur: true, header: () => undefined, tabBarIcon: () => getIcon('arrow-left-right') }}
              children={() => <ServiceSensorView provider={this.props.provider} serviceCode={BtDataServiceTypes.TurnSignalModule} />}
            />
          </Tab.Navigator>
        )}
        {!this.state.isDeviceConnected && (
          <View style={styles.centerContainer}>
            <Text style={styles.heading}>bluetooth connection</Text>
            <Text style={styles.text}>please connect to the device</Text>
            <Text style={styles.text}> </Text>
            <MaterialCommunityIcons.Button name="bluetooth" style={styles.button} color={styles.button.color} onPress={() => this.initializeProvider()}>
              START
            </MaterialCommunityIcons.Button>
          </View>
        )}
        {!this.state.isDeviceConnected && (
          <View style={styles.container}>
            <Text style={styles.textSmall}>{this.state.status}</Text>
            <FlatList
              data={this.state.devices}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => this.selectDevice(item)}>
                  <Text>
                    {item.name} {item.address}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.address}
            />
          </View>
        )}
      </NavigationContainer>
    );
  }
}

export default HomeView;
