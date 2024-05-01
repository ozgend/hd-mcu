import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../shared';
import { getDataField } from '../../models';

export interface IInfoItemProps {
  serviceCode: string;
  fieldName: string;
  value: string | number | boolean | null | undefined | any;
}

export class VehicleInfoItemView extends Component<IInfoItemProps> {
  render() {
    const fieldInfo = getDataField(this.props.serviceCode, this.props.fieldName);

    if (!fieldInfo?.available) {
      return null;
    }

    const value = fieldInfo?.formatter ? fieldInfo.formatter(this.props.value) : this.props.value ?? 'N/A';

    return (
      <View style={styles.infoItemVehicle} key={this.props.fieldName}>
        <Text style={styles.infoTitleVehicle}>{fieldInfo.title}</Text>
        <Text style={styles.infoValueVehicle}>{value}</Text>
      </View>
    );
  }
}
