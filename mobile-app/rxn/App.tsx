import React, { Component, useRef } from 'react';
import { DefaultAppConfig, IAppConfig, readAppConfig } from './config';
import { MockBluetoothSerialDataProvider } from './services/mockbt-data-provider';
import HomeView from './views/HomeView';

interface IState {
  appConfig: IAppConfig;
}

const dataProvider = new MockBluetoothSerialDataProvider();

class App extends Component<void, IState> {
  constructor(props: any) {
    super(props);
    this.state = { appConfig: readAppConfig() };
    console.log('++ App.constructor');
  }

  updateAppConfig = (appConfig: IAppConfig) => {
    this.setState({ appConfig });
    console.log('++ App.updateAppConfig', appConfig);
  };

  componentDidMount() {
    const appConfig = readAppConfig();
    this.updateAppConfig(appConfig);
    console.log('++ App.componentDidMount', appConfig);
  }
  render() {
    return <HomeView provider={dataProvider} appConfig={this.state.appConfig} appConfigStateChanger={(appConfig: IAppConfig) => this.updateAppConfig(appConfig)} />;
  }
}

export default App;
