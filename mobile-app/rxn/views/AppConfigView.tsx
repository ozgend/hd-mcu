import React, { Component } from 'react';
import { ScrollView, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Progress from 'react-native-progress';
import RNRestart from 'react-native-restart';
import { IServiceAttributes, ServiceProperty, ServiceDataFields } from '../models';
import { MaxItemSize } from '../../../ts-schema/constants';
import { SchemaVersion } from '../../../ts-schema/schema.version';
import { VehicleInfoItemView } from './components/VehicleInfoItemView';
import { EditableInfoItemView } from './components/EditableInfoItemView';
import { getStyleSheet } from '../themes';
import { IAppConfig, getAppConfig, setAppConfig, setAppConfigField } from '../config';

export interface IAppConfigViewProps {
  // appConfig: IAppConfig;
  onAppConfigChange?: () => void;
}

export interface IAppConfigViewState {
  appConfig: IAppConfig;
  isEditing?: boolean;
}

export class AppConfigView extends Component<IAppConfigViewProps, IAppConfigViewState> {
  commonStyle: any;
  serviceCode: string = 'CFG';
  serviceAttributes: IServiceAttributes = ServiceProperty[this.serviceCode];

  constructor(props: any) {
    super(props);
    this.state = { isEditing: true, appConfig: getAppConfig() };
  }

  async setAppConfigField(fieldName: string, value: any): Promise<void> {
    this.setState({ appConfig: { ...this.state.appConfig, [fieldName]: value } });
    setAppConfigField(fieldName, value);
    if (this.props.onAppConfigChange) {
      this.props.onAppConfigChange();
    }
  }

  async restartApp(): Promise<void> {
    RNRestart.Restart();
  }

  render() {
    this.commonStyle = getStyleSheet(this.state.appConfig.themeName);

    return (
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={this.commonStyle.scrollContainer}>
        <Progress.Bar progress={1} color={this.commonStyle.container.color} borderRadius={0} unfilledColor={this.commonStyle.container.backgroundColor} borderWidth={0} width={1000} />

        <View style={this.commonStyle.actionBarView}>
          <Text style={this.commonStyle.actionBarHeader}>{this.serviceAttributes.title}</Text>
        </View>

        <View style={this.commonStyle.infoItemVehicle}>
          <Text style={this.commonStyle.infoTitleVehicle}>schema version:</Text>
          <Text style={this.commonStyle.infoTitleVehicle}>{SchemaVersion}</Text>
        </View>

        {Object.keys(this.state.appConfig ?? {})
          .sort((a, b) => (ServiceDataFields[this.serviceCode][a]?.order ?? MaxItemSize) - (ServiceDataFields[this.serviceCode][b]?.order ?? MaxItemSize + 1))
          .map(fieldName => {
            if (this.state.isEditing) {
              return (
                <EditableInfoItemView
                  key={fieldName}
                  fieldName={fieldName}
                  value={this.state.appConfig[fieldName as keyof typeof this.state.appConfig]}
                  setServiceData={(fieldName, value) => this.setAppConfigField(fieldName, value)}
                  serviceCode={this.serviceCode}
                  availableValues={ServiceDataFields[this.serviceCode][fieldName]?.availableValues}
                />
              );
            } else {
              return <VehicleInfoItemView key={fieldName} fieldName={fieldName} value={this.state.appConfig[fieldName as keyof typeof this.state.appConfig]} serviceCode={this.serviceCode} />;
            }
          })}

        <View style={this.commonStyle.centerContainer}>
          {/* <Text style={this.commonStyle.infoTitle}></Text>
          <Text style={this.commonStyle.infoTitle}>restart to apply changes</Text>
          <Text style={this.commonStyle.infoTitle}></Text> */}
          <MaterialCommunityIcons.Button
            backgroundColor={this.commonStyle.actionBarButton.backgroundColor}
            size={this.commonStyle.actionBarButton.fontSize}
            name="refresh-circle"
            style={[this.commonStyle.actionBarButtonRunning, { width: 120 }]}
            color={this.commonStyle.actionBarButtonRunning.color}
            onPress={() => this.restartApp()}>
            {'RESTART'}
          </MaterialCommunityIcons.Button>
        </View>
      </ScrollView>
    );
  }
}
