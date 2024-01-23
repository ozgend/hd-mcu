import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../shared';
import { getDataField } from '../../models';

interface IDataItemProps {
  serviceCode: string;
  fieldName: string;
  value: string | number | boolean | null | undefined | any;
}

export class DataItemView extends Component<IDataItemProps> {
  render() {
    const fieldInfo = getDataField(this.props.serviceCode, this.props.fieldName);

    if (!fieldInfo?.available) {
      return null;
    }

    const value = fieldInfo?.formatter ? fieldInfo.formatter(this.props.value) : this.props.value ?? 'N/A';

    return (
      <View style={styles.sensorItem} key={this.props.fieldName}>
        <Text style={styles.sensorTitle}>{fieldInfo.title}</Text>
        <Text style={styles.sensorValue}>{value}</Text>
        {fieldInfo.unit && <Text style={styles.sensorUnit}>{fieldInfo.unit}</Text>}
      </View>
    );
  }
}
