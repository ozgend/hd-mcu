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
  MuxSensor: 'MUX',
  EventBus: 'BUS',
  Main: 'MAIN',
  Heartbeat: 'BEAT',
};

export const ServiceCommand = {
  START: 'START',
  STOP: 'STOP',
  DIAG: 'DIAG',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  ALL: 'ALL',
  BOTH: 'BOTH',
  NONE: 'NONE',
  QUERY: '?',
  DATA: 'DATA',
  STATUS: 'STATUS',
};

export const ServiceEvent = {
  DATA: 'DATA',
  ERR: 'ERR',
  STATUS: 'STATUS',
};
