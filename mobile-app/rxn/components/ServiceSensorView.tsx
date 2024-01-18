import React, { Component } from 'react';
import { Button, ScrollView, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { IDataProvider } from '../services/interfaces';
import { SensorItemView } from './SensorItemView';
import * as Progress from 'react-native-progress';
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
  isBusy: boolean;
}

export class ServiceSensorView extends Component<ISensorViewProps<IDataProvider>, ISensorViewStateData<IServiceState>> {
  constructor(props: any) {
    super(props);
    this.state = { isPolling: false, serviceData: {}, serviceInfo: {}, isBusy: true };
  }

  workerPid: any;
  serviceAttributes: IServiceAttributes = ServiceProperty[this.props.serviceCode];

  async componentDidMount(): Promise<void> {
    console.debug(`${this.props.serviceCode} mounted`);
    this.setState({ isBusy: true });

    this.props.provider.addServiceEventListener(this.props.serviceCode, ServiceEvent.DATA, (serviceData: any) => {
      this.setState({ isBusy: false });
      this.setState({ serviceData });
    });

    this.props.provider.addServiceEventListener(this.props.serviceCode, ServiceEvent.STATUS, (serviceInfo: IServiceStatusInfo) => {
      this.setState({ isBusy: false });
      this.setState({ serviceInfo });
    });

    this.props.provider.requestBtServiceInfo(this.props.serviceCode);
  }

  async componentWillUnmount(): Promise<void> {
    clearInterval(this.workerPid);
    console.debug(`${this.props.serviceCode} unmounting`);
    this.setState({ isBusy: true });
    this.props.provider.removeServiceEventListener(this.props.serviceCode);
    await this.props.provider.sendBtServiceCommand(this.props.serviceCode, ServiceCommand.STOP);
  }

  toggleService(): void {
    this.setState({ isBusy: true });
    this.props.provider.requestBtServiceInfo(this.props.serviceCode);
    if (!this.state.isPolling) {
      this.workerPid = setInterval(() => {
        this.props.provider.requestBtServiceData(this.props.serviceCode);
      }, this.serviceAttributes.pollInterval ?? 5000);
    } else {
      clearInterval(this.workerPid);
      this.props.provider.sendBtServiceCommand(this.props.serviceCode, ServiceCommand.STOP);
    }
    this.setState({ isPolling: !this.state.isPolling });
    console.debug(`${this.props.serviceCode} ${this.state.isPolling ? 'started' : 'stopped'}`);
  }

  render() {
    return (
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.container}>
        {this.state.isBusy && <Progress.Bar indeterminate={true} color={styles.container.color} borderRadius={0} unfilledColor={styles.container.backgroundColor} borderWidth={0} width={1000} />}
        {!this.state.isBusy && <Progress.Bar progress={1} color={styles.container.color} borderRadius={0} unfilledColor={styles.container.backgroundColor} borderWidth={0} width={1000} />}

        <View style={styles.actionBarView}>
          <Text style={styles.actionBarHeader}>{this.serviceAttributes.title}</Text>
          <MaterialCommunityIcons.Button
            backgroundColor={styles.actionBarButton.backgroundColor}
            size={styles.actionBarButton.fontSize}
            name={this.state.isPolling ? 'stop-circle' : 'play-circle'}
            style={this.state.isPolling ? styles.actionBarButtonRunning : styles.actionBarButton}
            color={this.state.isPolling ? styles.actionBarButtonRunning.color : styles.actionBarButton.color}
            onPress={() => this.toggleService()}>
            {this.state.isPolling ? 'STOP' : 'START'}
          </MaterialCommunityIcons.Button>
          <MaterialCommunityIcons style={styles.actionBarStatusIcon} size={styles.actionBarStatusIcon.fontSize} color={this.state.isPolling ? '#4f4' : '#f44'} name={'circle'} />
        </View>
        <Text> </Text>
        {this.state.isBusy && (
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
