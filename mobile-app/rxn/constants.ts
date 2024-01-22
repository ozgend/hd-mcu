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
  Module: 'MODULE',
  TurnSignalModule: 'TSM',
  SystemStats: 'SYS',
  VehicleSensor: 'VHC',
  Thermometer: 'THE',
  EventBus: 'BUS',
  Main: 'MAIN',
  Heartbeat: 'BEAT',
};

export const ServiceCommand = {
  START: 'START',
  STOP: 'STOP',
  DATA: 'DATA',
  INFO: '?',
};

export const TurnSignalCommands = {
  DIAG: 'DIAG',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  ALL: 'ALL',
  NONE: 'NONE',
};
