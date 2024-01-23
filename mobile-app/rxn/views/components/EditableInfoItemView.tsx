import React, { Component, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { styles } from '../../shared';
import { getDataField } from '../../models';
import DateTimePicker from 'react-native-ui-datepicker';
import DatePicker from 'react-native-date-picker';

interface IInfoItemProps {
  serviceCode: string;
  fieldName: string;
  value: string | number | boolean | null | undefined | any;
  setServiceData: (fieldName: string, value: string | number | boolean | null | undefined | any) => void;
}

interface IInfoItemState {
  dateModalOpen?: boolean;
  selectedDate?: Date;
}

export class EditableInfoItemView extends Component<IInfoItemProps, IInfoItemState> {
  constructor(props: any) {
    super(props);
    this.state = { dateModalOpen: false, selectedDate: new Date() };
  }
  render() {
    const fieldInfo = getDataField(this.props.serviceCode, this.props.fieldName);

    if (!fieldInfo?.available) {
      return null;
    }

    return (
      <View style={styles.infoItem} key={this.props.fieldName}>
        <Text style={styles.infoTitle}>{fieldInfo.title}</Text>
        {/* 
        {fieldInfo.type === 'date' && this.state.dateModalOpen && (
          <DatePicker
            modal
            mode="date"
            open={this.state.dateModalOpen}
            date={this.state.selectedDate ?? new Date()}
            onConfirm={date => {
              this.setState({ dateModalOpen: false, selectedDate: date });
              this.props.setServiceData(this.props.fieldName, date.getTime());
            }}
            onCancel={() => {
              this.setState({ dateModalOpen: false });
            }}
          />
        )}
        {fieldInfo.type === 'date' && !this.state.dateModalOpen && (
          <TouchableOpacity
            style={styles.infoValue}
            onPress={() => {
              this.setState({ dateModalOpen: true });
            }}>
            <Text>{this.props.value ? fieldInfo.formatter(this.props.value) : ''}</Text>
          </TouchableOpacity>
        )} */}

        {/* {fieldInfo.type !== 'date' && ( */}
        <TextInput
          style={(styles.infoValue, { height: 20, padding: 0, margin: 0 })}
          editable={true}
          keyboardType={fieldInfo.type === 'number' ? 'numeric' : 'default'}
          defaultValue={this.props.value?.toString() ?? ''}
          onEndEditing={event => {
            this.props.setServiceData(this.props.fieldName, event.nativeEvent.text);
          }}
        />
        {/* )} */}
      </View>
    );
  }
}
