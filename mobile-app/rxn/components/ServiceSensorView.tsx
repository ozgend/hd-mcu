import React, {Component} from 'react';
import {ScrollView, Text, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {IDataProvider} from '../services/interfaces';
import {SensorItemView} from './SensorItemView';
import {IDeviceSensorData} from '../models';
import styles from '../styles';

export interface ISensorViewProps<IProvider> {
  provider: IProvider;
  serviceName: string;
  title: string;
  iconName: string;
}

export interface ISensorViewStateData<TSensorData> {
  data: TSensorData;
  isRunning?: boolean;
}

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

  async setServiceState(toState: boolean) {
    // if (this.state.isRunning === toState) {
    //   console.debug(`${this.props.serviceName} skip state, already ${toState}`);
    //   return;
    // }
    console.debug(`${this.props.serviceName} -> ${toState}`);
    this.setState({isRunning: toState});
    await this.props.provider.sendCommand(
      this.props.serviceName,
      toState ? 'START' : 'STOP',
    );
  }

  async componentDidMount(): Promise<void> {
    console.debug(`${this.props.serviceName} mounted`);
    this.props.provider.onUpdate(this.props.serviceName, (data: any) => {
      this.setState({data});
    });

    // await this.setServiceState(true);
  }

  async componentWillUnmount(): Promise<void> {
    console.debug(`${this.props.serviceName} unmounting`);
    await this.setServiceState(false);
  }

  render() {
    return (
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.container}>
        <View style={styles.actionBarView}>
          <Text style={styles.actionBarHeader}>{this.props.title}</Text>
          <MaterialCommunityIcons
            style={styles.actionBarStatusIcon}
            size={styles.actionBarStatusIcon.fontSize}
            color={this.state.isRunning ? '#4f4' : '#f44'}
            name={'circle'}
            // name={this.state.isRunning ? 'bluetooth-transfer' : 'bluetooth-off'}
          />
          <MaterialCommunityIcons.Button
            size={styles.actionBarButton.fontSize}
            name={this.state.isRunning ? 'stop-circle' : 'play-circle'}
            style={styles.actionBarButton}
            color={styles.actionBarButton.color}
            onPress={() => this.toggleService()}>
            {this.state.isRunning ? 'STOP' : 'START'}
          </MaterialCommunityIcons.Button>
        </View>
        <Text> </Text>
        {!this.state.isRunning && (
          <View style={styles.centerContainer}>
            <Text style={styles.text}>
              <Text style={styles.heading}>Service is ready</Text>,{' '}
              but not running. You can start the service to poll data.
            </Text>
          </View>
        )}
        {this.state?.data &&
          Object.keys(this.state?.data ?? {}).map(fieldName => {
            return (
              <SensorItemView
                key={fieldName}
                fieldName={fieldName}
                value={
                  this.state.data[fieldName as keyof typeof this.state.data]
                }
              />
            );
          })}
      </ScrollView>
    );
  }
}
