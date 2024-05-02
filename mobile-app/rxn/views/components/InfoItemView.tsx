import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../shared';
import { IItemProperties, getFormattedValue } from '../../models';

export class InfoItemView extends Component<IItemProperties> {
  constructor(props: any) {
    super(props);
  }

  render() {
    if (this.props.value === undefined || this.props.value === null) {
      return null;
    }
    const { formattedValue, fieldInfo } = getFormattedValue(this.props.fieldName, this.props.value, this.props.serviceCode);
    if (!fieldInfo?.available) {
      return null;
    }
    return (
      <View style={styles.infoItem} key={this.props.fieldName}>
        <Text style={styles.infoTitle}>{fieldInfo.title}</Text>
        <Text style={styles.infoValue}>{formattedValue}</Text>
      </View>
    );
  }
}
