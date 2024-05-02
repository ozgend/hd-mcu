import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../shared';
import { IItemProperties, getFormattedValue } from '../../models';

export class DataItemView extends Component<IItemProperties> {
  render() {
    const { formattedValue, fieldInfo } = getFormattedValue(this.props.fieldName, this.props.value, this.props.serviceCode);
    if (!fieldInfo?.available) {
      return null;
    }
    return (
      <View style={styles.sensorItem} key={this.props.fieldName}>
        <Text style={styles.sensorTitle}>{fieldInfo.title}</Text>
        <Text style={styles.sensorValue}>{formattedValue}</Text>
        {fieldInfo.unit && <Text style={styles.sensorUnit}>{fieldInfo.unit}</Text>}
      </View>
    );
  }
}
