import React, {Component} from 'react';
import {Button, ScrollView, Text} from 'react-native';
import {IDataProvider} from '../services/interfaces';
import {SensorItemView} from './SensorItemView';
import {
  ISensorViewProps,
  ISensorViewStateData,
  IDeviceSensorData,
} from '../models';

export class ServiceSensorView extends Component<
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

  toggleService() {
    const toState = !this.state.isRunning;
    this.setServiceState(toState);
  }

  setServiceState(toState: boolean) {
    if (this.state.isRunning === toState) {
      console.debug(`${this.props.serviceName} skip state, already ${toState}`);
      return;
    }
    console.debug(`${this.props.serviceName} -> ${toState}`);
    this.setState({isRunning: toState});
    this.props.provider.sendCommand(
      this.props.serviceName,
      toState ? 'START' : 'STOP',
    );
  }

  componentDidMount(): void {
    console.debug(`${this.props.serviceName} mounted`);
    this.props.provider.onUpdate(this.props.serviceName, (data: any) => {
      this.setState({data});
    });

    this.setServiceState(true);
  }

  componentWillUnmount(): void {
    console.debug(`${this.props.serviceName} unmounting`);
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
            <SensorItemView
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
