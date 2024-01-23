import React, { Component, useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { styles } from './shared';
import { getSensorFieldInfo } from '../models';

export interface IInfoItemProps {
  fieldName: string;
  value: string | number | boolean | null | undefined | any;
  setServiceData: (fieldName: string, value: string | number | boolean | null | undefined | any) => void;
}

export class EditableInfoItemView extends Component<IInfoItemProps> {
  constructor(props: any) {
    super(props);
    this.state = { value: this.props.value?.toString() ?? '' };
  }
  render() {
    const fieldInfo = getSensorFieldInfo(this.props.fieldName);

    if (!fieldInfo?.available) {
      return null;
    }

    return (
      <View style={styles.infoItem} key={this.props.fieldName}>
        <Text style={styles.infoTitle}>{fieldInfo.title}</Text>

        <TextInput
          style={styles.infoValue}
          editable={true}
          defaultValue={this.props.value?.toString() ?? ''}
          onEndEditing={event => {
            this.props.setServiceData(this.props.fieldName, event.nativeEvent.text);
          }}
          // onChangeText={newValue => {
          //   this.props.setServiceData(this.props.fieldName, newValue);
          // }}
        />
      </View>
    );
  }
}
