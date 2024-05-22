import React, { Component } from 'react';
import { MockBluetoothSerialDataProvider } from './services/mockbt-data-provider';
import HomeView from './views/HomeView';
import { DataProviderType, IDataProvider } from './services/interfaces';
import { AppConfigField, getAppConfigField } from './config';
import { BluetoothSerialDataProvider } from './services/bt-data-provider';

class App extends Component {
  constructor(props: any) {
    super(props);
  }

  render() {
    const dataProviderType = getAppConfigField(AppConfigField.DataProvider);
    let dataProvider: IDataProvider;

    if (dataProviderType === DataProviderType.Bluetooth) {
      dataProvider = new BluetoothSerialDataProvider();
    } else {
      dataProvider = new MockBluetoothSerialDataProvider();
    }

    return <HomeView provider={dataProvider} />;
  }
}

export default App;
