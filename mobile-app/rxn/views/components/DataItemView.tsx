import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { IItemProperties, getFormattedValue } from '../../models';
import { getStyleSheet } from '../../themes';

export class DataItemView extends Component<IItemProperties> {
  commonStyle: any;

  constructor(props: any) {
    super(props);
    this.commonStyle = getStyleSheet(this.props.appConfig?.themeName);
  }

  render() {
    const { formattedValue, fieldInfo } = getFormattedValue(this.props.fieldName, this.props.value, this.props.serviceCode);
    if (!fieldInfo?.available) {
      return null;
    }
    return (
      <View style={this.commonStyle.sensorItem} key={this.props.fieldName}>
        <Text style={this.commonStyle.sensorTitle}>{fieldInfo.title}</Text>
        <Text style={this.commonStyle.sensorValue}>{formattedValue}</Text>
        {fieldInfo.unit && <Text style={this.commonStyle.sensorUnit}>{fieldInfo.unit}</Text>}
      </View>
    );
  }
}
