import React, { Component } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { IItemProperties, getFormattedValue } from '../../models';
import DatePicker from 'react-native-date-picker';
import { getStyleSheet } from '../../themes';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface IInfoItemState {
  dateModalOpen?: boolean;
  selectedDate?: Date;
  availableValues?: string[] | number[] | boolean[];
}

export class EditableInfoItemView extends Component<IItemProperties, IInfoItemState> {
  commonStyle: any;

  constructor(props: any) {
    super(props);
    this.commonStyle = getStyleSheet(this.props.appConfig?.themeName);
    this.state = { dateModalOpen: false, selectedDate: new Date() };
  }
  render() {
    const { formattedValue, fieldInfo } = getFormattedValue(this.props.fieldName, this.props.value, this.props.serviceCode);
    if (!fieldInfo?.available) {
      return null;
    }
    return (
      <View style={this.commonStyle.infoItemVehicle} key={this.props.fieldName}>
        <Text style={this.commonStyle.infoTitleVehicle}>{fieldInfo.title}</Text>

        {fieldInfo.type === 'date' && (
          <View style={this.commonStyle.infoValueVehicleEditable}>
            <Pressable
              onPress={() => {
                this.setState({ dateModalOpen: true, selectedDate: new Date(this.props.value) });
              }}>
              <Text style={this.commonStyle.infoValueVehicleEditable}>{formattedValue}</Text>
            </Pressable>
            <DatePicker
              modal
              mode="date"
              open={this.state.dateModalOpen}
              date={this.state.selectedDate ?? new Date()}
              onConfirm={date => {
                this.setState({ dateModalOpen: false, selectedDate: date });
                if (this.props.setServiceData) {
                  this.props.setServiceData(this.props.fieldName, date.getTime());
                }
              }}
              onCancel={() => {
                this.setState({ dateModalOpen: false });
              }}
            />
          </View>
        )}

        {fieldInfo.type === 'array' && (
          <View key={this.props.fieldName} style={{ width: '100%' }}>
            {this.props.availableValues?.map((item: any, index: number) => {
              return (
                <MaterialCommunityIcons.Button
                  key={this.props.fieldName + index}
                  backgroundColor={this.commonStyle.actionBarButton.backgroundColor}
                  size={this.commonStyle.actionBarButton.fontSize}
                  name={this.props.value === item ? 'check-circle' : 'circle-outline'}
                  style={[this.props.value === item ? this.commonStyle.actionBarButtonRunning : this.commonStyle.actionBarButton, { marginVertical: 5, width: 120 }]}
                  color={this.props.value === item ? this.commonStyle.actionBarButtonRunning.color : this.commonStyle.actionBarButton.color}
                  onPress={() => {
                    if (this.props.setServiceData) {
                      this.props.setServiceData(this.props.fieldName, item);
                    }
                  }}>
                  {item.toString().toUpperCase()}
                </MaterialCommunityIcons.Button>
              );
            })}
          </View>
        )}

        {fieldInfo.type !== 'date' && fieldInfo.type !== 'array' && (
          <TextInput
            style={this.commonStyle.infoValueVehicleEditable}
            editable={true}
            onFocus={() => {
              if (fieldInfo.type === 'date') {
                this.setState({ dateModalOpen: true });
              }
            }}
            keyboardType={fieldInfo.type === 'number' ? 'numeric' : 'default'}
            defaultValue={formattedValue.toString()}
            onEndEditing={event => {
              if (this.props.setServiceData) {
                this.props.setServiceData(this.props.fieldName, event.nativeEvent.text);
              }
            }}
          />
        )}
      </View>
    );
  }
}
