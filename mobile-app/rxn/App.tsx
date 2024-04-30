import React, { Component } from 'react';
import codePush from 'react-native-code-push';
import HomeView from './views/HomeView';
import { MockBluetoothSerialDataProvider } from './services/mockbt-data-provider';
import { BluetoothSerialDataProvider } from './services/bt-data-provider';

const dataProvider = new BluetoothSerialDataProvider();

class App extends Component {
  render() {
    return <HomeView provider={dataProvider} />;
  }
}

export default codePush(App);
