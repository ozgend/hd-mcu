import React, {Component} from 'react';
import {SensorItem} from './SensorItem';
import {
  ISensorViewProps,
  ISensorViewStateData,
  ITsmData,
  BtDataServiceTypes,
} from '../../models';
import {IDataProvider} from '../../services/interfaces';
import {ScrollView, Button, Text} from 'react-native';

const service = BtDataServiceTypes.TSM;

export class TSMView extends Component<
  ISensorViewProps<IDataProvider>,
  ISensorViewStateData<ITsmData>
> {
  constructor(props: any) {
    super(props);
    this.state = {
      isRunning: false,
      data: {},
    };
  }

  toggleService(toState?: boolean) {
    this.setState({isRunning: toState});
    this.props.provider.sendCommand(service, toState ? 'START' : 'STOP');
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
