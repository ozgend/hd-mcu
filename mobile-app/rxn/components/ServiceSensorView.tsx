import React, { Component } from 'react';
import { ScrollView, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { IDataProvider } from '../services/interfaces';
import { SensorItemView } from './SensorItemView';
import { IServiceAttributes, IServiceState, IServiceStatusInfo, ServiceProperty } from '../models';
import { styles } from './shared';
import { ServiceCommand, ServiceEvent } from '../constants';
import { ServiceInfoView } from './ServiceInfoView';

export interface ISensorViewProps<IProvider> {
  provider: IProvider;
  serviceCode: string;
}

export interface ISensorViewStateData<TSensorData> {
  serviceData: TSensorData;
  serviceInfo: IServiceStatusInfo | any;
  isPolling: boolean;
}

export class ServiceSensorView extends Component<ISensorViewProps<IDataProvider>, ISensorViewStateData<IServiceState>> {
  constructor(props: any) {
    super(props);
    this.state = { isPolling: false, serviceData: {}, serviceInfo: {} };
  }
  workerPid: any;
  serviceAttributes: IServiceAttributes = ServiceProperty[this.props.serviceCode];

  async componentDidMount(): Promise<void> {
    console.debug(`${this.props.serviceCode} mounted`);

    this.props.provider.addServiceEventListener(this.props.serviceCode, ServiceEvent.DATA, (serviceData: any) => {
      this.setState({ serviceData });
    });

    this.props.provider.addServiceEventListener(this.props.serviceCode, ServiceEvent.STATUS, (serviceInfo: IServiceStatusInfo) => {
      this.setState({ serviceInfo });
    });

    this.props.provider.requestServiceInfo(this.props.serviceCode);
  }

  async componentWillUnmount(): Promise<void> {
    console.debug(`${this.props.serviceCode} unmounting`);
    clearInterval(this.workerPid);
    this.props.provider.removeServiceEventListener(this.props.serviceCode);
    await this.props.provider.sendServiceCommand(this.props.serviceCode, ServiceCommand.STOP);
  }

  toggleService(): void {
    this.props.provider.requestServiceInfo(this.props.serviceCode);
    if (!this.state.isPolling) {
      this.workerPid = setInterval(() => {
        this.props.provider.requestServiceData(this.props.serviceCode);
      }, this.serviceAttributes.pollInterval ?? 5000);
    } else {
      clearInterval(this.workerPid);
      this.props.provider.sendServiceCommand(this.props.serviceCode, ServiceCommand.STOP);
    }
    this.setState({ isPolling: !this.state.isPolling });
    console.debug(`${this.props.serviceCode} ${this.state.isPolling ? 'started' : 'stopped'}`);
  }

  render() {
    return (
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.container}>
        <View style={styles.actionBarView}>
          <Text style={styles.actionBarHeader}>{this.serviceAttributes.title}</Text>
          <MaterialCommunityIcons style={styles.actionBarStatusIcon} size={styles.actionBarStatusIcon.fontSize} color={this.state.isPolling ? '#4f4' : '#f44'} name={'circle'} />
          <MaterialCommunityIcons.Button
            size={styles.actionBarButton.fontSize}
            name={this.state.isPolling ? 'stop-circle' : 'play-circle'}
            style={this.state.isPolling ? styles.actionBarButtonRunning : styles.actionBarButton}
            color={this.state.isPolling ? styles.actionBarButtonRunning.color : styles.actionBarButton.color}
            onPress={() => this.toggleService()}>
            {this.state.isPolling ? 'STOP' : 'START'}
          </MaterialCommunityIcons.Button>
        </View>
        <Text> </Text>
        {!this.state.isPolling && (
          <View style={styles.centerContainer}>
            <Text style={styles.heading}>
              {`${this.serviceAttributes.title} [${this.props.serviceCode}]`} {this.state.serviceInfo?.status ?? 'in progress...'}
            </Text>
          </View>
        )}
        {this.state?.serviceInfo &&
          Object.keys(this.state?.serviceInfo ?? {}).map(fieldName => {
            return <ServiceInfoView key={fieldName} fieldName={fieldName} value={this.state.serviceInfo[fieldName as keyof typeof this.state.serviceInfo]} />;
          })}
        {this.state?.serviceData &&
          Object.keys(this.state?.serviceData ?? {}).map(fieldName => {
            return <SensorItemView key={fieldName} fieldName={fieldName} value={this.state.serviceData[fieldName as keyof typeof this.state.serviceData]} />;
          })}
      </ScrollView>
    );
  }
}
