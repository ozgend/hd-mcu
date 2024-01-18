import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles, tabTheme, getIcon } from './shared';
import { IDataProvider } from '../services/interfaces';
import { BtDataServiceTypes } from '../models';
import { ServiceSensorView } from './ServiceSensorView';
import { BluetoothSerialDataProvider } from '../services/bt-data-provider';

interface IState {
  isProviderBroadcasting: boolean;
  isProviderAvailable: boolean;
  dataProvider: IDataProvider;
  receivedData: string;
  serviceState: { [key: string]: boolean };
}

const Tab = createBottomTabNavigator();

const dataProvider = new BluetoothSerialDataProvider();

class HomeView extends Component<void, IState> {
  constructor(props: any) {
    super(props);
    this.state = { isProviderBroadcasting: false, isProviderAvailable: false, receivedData: '--', dataProvider, serviceState: {} };
  }

  onDataReceived(receivedData: any) {
    this.setState({ receivedData });
  }

  async makeConnection() {
    const isProviderAvailable = await this.state.dataProvider?.initialize();
    this.setState({ isProviderAvailable });
    if (isProviderAvailable) {
      const isProviderBroadcasting = this.state.dataProvider.startStream();
      this.setState({ isProviderBroadcasting });
    }
  }

  render() {
    return (
      <NavigationContainer theme={tabTheme}>
        {this.state.isProviderAvailable && this.state.dataProvider && (
          <Tab.Navigator>
            <Tab.Screen
              name={BtDataServiceTypes.Vehicle}
              options={{ unmountOnBlur: true, header: () => undefined, tabBarIcon: () => getIcon('engine') }}
              children={() => <ServiceSensorView provider={this.state.dataProvider} serviceCode={BtDataServiceTypes.Vehicle} />}
            />
            <Tab.Screen
              name={BtDataServiceTypes.MuxThermo}
              options={{ unmountOnBlur: true, header: () => undefined, tabBarIcon: () => getIcon('thermometer') }}
              children={() => <ServiceSensorView provider={this.state.dataProvider} serviceCode={BtDataServiceTypes.MuxThermo} />}
            />
            <Tab.Screen
              name={BtDataServiceTypes.System}
              options={{ unmountOnBlur: true, header: () => undefined, tabBarIcon: () => getIcon('chip') }}
              children={() => <ServiceSensorView provider={this.state.dataProvider} serviceCode={BtDataServiceTypes.System} />}
            />
            <Tab.Screen
              name={BtDataServiceTypes.TurnSignalModule}
              options={{ unmountOnBlur: true, header: () => undefined, tabBarIcon: () => getIcon('arrow-left-right') }}
              children={() => <ServiceSensorView provider={this.state.dataProvider} serviceCode={BtDataServiceTypes.TurnSignalModule} />}
            />
          </Tab.Navigator>
        )}
        {!this.state.isProviderAvailable && (
          <View style={styles.centerContainer}>
            <Text style={styles.heading}>bluetooth not connected</Text>
            <Text style={styles.text}>please connect to the device first</Text>
            <Text style={styles.text}> </Text>
            <MaterialCommunityIcons.Button name="bluetooth" style={styles.button} color={styles.button.color} onPress={() => this.makeConnection()}>
              CONNECT
            </MaterialCommunityIcons.Button>
          </View>
        )}
      </NavigationContainer>
    );
  }
}

export default HomeView;
