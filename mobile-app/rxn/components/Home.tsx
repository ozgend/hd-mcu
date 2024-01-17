/* eslint-disable react/no-unstable-nested-components */
import React, {Component} from 'react';
import {Button, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles, {TabTheme} from '../styles';
import {IDataProvider} from '../services/interfaces';
import {BtDataServiceTypes} from '../models';
import {MockDataProvider} from '../services/mock-data-provider';
import {BaseSensorViewComponent} from './Views/BaseSensorViewComponent';

interface IState {
  isProviderBroadcasting: boolean;
  isProviderAvailable: boolean;
  dataProvider: IDataProvider;
  receivedData: string;
}

const Tab = createBottomTabNavigator();
const dataProvider = new MockDataProvider();

class Home extends Component<void, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      isProviderBroadcasting: false,
      isProviderAvailable: false,
      receivedData: '--',
      dataProvider,
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
    return <MaterialCommunityIcons name={name} size={26} color="#000000" />;
  }

  render() {
    return (
      <NavigationContainer theme={TabTheme}>
        {this.state.isProviderAvailable && this.state.dataProvider && (
          <Tab.Navigator>
            <Tab.Screen
              name={BtDataServiceTypes.DEV}
              options={{
                title: 'Device',
                unmountOnBlur: true,
                tabBarIcon: () => this.iconSet('motorbike'),
              }}
              children={() => (
                <BaseSensorViewComponent
                  provider={this.state.dataProvider}
                  serviceName={BtDataServiceTypes.DEV}
                />
              )}
            />
            <Tab.Screen
              name={BtDataServiceTypes.MUX}
              options={{
                title: 'MUX Thermometers',
                unmountOnBlur: true,
                tabBarIcon: () => this.iconSet('thermometer-lines'),
              }}
              children={() => (
                <BaseSensorViewComponent
                  provider={this.state.dataProvider}
                  serviceName={BtDataServiceTypes.MUX}
                />
              )}
            />
            <Tab.Screen
              name={BtDataServiceTypes.SYS}
              options={{
                title: 'System',
                unmountOnBlur: true,
                tabBarIcon: () => this.iconSet('bluetooth-settings'),
              }}
              children={() => (
                <BaseSensorViewComponent
                  provider={this.state.dataProvider}
                  serviceName={BtDataServiceTypes.SYS}
                />
              )}
            />
            <Tab.Screen
              name={BtDataServiceTypes.TSM}
              options={{
                title: 'Turn Signal Module',
                unmountOnBlur: true,
                tabBarIcon: () => this.iconSet('arrow-left-right'),
              }}
              children={() => (
                <BaseSensorViewComponent
                  provider={this.state.dataProvider}
                  serviceName={BtDataServiceTypes.TSM}
                />
              )}
            />
          </Tab.Navigator>
        )}
        {!this.state.isProviderAvailable && (
          <View style={styles.centerContainer}>
            <Text style={styles.sensorTitle}>bluetooth not connected</Text>
            <Text style={styles.sensorTitle}>please connect to a device</Text>
            <Button title="Connect" onPress={() => this.makeConnection()} />
          </View>
        )}
      </NavigationContainer>
    );
  }
}

export default Home;
