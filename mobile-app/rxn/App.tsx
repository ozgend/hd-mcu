import React, { Component } from 'react';
import { MockBluetoothSerialDataProvider } from './services/mockbt-data-provider';
import HomeView from './views/HomeView';

const dataProvider = new MockBluetoothSerialDataProvider();

class App extends Component {
  constructor(props: any) {
    super(props);
  }

  render() {
    return <HomeView provider={dataProvider} />;
  }
}

export default App;
