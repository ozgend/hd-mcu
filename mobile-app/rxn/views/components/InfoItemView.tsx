import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { IItemProperties, getFormattedValue } from '../../models';
import { getStyleSheet } from '../../themes';
import { getAppConfigField, AppConfigField } from '../../config';

export class InfoItemView extends Component<IItemProperties> {
  commonStyle: any;

  constructor(props: any) {
    super(props);
  }

  render() {
    const themeName = getAppConfigField(AppConfigField.ThemeName);
    this.commonStyle = getStyleSheet(themeName);

    if (this.props.value === undefined || this.props.value === null) {
      return null;
    }
    const { formattedValue, fieldInfo } = getFormattedValue(this.props.fieldName, this.props.value, this.props.serviceCode);
    if (!fieldInfo?.available) {
      return null;
    }
    return (
      <View style={this.commonStyle.infoItem} key={this.props.fieldName}>
        <Text style={this.commonStyle.infoTitle}>{fieldInfo.title}</Text>
        <Text style={this.commonStyle.infoValue}>{formattedValue}</Text>
      </View>
    );
  }
}
