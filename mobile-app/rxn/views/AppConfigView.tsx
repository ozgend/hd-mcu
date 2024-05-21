import React, { Component } from 'react';
import { ScrollView, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RNRestart from 'react-native-restart';
import { IDataProvider } from '../services/interfaces';
import { IServiceAttributes, ServiceProperty, ServiceDataFields } from '../models';
import { IServiceState } from '../../../ts-schema/data.interface';
import { MaxItemSize } from '../../../ts-schema/constants';
import { VehicleInfoItemView } from './components/VehicleInfoItemView';
import { EditableInfoItemView } from './components/EditableInfoItemView';
import { getStyleSheet } from '../themes';
import { IAppConfig, writeAppConfig, writeAppConfigField } from '../config';

export interface IAppConfigViewProps {
  appConfig: IAppConfig;
  appConfigStateChanger?: (appConfig: IAppConfig) => void;
  appConfigReloader?: () => void;
}

export interface IAppConfigViewState {
  appConfig: IAppConfig;
  isEditing?: boolean;
}

export class AppConfigView extends Component<IAppConfigViewProps, IAppConfigViewState> {
  commonStyle: any;
  serviceCode: string = 'CFG';
  serviceAttributes: IServiceAttributes = ServiceProperty[this.serviceCode];
  editedAppConfig: IAppConfig = { ...this.props.appConfig };

  constructor(props: any) {
    super(props);
    this.state = { appConfig: this.props.appConfig, isEditing: true };
    this.commonStyle = getStyleSheet(this.props.appConfig.themeName);
  }

  async componentDidMount(): Promise<void> {
    console.debug(`${this.serviceCode} mounted`);
  }

  async componentWillUnmount(): Promise<void> {
    console.debug(`${this.serviceCode} unmounting`);
    await writeAppConfig(this.state.appConfig);
  }

  async saveAppConfig(): Promise<void> {
    await writeAppConfig(this.editedAppConfig);
    this.props.appConfigStateChanger?.(this.editedAppConfig);
  }

  async setAppConfigField(fieldName: string, value: any): Promise<void> {
    const appConfig = { ...this.editedAppConfig, [fieldName]: value };
    this.setState({ appConfig });
    this.editedAppConfig = appConfig;
    console.log(`setAppConfigField: ${fieldName}=[${value}]`);
    console.log('setAppConfig', JSON.stringify(appConfig, null, 2));
    await writeAppConfigField(fieldName, value);
    this.props.appConfigStateChanger?.(this.editedAppConfig);
  }

  async restartApp(): Promise<void> {
    RNRestart.Restart();
  }

  render() {
    return (
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={this.commonStyle.scrollContainer}>
        <View style={this.commonStyle.actionBarView}>
          <Text style={this.commonStyle.actionBarHeader}>{this.serviceAttributes.title}</Text>

          {this.serviceAttributes.isEditable && (
            <MaterialCommunityIcons.Button
              backgroundColor={this.commonStyle.actionBarButton.backgroundColor}
              size={this.commonStyle.actionBarButton.fontSize}
              name="content-save"
              style={this.commonStyle.actionBarButtonRunning}
              color={this.commonStyle.actionBarButtonRunning.color}
              onPress={() => this.saveAppConfig()}>
              {'SAVE'}
            </MaterialCommunityIcons.Button>
          )}
        </View>

        {Object.keys(this.state?.appConfig ?? {})
          .sort((a, b) => (ServiceDataFields[this.serviceCode][a]?.order ?? MaxItemSize) - (ServiceDataFields[this.serviceCode][b]?.order ?? MaxItemSize + 1))
          .map(fieldName => {
            if (this.state.isEditing) {
              return (
                <EditableInfoItemView
                  key={fieldName}
                  fieldName={fieldName}
                  value={this.editedAppConfig[fieldName as keyof typeof this.editedAppConfig]}
                  setServiceData={(fieldName, value) => this.setAppConfigField(fieldName, value)}
                  serviceCode={this.serviceCode}
                  availableValues={ServiceDataFields[this.serviceCode][fieldName]?.availableValues}
                  appConfig={this.state.appConfig}
                />
              );
            } else {
              return <VehicleInfoItemView key={fieldName} fieldName={fieldName} value={this.editedAppConfig[fieldName as keyof typeof this.editedAppConfig]} serviceCode={this.serviceCode} appConfig={this.state.appConfig} />;
            }
          })}

        {/* {JSON.stringify(this.props.appConfig) !== JSON.stringify(this.editedAppConfig) && ( */}
        <View style={this.commonStyle.centerContainer}>
          <Text style={this.commonStyle.infoTitle}></Text>
          <Text style={this.commonStyle.infoTitle}>restart to apply changes</Text>
          <Text style={this.commonStyle.infoTitle}></Text>
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
        {/* )} */}
      </ScrollView>
    );
  }
}
