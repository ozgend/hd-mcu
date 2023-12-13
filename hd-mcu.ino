#include "./src/serial_com.h"
#include "./src/service_runtime.h"
#include "./src/handlers/turn_signal_handler.h"
#include "./src/handlers/direct_sensor_handler.h"
#include "./src/handlers/muxed_sensor_handler.h"

SerialCom _com;
ServiceRuntime _runtime(&_com);
TurnSignalHandler _turnSignalHandler(&_com);
DirectSensorHandler _directSensorHandler(&_com);
MuxedSensorHandler _muxedSensorHandler(&_com);

void setup()
{
  _com.initialize();
  _com.writeConsole("initializing...");

  _runtime.registerService(&_turnSignalHandler);
  _runtime.registerService(&_directSensorHandler);
  _runtime.registerService(&_muxedSensorHandler);

  _runtime.initialize();

  _com.writeConsole("started.");
  _turnSignalHandler.diagnosis(4, 100);
}

void loop()
{
  _runtime.update();
}