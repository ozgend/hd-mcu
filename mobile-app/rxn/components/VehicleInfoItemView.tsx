import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { styles } from './shared';
import { getSensorFieldInfo } from '../models';

export interface IInfoItemProps {
  fieldName: string;
  value: string | number | boolean | null | undefined | any;
}

export class VehicleInfoItemView extends Component<IInfoItemProps> {
  render() {
    const fieldInfo = getSensorFieldInfo(this.props.fieldName);

    if (!fieldInfo?.available) {
      return null;
    }

    const value = fieldInfo?.formatter ? fieldInfo.formatter(this.props.value) : this.props.value ?? 'N/A';

    return (
      <View style={styles.infoItem} key={this.props.fieldName}>
        <Text style={styles.infoTitle}>{fieldInfo.title}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    );
  }
}
