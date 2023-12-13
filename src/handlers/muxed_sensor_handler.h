#ifndef __muxed_sensor_handler__
#define __muxed_sensor_handler__

#include "../base_handler.h"
#include <max6675.h>

#define MUX_UPDATE_INTERVAL 2000
#define MUX_CHANNEL_SIZE 8
#define MUX_CHANNEL_SIZE_ACTIVE 4

#define MUX_CHANNEL_0 0
#define MUX_CHANNEL_1 1
#define MUX_CHANNEL_2 2
#define MUX_CHANNEL_3 3
#define MUX_CHANNEL_4 4
#define MUX_CHANNEL_5 5
#define MUX_CHANNEL_6 6
#define MUX_CHANNEL_7 7
#define MUX_CONTROL_BIT_SIZE 3

const int MUX_CHANNEL_SELECT[MUX_CHANNEL_SIZE][MUX_CONTROL_BIT_SIZE] =
    {{LOW, LOW, LOW},
     {LOW, LOW, HIGH},
     {LOW, HIGH, LOW},
     {LOW, HIGH, HIGH},
     {HIGH, LOW, LOW},
     {HIGH, LOW, HIGH},
     {HIGH, HIGH, LOW},
     {HIGH, HIGH, HIGH}};

class MuxedSensorHandler : public BaseHandler
{
public:
  MuxedSensorHandler(SerialCom *com) : BaseHandler("MuxedSensorHandler", SERVICE_TYPE_DYNAMIC, com)
  {
  }

  void initialize()
  {
    pinMode(PIN_MUX_OUT_A, OUTPUT);
    pinMode(PIN_MUX_OUT_B, OUTPUT);
    pinMode(PIN_MUX_OUT_C, OUTPUT);
    pinMode(PIN_MUX_INHIBIT, OUTPUT);
  }

  void update()
  {
    if (!isRunning)
    {
      return;
    }

    if (millis() - _lastUpdateTime < MUX_UPDATE_INTERVAL)
    {
      return;
    }

    for (int i = 0; i < MUX_CHANNEL_SIZE_ACTIVE; i++)
    {
      readChannelValue(i);
      sendData("mux_" + String(i), String(_sensorValues[i]));
    }

    _lastUpdateTime = millis();
  }

  void start()
  {
    if (isRunning)
    {
      this->_com->writeConsole("start.MuxedSensorHandler - already running");
      return;
    }
    this->_com->writeConsole("start.MuxedSensorHandler +");
    _thermoSensor = &MAX6675(PIN_THERMO_SENSOR_CLK, PIN_THERMO_SENSOR_CS, PIN_THERMO_SENSOR_DATA);
    this->_com->writeConsole("start.MuxedSensorHandler - started");
    isRunning = true;
  }

  void stop()
  {
    if (!isRunning)
    {
      this->_com->writeConsole("stop.MuxedSensorHandler - not running");
      return;
    }
    this->_com->writeConsole("stop.MuxedSensorHandler - stopping");
    delete _thermoSensor;
    this->_com->writeConsole("stop.MuxedSensorHandler - stopped");
    isRunning = false;
  }

private:
  long _lastUpdateTime;
  float _sensorValues[MUX_CHANNEL_SIZE_ACTIVE] = {-999, -999, -999, -999};
  MAX6675 *_thermoSensor;

  void readChannelValue(int channel)
  {
    digitalWrite(PIN_MUX_OUT_C, MUX_CHANNEL_SELECT[channel][0]);
    digitalWrite(PIN_MUX_OUT_B, MUX_CHANNEL_SELECT[channel][1]);
    digitalWrite(PIN_MUX_OUT_A, MUX_CHANNEL_SELECT[channel][2]);

    _sensorValues[channel] = _thermoSensor->readCelsius();
  }
};

#endif