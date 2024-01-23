import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../shared';
import { getInfoField } from '../../models';

interface InfoItemProps {
  fieldName: string;
  value: string | number | boolean | null | undefined | any;
}

export class InfoItemView extends Component<InfoItemProps> {
  constructor(props: any) {
    super(props);
  }

  render() {
    if (this.props.value === undefined || this.props.value === null) {
      return null;
    }

    const fieldInfo = getInfoField(this.props.fieldName);

    if (!fieldInfo) {
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
