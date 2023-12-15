#include "./src/serial_com.h"
#include "./src/service_runtime.h"
#include "./src/services/turn_signal_service.h"
#include "./src/services/system_sensor_service.h"
#include "./src/services/device_stats_service.h"
#include "./src/services/direct_sensor_service.h"
#include "./src/services/muxed_sensor_service.h"

SerialCom _com;
ServiceRuntime _serviceRuntime(&_com);

TurnSignalService _turnSignalService(&_com);
SystemSensorService _systemSensorService(&_com);
DeviceStatsService _deviceStatsService(&_com);
DirectSensorService _directSensorService(&_com);
MuxedSensorService _muxedSensorService(&_com);

void setup()
{
  _com.setup();
  _com.writeConsole(F("initializing..."));

  _serviceRuntime.add(&_turnSignalService);
  _serviceRuntime.add(&_systemSensorService);
  _serviceRuntime.add(&_deviceStatsService);
  _serviceRuntime.add(&_directSensorService);
  _serviceRuntime.add(&_muxedSensorService);

  _serviceRuntime.setup();

  _com.writeConsole(F("ready."));
  _turnSignalService.diagnosis(4, 100);
}

void loop()
{
  _serviceRuntime.update();
}