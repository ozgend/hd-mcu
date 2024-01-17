import React, {Component} from 'react';
import {View, Text} from 'react-native';
import styles from '../../styles';
import {getFieldInfo} from '../../models';

export interface ISensorItemProps {
  fieldName: string;
  value: string | number | boolean | null | undefined | any;
}

export class SensorItem extends Component<ISensorItemProps> {
  render() {
    const fieldInfo = getFieldInfo(this.props.fieldName);

    if (!fieldInfo?.available) {
      return null;
    }

    const value = fieldInfo?.formatter
      ? fieldInfo.formatter(this.props.value)
      : this.props.value;

    return (
      <View style={styles.sensorItem} key={this.props.fieldName}>
        <Text style={styles.sensorTitle}>{fieldInfo.title}</Text>
        <Text style={styles.sensorValue}>{value}</Text>
        {fieldInfo.unit && (
          <Text style={styles.sensorUnit}>{fieldInfo.unit}</Text>
        )}
      </View>
    );
  }
}
