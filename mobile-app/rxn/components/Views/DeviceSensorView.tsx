import React, {Component} from 'react';
import {
  IDeviceSensorData,
  ISensorViewProps,
  ISensorViewStateData,
  BtDataServiceTypes,
} from '../../models';
import {SensorItem} from './SensorItem';
import {IDataProvider} from '../../services/interfaces';
import {Button, ScrollView, Text} from 'react-native';

const service = BtDataServiceTypes.DEV;

export class DeviceSensorView extends Component<
  ISensorViewProps<IDataProvider>,
  ISensorViewStateData<IDeviceSensorData>
> {
  constructor(props: any) {
    super(props);
    this.state = {
      isRunning: false,
      data: {},
    };
  }

  toggleService(toState?: boolean) {
    this.props.provider.sendCommand(service, toState ? 'START' : 'STOP');
    this.setState({isRunning: toState});
  }

  setServiceState(isRunning: boolean) {
    this.setState({isRunning});
  }

  componentDidMount(): void {
    console.debug(`${service} mounted`);
    this.props.provider.onUpdate(service, (data: any) => {
      this.setState({data});
    });

    this.setServiceState(true);
  }

  componentWillUnmount(): void {
    console.debug(`${service} unmounting`);
    this.setServiceState(false);
  }

  render() {
    return (
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Button
          title={this.state.isRunning ? 'STOP' : 'START'}
          onPress={() => this.toggleService()}
        />
        <Text> </Text>
        {Object.keys(this.state?.data ?? {}).map(fieldName => {
          return (
            <SensorItem
              key={fieldName}
              fieldName={fieldName}
              value={this.state.data[fieldName as keyof typeof this.state.data]}
            />
          );
        })}
      </ScrollView>
    );
  }
}
