import React, { Component } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Progress from 'react-native-progress';
import { IDataProvider, IDataProviderDevice, IDataProviderEvents } from '../services/interfaces';
import { ServiceProperty } from '../models';
import { ServiceView } from './ServiceView';
import { ServiceCode } from '../../../ts-schema/constants';
import { getIcon, getStyleSheet, getTabTheme } from '../themes';
import { AppConfigView, IAppConfigViewProps } from './AppConfigView';

interface IProps extends IAppConfigViewProps {
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
  commonStyle: any;
  tabStyle: any;

  constructor(props: any) {
    super(props);
    this.commonStyle = getStyleSheet(this.props.appConfig.themeName);
    this.tabStyle = getTabTheme(this.props.appConfig.themeName);
    this.state = {
      isProviderStreamStarted: false,
      isProviderInitialized: false,
      devices: [],
      connectedDevice: null,
      isDeviceConnected: false,
      isDeviceDiscovered: false,
      status: '',
      isBusy: false,
    };
    this.props.provider.onProviderInitialized = () => this.onProviderInitialized();
    this.props.provider.onProviderStreamStarted = () => this.onProviderStreamStarted();
    this.props.provider.onProviderStreamStopped = () => this.onProviderStreamStopped();
    this.props.provider.onProviderHeartbeat = (hasHeartbeat: boolean) => this.onProviderHeartbeat(hasHeartbeat);
    this.props.provider.onProviderStreamStatusChange = (state: boolean) => this.onProviderStreamStatusChange(state);
    this.props.provider.onProviderDeviceDiscovered = (devices: IDataProviderDevice[]) => this.onProviderDeviceDiscovered(devices);
    this.props.provider.onProviderDeviceConnected = (device: IDataProviderDevice) => this.onProviderDeviceConnected(device);
    this.props.provider.onProviderDeviceDisconnected = () => this.onProviderDeviceDisconnected();
    console.debug('HomeView constructor');
  }

  refreshTheme(themeName: string) {
    this.commonStyle = getStyleSheet(themeName);
    this.tabStyle = getTabTheme(themeName);
    console.debug('refreshing theme', themeName);
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
    this.startStream();
  };

  onProviderDeviceDisconnected: () => void = () => {
    console.debug('device disconnected');
    this.setState({ status: 'device disconnected' });
    this.setState({ isBusy: false });
    this.setState({ connectedDevice: null });
    this.setState({ isDeviceConnected: false });
  };

  startStream() {
    console.debug('starting stream');
    this.setState({ status: 'starting stream' });
    this.setState({ isBusy: true });
    this.props.provider.startStream();
  }

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
      <NavigationContainer theme={this.tabStyle}>
        {!this.state.isDeviceConnected && this.state.isBusy && <Progress.Bar indeterminate={true} color={this.commonStyle.container.color} borderRadius={0} unfilledColor={this.commonStyle.container.backgroundColor} borderWidth={0} width={1000} />}
        {!this.state.isDeviceConnected && !this.state.isBusy && <Progress.Bar progress={1} color={this.commonStyle.container.color} borderRadius={0} unfilledColor={this.commonStyle.container.backgroundColor} borderWidth={0} width={1000} />}

        {this.state.isDeviceConnected && (
          <Tab.Navigator>
            <Tab.Screen
              name={ServiceCode.VehicleInfo}
              options={{ unmountOnBlur: true, header: () => undefined, tabBarIcon: () => getIcon(ServiceProperty[ServiceCode.VehicleInfo].icon, this.tabStyle.colors.primary) }}
              children={() => <ServiceView provider={this.props.provider} serviceCode={ServiceCode.VehicleInfo} appConfig={this.props.appConfig} />}
            />
            <Tab.Screen
              name={ServiceCode.VehicleSensor}
              options={{ unmountOnBlur: true, header: () => undefined, tabBarIcon: () => getIcon(ServiceProperty[ServiceCode.VehicleSensor].icon, this.tabStyle.colors.primary) }}
              children={() => <ServiceView provider={this.props.provider} serviceCode={ServiceCode.VehicleSensor} appConfig={this.props.appConfig} />}
            />

            <Tab.Screen
              name={ServiceCode.Thermometer}
              options={{ unmountOnBlur: true, header: () => undefined, tabBarIcon: () => getIcon(ServiceProperty[ServiceCode.Thermometer].icon, this.tabStyle.colors.primary) }}
              children={() => <ServiceView provider={this.props.provider} serviceCode={ServiceCode.Thermometer} appConfig={this.props.appConfig} />}
            />

            <Tab.Screen
              name={ServiceCode.SystemStats}
              options={{ unmountOnBlur: true, header: () => undefined, tabBarIcon: () => getIcon(ServiceProperty[ServiceCode.SystemStats].icon, this.tabStyle.colors.primary) }}
              children={() => <ServiceView provider={this.props.provider} serviceCode={ServiceCode.SystemStats} appConfig={this.props.appConfig} />}
            />

            <Tab.Screen
              name={ServiceCode.TurnSignalModule}
              options={{ unmountOnBlur: true, header: () => undefined, tabBarIcon: () => getIcon(ServiceProperty[ServiceCode.TurnSignalModule].icon, this.tabStyle.colors.primary) }}
              children={() => <ServiceView provider={this.props.provider} serviceCode={ServiceCode.TurnSignalModule} appConfig={this.props.appConfig} />}
            />

            <Tab.Screen
              name="CFG"
              options={{ unmountOnBlur: true, header: () => undefined, tabBarIcon: () => getIcon(ServiceProperty['CFG'].icon, this.tabStyle.colors.primary) }}
              children={() => <AppConfigView appConfig={this.props.appConfig} appConfigStateChanger={this.props.appConfigStateChanger} />}
            />
          </Tab.Navigator>
        )}
        {!this.state.isDeviceConnected && (
          <View style={this.commonStyle.centerContainer}>
            <Text style={this.commonStyle.heading}>{this.props.appConfig.ownerName}</Text>
            <Text style={this.commonStyle.brand}>{this.props.appConfig.appTitle}</Text>
            <Text style={this.commonStyle.heading}>bluetooth connection</Text>
            <Text style={this.commonStyle.text}>please connect to the device</Text>
            <Text style={this.commonStyle.text}> </Text>
            <MaterialCommunityIcons.Button name="bluetooth" style={this.commonStyle.button} color={this.commonStyle.button.color} onPress={() => this.initializeProvider()}>
              START
            </MaterialCommunityIcons.Button>
            <Text style={this.commonStyle.text}> </Text>
            {this.state.isBusy && !this.state.isDeviceConnected && <Text style={this.commonStyle.textSmall}>{this.state.status}</Text>}
            {!this.state.isBusy && !this.state.isDeviceConnected && <Text style={this.commonStyle.textSmall}> </Text>}
          </View>
        )}
        {!this.state.isDeviceConnected && (
          <View style={this.commonStyle.container}>
            {this.state.isDeviceDiscovered && <Text style={this.commonStyle.statusText}>connect to device</Text>}
            <FlatList
              data={this.state.devices}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => this.selectDevice(item)} style={this.commonStyle.deviceListItem}>
                  <Text style={this.commonStyle.infoTitle}>{item.name} </Text>
                  <Text style={this.commonStyle.infoValue}>{item.address} </Text>
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
