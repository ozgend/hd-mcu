import React, { Component, RefObject, createRef } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { NavigationContainer, NavigationState } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Progress from 'react-native-progress';
import { DataProviderType, IDataProvider, IDataProviderDevice, IDataProviderEvents } from '../services/interfaces';
import { ServiceProperty } from '../models';
import { ServiceView } from './ServiceView';
import { ServiceCode } from '../../../ts-schema/constants';
import { getIcon, getStyleSheet, getTabTheme } from '../themes';
import { AppConfigView } from './AppConfigView';
import { getAppConfig } from '../config';

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
  willDisplayAppConfig: boolean;
  activeServiceTabName: string;
}

const Tab = createBottomTabNavigator();

class HomeView extends Component<IProps, IState> implements IDataProviderEvents {
  commonStyle: any;
  tabStyle: any;
  refServiceView: RefObject<ServiceView>;

  constructor(props: any) {
    super(props);
    this.refServiceView = createRef();
    this.state = {
      isProviderStreamStarted: false,
      isProviderInitialized: false,
      devices: [],
      connectedDevice: null,
      isDeviceConnected: false,
      isDeviceDiscovered: false,
      status: '',
      isBusy: false,
      willDisplayAppConfig: false,
      activeServiceTabName: ServiceCode.VehicleSensor,
    };

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
    this.toggleBusy(false, 'Home', 'onProviderInitialized');
    this.props.provider.scanDevices();
  }

  onProviderStreamStarted() {
    console.debug('provider stream started');
    this.setState({ status: 'provider stream started' });
    this.toggleBusy(false, 'Home', 'onProviderStreamStarted');
    this.setState({ isProviderStreamStarted: true });
  }

  onProviderStreamStopped() {
    console.debug('provider stream stopped');
    this.setState({ status: 'provider stream stopped' });
    this.toggleBusy(false, 'Home', 'onProviderStreamStopped');
    this.setState({ isProviderStreamStarted: false });
    this.setState({ isDeviceDiscovered: false });
    this.setState({ isDeviceConnected: false });
    this.setState({ isProviderInitialized: false });
  }

  onProviderHeartbeat: (hasHeartbeat: boolean) => void = (hasHeartbeat: boolean) => {
    console.debug('provider heartbeat', hasHeartbeat);
    this.refServiceView.current?.glowHeartbeat();
  };

  onProviderStreamStatusChange: (state: boolean) => void = (state: boolean) => {
    console.debug('provider stream status change', state);
    this.setState({ isProviderStreamStarted: state });
  };

  onProviderDeviceDiscovered: (devices: IDataProviderDevice[]) => void = (devices: IDataProviderDevice[]) => {
    console.debug('discovered devices', devices);
    this.setState({ status: 'discovered devices' });
    this.toggleBusy(false, 'Home', 'onProviderDeviceDiscovered');
    this.setState({ devices });
    this.setState({ isDeviceDiscovered: true });
  };

  onProviderDeviceConnected: (device: IDataProviderDevice) => void = (device: IDataProviderDevice) => {
    console.debug('device connected', device);
    this.setState({ status: 'device connected' });
    this.toggleBusy(false, 'Home', 'onProviderDeviceConnected');
    this.setState({ connectedDevice: device });
    this.setState({ isDeviceConnected: true });
    this.startStream();
  };

  onProviderDeviceDisconnected: () => void = () => {
    console.debug('device disconnected');
    this.setState({ status: 'device disconnected' });
    this.toggleBusy(false, 'Home', 'onProviderDeviceDisconnected');
    this.setState({ connectedDevice: null });
    this.setState({ isDeviceConnected: false });
  };

  startStream() {
    console.debug('starting stream');
    this.setState({ status: 'starting stream' });
    this.toggleBusy(true, 'Home', 'startStream');
    this.props.provider.startStream();
  }

  selectDevice: (device: IDataProviderDevice) => void = (device: IDataProviderDevice) => {
    console.debug('selecting device', device);
    this.setState({ status: 'selecting device' });
    this.toggleBusy(true, 'Home', 'selectDevice');
    this.props.provider.connectDevice(device);
  };

  initializeProvider() {
    console.debug('initializing provider');
    this.setState({ status: 'initializing provider' });
    this.toggleBusy(true, 'Home', 'initializeProvider');
    this.props.provider.initialize();
  }

  toggleBusy(isBusy: boolean, svc: string, src: string): void {
    // console.debug(`[${svc}] isBusy:[${isBusy}] src:[${src}]`);
    this.setState({ isBusy });
  }

  getTabIcon(serviceCode: string, tabStyle: any) {
    let iconColor = serviceCode === this.state.activeServiceTabName ? tabStyle.colors.primary : tabStyle.colors.blur;
    return getIcon(ServiceProperty[serviceCode].icon, iconColor);
  }

  render() {
    const appConfig = getAppConfig();
    this.commonStyle = getStyleSheet(appConfig.themeName);
    this.tabStyle = getTabTheme(appConfig.themeName);

    return (
      <NavigationContainer
        theme={this.tabStyle}
        onStateChange={state => {
          console.log(`NavigationContainer.key: ${state?.routes[state?.index]?.name}`);
          this.setState({ activeServiceTabName: state?.routes[state?.index]?.name || '' });
        }}>
        <View>
          {this.state.isBusy && (
            <Progress.Bar indeterminate={true} indeterminateAnimationDuration={500} color={this.commonStyle.container.color} borderRadius={0} unfilledColor={this.commonStyle.container.backgroundColor} borderWidth={0} width={1000} />
          )}
          {!this.state.isBusy && <Progress.Bar progress={1} color={this.commonStyle.container.color} borderRadius={0} unfilledColor={this.commonStyle.container.backgroundColor} borderWidth={0} width={1000} />}
        </View>
        {this.state.isDeviceConnected && (
          <Tab.Navigator
            initialRouteName={ServiceCode.VehicleSensor}
            screenOptions={({ route }) => ({
              tabBarInactiveTintColor: this.tabStyle.colors.blur,
              tabBarActiveTintColor: this.tabStyle.colors.primary,
            })}>
            <Tab.Screen
              name={ServiceCode.VehicleSensor}
              options={{ unmountOnBlur: true, header: () => undefined, tabBarIcon: () => this.getTabIcon(ServiceCode.VehicleSensor, this.tabStyle) }}
              children={() => <ServiceView provider={this.props.provider} serviceCode={ServiceCode.VehicleSensor} toggleBusy={(isBusy: boolean, svc: string, src: string) => this.toggleBusy(isBusy, svc, src)} ref={this.refServiceView} />}
            />

            <Tab.Screen
              name={ServiceCode.ThrottleControl}
              options={{ unmountOnBlur: true, header: () => undefined, tabBarIcon: () => this.getTabIcon(ServiceCode.ThrottleControl, this.tabStyle) }}
              children={() => <ServiceView provider={this.props.provider} serviceCode={ServiceCode.ThrottleControl} toggleBusy={(isBusy: boolean, svc: string, src: string) => this.toggleBusy(isBusy, svc, src)} ref={this.refServiceView} />}
            />

            <Tab.Screen
              name={ServiceCode.Thermometer}
              options={{ unmountOnBlur: true, header: () => undefined, tabBarIcon: () => this.getTabIcon(ServiceCode.Thermometer, this.tabStyle) }}
              children={() => <ServiceView provider={this.props.provider} serviceCode={ServiceCode.Thermometer} toggleBusy={(isBusy: boolean, svc: string, src: string) => this.toggleBusy(isBusy, svc, src)} ref={this.refServiceView} />}
            />

            <Tab.Screen
              name={ServiceCode.SystemStats}
              options={{ unmountOnBlur: true, header: () => undefined, tabBarIcon: () => this.getTabIcon(ServiceCode.SystemStats, this.tabStyle) }}
              children={() => <ServiceView provider={this.props.provider} serviceCode={ServiceCode.SystemStats} toggleBusy={(isBusy: boolean, svc: string, src: string) => this.toggleBusy(isBusy, svc, src)} ref={this.refServiceView} />}
            />

            <Tab.Screen
              name={ServiceCode.TurnSignalModule}
              options={{ unmountOnBlur: true, header: () => undefined, tabBarIcon: () => this.getTabIcon(ServiceCode.TurnSignalModule, this.tabStyle) }}
              children={() => <ServiceView provider={this.props.provider} serviceCode={ServiceCode.TurnSignalModule} toggleBusy={(isBusy: boolean, svc: string, src: string) => this.toggleBusy(isBusy, svc, src)} ref={this.refServiceView} />}
            />

            <Tab.Screen
              name={ServiceCode.VehicleInfo}
              options={{ unmountOnBlur: true, header: () => undefined, tabBarIcon: () => this.getTabIcon(ServiceCode.VehicleInfo, this.tabStyle) }}
              children={() => <ServiceView provider={this.props.provider} serviceCode={ServiceCode.VehicleInfo} toggleBusy={(isBusy: boolean, svc: string, src: string) => this.toggleBusy(isBusy, svc, src)} ref={this.refServiceView} />}
            />

            <Tab.Screen
              name="CFG"
              options={{ unmountOnBlur: true, header: () => undefined, tabBarIcon: () => this.getTabIcon('CFG', this.tabStyle) }}
              children={() => (
                <AppConfigView
                  onAppConfigChange={() => {
                    this.forceUpdate();
                  }}
                />
              )}
            />
          </Tab.Navigator>
        )}
        {!this.state.isDeviceConnected && (
          <View style={this.commonStyle.centerContainer}>
            <Text style={this.commonStyle.heading}>{appConfig.ownerName}</Text>
            <Text style={this.commonStyle.brand}>{appConfig.appTitle}</Text>
            <Text style={this.commonStyle.heading}>{appConfig.dataProvider === DataProviderType.Bluetooth ? 'bluetooth' : 'mock'} connection</Text>
            <Text style={this.commonStyle.text}>please connect to the device</Text>

            <View style={[this.commonStyle.centerContainer, { margin: 0, marginTop: 10, padding: 0, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end' }]}>
              <MaterialCommunityIcons.Button
                backgroundColor={this.commonStyle.actionBarButton.backgroundColor}
                size={this.commonStyle.actionBarButton.fontSize}
                name="cog"
                style={[this.commonStyle.actionBarButtonRunning, { width: 110, padding: 6 }]}
                color={this.commonStyle.actionBarButtonRunning.color}
                onPress={() => this.setState({ willDisplayAppConfig: !this.state.willDisplayAppConfig })}>
                CONFIG
              </MaterialCommunityIcons.Button>

              {!this.state.willDisplayAppConfig && (
                <MaterialCommunityIcons.Button
                  backgroundColor={this.commonStyle.actionBarButton.backgroundColor}
                  size={this.commonStyle.actionBarButton.fontSize}
                  name="bluetooth"
                  style={[this.commonStyle.actionBarButtonRunning, { marginLeft: 30, width: 110, padding: 6 }]}
                  color={this.commonStyle.actionBarButtonRunning.color}
                  onPress={() => this.initializeProvider()}>
                  START
                </MaterialCommunityIcons.Button>
              )}
            </View>
            <Text style={this.commonStyle.text}> </Text>
            {this.state.isBusy && !this.state.isDeviceConnected && <Text style={this.commonStyle.textSmall}>{this.state.status}</Text>}
            {!this.state.isBusy && !this.state.isDeviceConnected && <Text style={this.commonStyle.textSmall}> </Text>}
          </View>
        )}

        {this.state.willDisplayAppConfig && (
          <AppConfigView
            onAppConfigChange={() => {
              this.forceUpdate();
            }}
          />
        )}

        {!this.state.isDeviceConnected && !this.state.willDisplayAppConfig && (
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
