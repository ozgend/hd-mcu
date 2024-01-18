const IVehicleSensorData = {
  temp: 0.0,
  batt: 0.0,
  rpm: 0.0,
  speed: 0.0,
  uptime: 0,
};

const IMuxedSensorData = {
  ch_0: 0.0,
  ch_1: 0.0,
  ch_2: 0.0,
  ch_3: 0.0,
  ch_4: 0.0,
  ch_5: 0.0,
  ch_6: 0.0,
  ch_7: 0.0,
};

const ISystemStatsData = {
  arch: '',
  platform: '',
  version: '',
  name: '',
  uid: '',
  heapTotal: 0,
  heapUsed: 0,
  heapPeak: 0,
};

const ITsmData = {
  state: { left: false, right: false },
  action: { left: false, right: false },
};

module.exports = { IVehicleSensorData, IMuxedSensorData, ISystemStatsData, ITsmData };