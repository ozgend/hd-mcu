export const MaxItemSize = 9999;

export const Seperator = {
  SerialCommand: '+',
  ServiceData: '=',
};

export const ServiceType = {
  ALWAYS_RUN: 'ALWAYS_RUN',
  ON_DEMAND: 'ON_DEMAND',
  ONE_TIME: 'ONE_TIME',
};

export const ServiceStatus = {
  Available: 'AVAILABLE',
  Ready: 'READY',
  Started: 'STARTED',
  Stopped: 'STOPPED',
  Error: 'ERROR',
};

export const Broadcasting = {
  ContinuousStream: 'CONTINUOUS_STREAM',
  OnDemandPolling: 'ON_DEMAND_POLLING',
};

export const ServiceCode = {
  SystemStats: 'SYS',
  VehicleSensor: 'VHC',
  VehicleInfo: 'VHI',
  Thermometer: 'THE',
  TurnSignalModule: 'TSM',
  Module: 'MODULE',
  EventBus: 'BUS',
  Main: 'MAIN',
  Heartbeat: 'BEAT',
};

export const ServiceCommand = {
  START: 'START',
  STOP: 'STOP',
  INFO: 'INFO',
  DATA: 'DATA',
  SET: 'SET',
};

export const TurnSignalCommands = {
  DIAG: 'DIAG',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  ALL: 'ALL',
  NONE: 'NONE',
};

export const EventType = {
  CommandForModule: 'MODULE_COMMAND',
  CommandForService: 'SERVICE_COMMAND',
  DataFromService: 'SERVICE_DATA',
  DataFromSerial: 'SERIAL_DATA',
};
