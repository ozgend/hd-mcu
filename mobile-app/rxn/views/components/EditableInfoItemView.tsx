import React, { Component } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { styles } from '../../shared';
import { getDataField } from '../../models';
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

    const formattedValue = fieldInfo?.formatter ? fieldInfo.formatter(this.props.value) : this.props.value ?? 'N/A';

    return (
      <View style={styles.infoItemVehicle} key={this.props.fieldName}>
        <Text style={styles.infoTitleVehicle}>{fieldInfo.title}</Text>

        {fieldInfo.type === 'date' && (
          <View style={styles.infoValueVehicleEditable}>
            <Pressable
              onPress={() => {
                this.setState({ dateModalOpen: true });
              }}>
              <Text style={styles.infoValueVehicleEditable}>{formattedValue}</Text>
            </Pressable>
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
          </View>
        )}

        {fieldInfo.type !== 'date' && (
          <TextInput
            style={styles.infoValueVehicleEditable}
            editable={true}
            onFocus={() => {
              if (fieldInfo.type === 'date') {
                this.setState({ dateModalOpen: true });
              }
            }}
            keyboardType={fieldInfo.type === 'number' ? 'numeric' : 'default'}
            defaultValue={formattedValue.toString()}
            onEndEditing={event => {
              this.props.setServiceData(this.props.fieldName, event.nativeEvent.text);
            }}
          />
        )}
      </View>
    );
  }
}
