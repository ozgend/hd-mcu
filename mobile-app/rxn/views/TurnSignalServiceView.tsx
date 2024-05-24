import React, { Component } from 'react';
import { Pressable, View } from 'react-native';
import { getStyleSheet } from '../themes';
import { IDataProvider } from '../services/interfaces';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppConfigField, getAppConfigField } from '../config';
import { ServiceCode, TurnSignalCommands } from '../../../ts-schema/constants';

export interface IProps {
  provider: IDataProvider;
}

export class TurnSignalServiceView extends Component<IProps> {
  commonStyle: any;
  pressableStyle = { width: '20%', margin: '2%' };
  iconStyle = { textAlign: 'center', padding: 0, margin: 0, width: '100%', fontSize: 40 };

  constructor(props: any) {
    super(props);
  }

  sendCommand(command: string) {
    this.props.provider.sendBtServiceCommand(ServiceCode.TurnSignalModule, command);
  }

  render() {
    const themeName = getAppConfigField(AppConfigField.ThemeName);
    this.commonStyle = getStyleSheet(themeName);

    return (
      <View style={[this.commonStyle.centerContainer, { margin: 20, padding: 0, flexDirection: 'row', alignItems: 'stretch', alignSelf: 'flex-start' }]}>
        <Pressable
          style={this.pressableStyle}
          onPress={() => {
            this.sendCommand(TurnSignalCommands.LEFT);
          }}>
          <Icon name="arrow-left" style={[this.commonStyle.actionBarButtonRunning, this.iconStyle]}></Icon>
        </Pressable>

        <Pressable
          style={this.pressableStyle}
          onPress={() => {
            this.sendCommand(TurnSignalCommands.ALL);
          }}>
          <Icon name="arrow-left-right" style={[this.commonStyle.actionBarButtonRunning, this.iconStyle]}></Icon>
        </Pressable>

        <Pressable
          style={{ width: '20%', margin: '2%' }}
          onPress={() => {
            this.sendCommand(TurnSignalCommands.NONE);
          }}>
          <Icon name="cancel" style={[this.commonStyle.actionBarButtonRunning, this.iconStyle]}></Icon>
        </Pressable>

        <Pressable
          style={{ width: '20%', margin: '2%' }}
          onPress={() => {
            this.sendCommand(TurnSignalCommands.RIGHT);
          }}>
          <Icon name="arrow-right" style={[this.commonStyle.actionBarButtonRunning, this.iconStyle]}></Icon>
        </Pressable>
      </View>
    );
  }
}
