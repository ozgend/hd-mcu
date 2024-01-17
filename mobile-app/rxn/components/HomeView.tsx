/* eslint-disable react/no-unstable-nested-components */
import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles, {TabTheme} from '../styles';
import {IDataProvider} from '../services/interfaces';
import {BtDataServiceTypes} from '../models';
import {ServiceSensorView} from './ServiceSensorView';
import {BluetoothSerialDataProvider} from '../services/bt-data-provider';

interface IState {
  isProviderBroadcasting: boolean;
  isProviderAvailable: boolean;
  dataProvider: IDataProvider;
  receivedData: string;
  serviceState: {[key: string]: boolean};
}

const Tab = createBottomTabNavigator();

const dataProvider = new BluetoothSerialDataProvider();

class HomeView extends Component<void, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      isProviderBroadcasting: false,
      isProviderAvailable: false,
      receivedData: '--',
      dataProvider,
      serviceState: {},
    };
  }

  onDataReceived(receivedData: any) {
    this.setState({receivedData});
  }

  async makeConnection() {
    this.state.dataProvider.onUpdate('dataReceived', data =>
      this.onDataReceived(data),
    );
    const isProviderAvailable = await this.state.dataProvider?.initialize();
    this.setState({isProviderAvailable});
    if (isProviderAvailable) {
      const isProviderBroadcasting = this.state.dataProvider.startStream();
      this.setState({isProviderBroadcasting});
    }
  }

  iconSet(name: string): React.ReactNode {
    return <MaterialCommunityIcons name={name} size={26} color="#fa0" />;
  }

  render() {
    return (
      <NavigationContainer theme={TabTheme}>
        {this.state.isProviderAvailable && this.state.dataProvider && (
          <Tab.Navigator>
            <Tab.Screen
              name={BtDataServiceTypes.DEV}
              options={{
                unmountOnBlur: true,
                header: () => undefined,
                tabBarIcon: () => this.iconSet('motorbike'),
              }}
              children={() => (
                <ServiceSensorView
                  provider={this.state.dataProvider}
                  serviceName={BtDataServiceTypes.DEV}
                  title={'Motorbike'}
                  iconName={'motorbike'}
                />
              )}
            />
            <Tab.Screen
              name={BtDataServiceTypes.MUX}
              options={{
                unmountOnBlur: true,
                header: () => undefined,
                tabBarIcon: () => this.iconSet('thermometer-lines'),
              }}
              children={() => (
                <ServiceSensorView
                  provider={this.state.dataProvider}
                  serviceName={BtDataServiceTypes.MUX}
                  title={'MUX Thermometers'}
                  iconName={'thermometer-lines'}
                />
              )}
            />
            <Tab.Screen
              name={BtDataServiceTypes.SYS}
              options={{
                unmountOnBlur: true,
                header: () => undefined,
                tabBarIcon: () => this.iconSet('bluetooth-settings'),
              }}
              children={() => (
                <ServiceSensorView
                  provider={this.state.dataProvider}
                  serviceName={BtDataServiceTypes.SYS}
                  title={'System'}
                  iconName={'bluetooth-settings'}
                />
              )}
            />
            <Tab.Screen
              name={BtDataServiceTypes.TSM}
              options={{
                unmountOnBlur: true,
                header: () => undefined,
                tabBarIcon: () => this.iconSet('arrow-left-right'),
              }}
              children={() => (
                <ServiceSensorView
                  provider={this.state.dataProvider}
                  serviceName={BtDataServiceTypes.TSM}
                  title={'Turn Signal Module'}
                  iconName={'arrow-left-right'}
                />
              )}
            />
          </Tab.Navigator>
        )}
        {!this.state.isProviderAvailable && (
          <View style={styles.centerContainer}>
            <Text style={styles.heading}>BLUETOOTH NOT CONNECTED</Text>
            <Text style={styles.text}>PLEASE CONNECT TO DEVICE</Text>
            <Text style={styles.text}> </Text>
            <MaterialCommunityIcons.Button
              name="bluetooth"
              style={styles.button}
              color={styles.button.color}
              onPress={() => this.makeConnection()}>
              CONNECT
            </MaterialCommunityIcons.Button>
          </View>
        )}
      </NavigationContainer>
    );
  }
}

export default HomeView;
