import React, { Component } from 'react';
import { ScrollView, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { IDataProvider } from '../services/interfaces';
import { DataItemView } from './components/DataItemView';
import * as Progress from 'react-native-progress';
import { IServiceAttributes, ServiceProperty, ServiceInfoFields, ServiceDataFields } from '../models';
import { IServiceState, IServiceStatusInfo } from '../../../ts-schema/data.interface';
import { Hardware, MaxItemSize, ServiceCode, ServiceCommand } from '../../../ts-schema/constants';
import { InfoItemView } from './components/InfoItemView';
import { VehicleInfoItemView } from './components/VehicleInfoItemView';
import { EditableInfoItemView } from './components/EditableInfoItemView';
import { getStyleSheet } from '../themes';
import { AppConfigField, getAppConfigField } from '../config';

export interface IServicerViewProps<IProvider> {
  provider: IProvider;
  serviceCode: string;
}

export interface IServiceViewState<TSensorData> {
  serviceData: TSensorData;
  serviceInfo: IServiceStatusInfo | any;
  isPolling: boolean;
  isBusy: boolean;
  isEditing?: boolean;
  willDisplayServiceInfo?: boolean;
}

export class ServiceView extends Component<IServicerViewProps<IDataProvider>, IServiceViewState<IServiceState>> {
  commonStyle: any;

  constructor(props: any) {
    super(props);
    this.state = { isPolling: false, serviceData: {}, serviceInfo: {}, isBusy: true, willDisplayServiceInfo: false };
  }

  workerPid: any;
  serviceAttributes: IServiceAttributes = ServiceProperty[this.props.serviceCode];
  editedServiceData: any = {};

  async componentDidMount(): Promise<void> {
    console.debug(`${this.props.serviceCode} mounted`);
    this.setState({ isBusy: true });

    this.props.provider.addServiceEventListener(this.props.serviceCode, ServiceCommand.DATA, (serviceData: any) => {
      this.setState({ isBusy: false });
      this.setState({ serviceData });
    });

    this.props.provider.addServiceEventListener(this.props.serviceCode, ServiceCommand.INFO, (serviceInfo: IServiceStatusInfo) => {
      this.setState({ isBusy: false });
      this.setState({ serviceInfo });
    });

    this.props.provider.requestBtServiceInfo(this.props.serviceCode);

    if (this.serviceAttributes.pollOnce) {
      this.props.provider.requestBtServiceData(this.props.serviceCode);
    }

    if (this.serviceAttributes.autoStart) {
      this.toggleService();
    }
  }

  async componentWillUnmount(): Promise<void> {
    clearInterval(this.workerPid);
    console.debug(`${this.props.serviceCode} unmounting`);
    this.setState({ isBusy: true });
    this.props.provider.removeServiceEventListener(this.props.serviceCode);
    await this.props.provider.sendBtServiceCommand(this.props.serviceCode, ServiceCommand.STOP);
  }

  toggleService(): void {
    if (this.serviceAttributes.pollOnce) {
      return;
    }

    console.debug(`${this.props.serviceCode} polling ${!this.state.isPolling ? 'start' : 'stop'}`);
    this.setState({ isBusy: true });
    this.props.provider.requestBtServiceInfo(this.props.serviceCode);
    if (!this.state.isPolling) {
      this.workerPid = setInterval(() => {
        this.setState({ isBusy: true });
        this.props.provider.requestBtServiceData(this.props.serviceCode);
      }, this.serviceAttributes.pollInterval ?? Hardware.SERVICE_POLL_INTERVAL);
    } else {
      clearInterval(this.workerPid);
      this.props.provider.sendBtServiceCommand(this.props.serviceCode, ServiceCommand.STOP);
    }

    this.setState({ isPolling: !this.state.isPolling });
  }

  toggleEdit(): void {
    const toState = !this.state.isEditing;
    this.setState({ isEditing: !this.state.isEditing });
    if (!toState) {
      this.setState({ serviceData: Object.assign({}, this.state.serviceData, this.editedServiceData) });
      this.props.provider.sendBtServiceCommand(this.props.serviceCode, ServiceCommand.SET, this.state.serviceData);
    }
    console.log(this.state.serviceData);
  }

  requestServiceData(): void {
    this.setState({ isBusy: true });
    this.props.provider.requestBtServiceData(this.props.serviceCode);
  }

  setServiceData(fieldName: string, value: any): void {
    this.setState({ serviceData: { ...this.state.serviceData, [fieldName]: value } });
  }

  render() {
    const themeName = getAppConfigField(AppConfigField.ThemeName);
    this.commonStyle = getStyleSheet(themeName);

    return (
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={this.commonStyle.scrollContainer}>
        {this.state.isBusy && <Progress.Bar indeterminate={true} color={this.commonStyle.container.color} borderRadius={0} unfilledColor={this.commonStyle.container.backgroundColor} borderWidth={0} width={1000} />}
        {!this.state.isBusy && <Progress.Bar progress={1} color={this.commonStyle.container.color} borderRadius={0} unfilledColor={this.commonStyle.container.backgroundColor} borderWidth={0} width={1000} />}

        <View style={this.commonStyle.actionBarView}>
          <Text
            style={this.commonStyle.actionBarHeader}
            onPress={() => {
              this.setState({ willDisplayServiceInfo: !this.state.willDisplayServiceInfo });
            }}>
            {this.serviceAttributes.title}
          </Text>

          {this.serviceAttributes.isEditable && (
            <MaterialCommunityIcons.Button
              backgroundColor={this.commonStyle.actionBarButton.backgroundColor}
              size={this.commonStyle.actionBarButton.fontSize}
              name={this.state.isEditing ? 'stop-circle' : 'play-circle'}
              style={this.state.isEditing ? this.commonStyle.actionBarButtonRunning : this.commonStyle.actionBarButton}
              color={this.state.isEditing ? this.commonStyle.actionBarButtonRunning.color : this.commonStyle.actionBarButton.color}
              onPress={() => this.toggleEdit()}>
              {this.state.isEditing ? 'SAVE' : 'EDIT'}
            </MaterialCommunityIcons.Button>
          )}

          {!this.serviceAttributes.pollOnce && <MaterialCommunityIcons style={this.commonStyle.actionBarStatusIcon} size={this.commonStyle.actionBarStatusIcon.fontSize} color={this.state.isPolling ? '#4f4' : '#f44'} name={'circle'} />}

          {!this.serviceAttributes.pollOnce && (
            <MaterialCommunityIcons.Button
              backgroundColor={this.commonStyle.actionBarButton.backgroundColor}
              size={this.commonStyle.actionBarButton.fontSize}
              name={this.state.isPolling ? 'stop-circle' : 'play-circle'}
              style={this.state.isPolling ? this.commonStyle.actionBarButtonRunning : this.commonStyle.actionBarButton}
              color={this.state.isPolling ? this.commonStyle.actionBarButtonRunning.color : this.commonStyle.actionBarButton.color}
              onPress={() => this.toggleService()}>
              {this.state.isPolling ? 'STOP' : 'START'}
            </MaterialCommunityIcons.Button>
          )}
        </View>

        <View style={this.commonStyle.centerContainer}>
          {this.state?.serviceInfo &&
            this.state.willDisplayServiceInfo &&
            Object.keys(this.state?.serviceInfo ?? {})
              .sort((a, b) => (ServiceInfoFields[a]?.order ?? MaxItemSize) - (ServiceInfoFields[b]?.order ?? MaxItemSize + 1))
              .map(fieldName => <InfoItemView key={fieldName} fieldName={fieldName} value={this.state.serviceInfo[fieldName as keyof typeof this.state.serviceInfo]} />)}
          {this.state.willDisplayServiceInfo && (
            <Text style={this.commonStyle.infoTitle}>
              {`[${this.props.serviceCode}]`} {this.state.serviceInfo?.status ?? 'in progress...'}
            </Text>
          )}
        </View>

        {this.state?.serviceData &&
          this.props.serviceCode !== ServiceCode.VehicleInfo &&
          Object.keys(this.state?.serviceData ?? {})
            .sort((a, b) => (ServiceDataFields[this.props.serviceCode][a]?.order ?? MaxItemSize) - (ServiceDataFields[this.props.serviceCode][b]?.order ?? MaxItemSize + 1))
            .map(fieldName => <DataItemView key={fieldName} fieldName={fieldName} value={this.state.serviceData[fieldName as keyof typeof this.state.serviceData]} serviceCode={this.props.serviceCode} />)}

        {this.state?.serviceData &&
          this.props.serviceCode === ServiceCode.VehicleInfo &&
          Object.keys(this.state?.serviceData ?? {})
            .sort((a, b) => (ServiceDataFields[this.props.serviceCode][a]?.order ?? MaxItemSize) - (ServiceDataFields[this.props.serviceCode][b]?.order ?? MaxItemSize + 1))
            .map(fieldName => {
              if (this.state.isEditing) {
                return (
                  <EditableInfoItemView
                    key={fieldName}
                    fieldName={fieldName}
                    value={this.state.serviceData[fieldName as keyof typeof this.state.serviceData]}
                    setServiceData={(fieldName, value) => this.setServiceData(fieldName, value)}
                    serviceCode={this.props.serviceCode}
                  />
                );
              } else {
                return <VehicleInfoItemView key={fieldName} fieldName={fieldName} value={this.state.serviceData[fieldName as keyof typeof this.state.serviceData]} serviceCode={this.props.serviceCode} />;
              }
            })}

        <View style={this.commonStyle.centerContainer}></View>
      </ScrollView>
    );
  }
}
