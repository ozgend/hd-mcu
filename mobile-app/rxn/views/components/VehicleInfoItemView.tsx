import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { IItemProperties, getFormattedValue } from '../../models';
import { getStyleSheet } from '../../themes';
import { AppConfigField, getAppConfigField } from '../../config';

export class VehicleInfoItemView extends Component<IItemProperties> {
  commonStyle: any;

  constructor(props: any) {
    super(props);
  }

  render() {
    const themeName = getAppConfigField(AppConfigField.ThemeName);
    this.commonStyle = getStyleSheet(themeName);

    const { formattedValue, fieldInfo } = getFormattedValue(this.props.fieldName, this.props.value, this.props.serviceCode);
    if (!fieldInfo?.available) {
      return null;
    }
    return (
      <View style={this.commonStyle.infoItemVehicle} key={this.props.fieldName}>
        <Text style={this.commonStyle.infoTitleVehicle}>{fieldInfo.title}</Text>
        <Text style={this.commonStyle.infoValueVehicle}>{formattedValue}</Text>
      </View>
    );
  }
}
