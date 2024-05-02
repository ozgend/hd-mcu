import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../shared';
import { IItemProperties, getFormattedValue } from '../../models';

export class VehicleInfoItemView extends Component<IItemProperties> {
  render() {
    const { formattedValue, fieldInfo } = getFormattedValue(this.props.fieldName, this.props.value, this.props.serviceCode);
    if (!fieldInfo?.available) {
      return null;
    }
    return (
      <View style={styles.infoItemVehicle} key={this.props.fieldName}>
        <Text style={styles.infoTitleVehicle}>{fieldInfo.title}</Text>
        <Text style={styles.infoValueVehicle}>{formattedValue}</Text>
      </View>
    );
  }
}
