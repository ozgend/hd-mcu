import React, { Component } from 'react';
import codePush from 'react-native-code-push';
import HomeView from './components/HomeView';
import { MockBluetoothSerialDataProvider } from './services/mockbt-data-provider';

const dataProvider = new MockBluetoothSerialDataProvider();

class App extends Component {
  render() {
    return <HomeView provider={dataProvider} />;
  }
}

export default codePush(App);
