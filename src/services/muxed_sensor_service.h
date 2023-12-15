#ifndef __muxed_sensor_service__
#define __muxed_sensor_service__

#include "../base_service.h"
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

class MuxedSensorService : public BaseService
{
public:
  MuxedSensorService(SerialCom *com) : BaseService(SERVICE_CODE_MUX, SERVICE_TYPE_ON_DEMAND, com)
  {
  }

  void setup()
  {
    pinMode(PIN_MUX_OUT_A, OUTPUT);
    pinMode(PIN_MUX_OUT_B, OUTPUT);
    pinMode(PIN_MUX_OUT_C, OUTPUT);
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
      sendData(i, _sensorValues[i]);
    }

    _lastUpdateTime = millis();
  }

  void start()
  {
    if (isRunning)
    {
      this->log(F("start"), F("already running"));
      return;
    }
    this->log(F("starting"));
    _thermoSensor = &MAX6675(PIN_THERMO_SENSOR_CLK, PIN_THERMO_SENSOR_CS, PIN_THERMO_SENSOR_DATA);
    this->log(F("started"));
    isRunning = true;
  }

  void stop()
  {
    if (!isRunning)
    {
      this->log(F("stop"), F("already stopped"));
      return;
    }
    this->log(F("stopping"));
    delete _thermoSensor;
    this->log(F("stopped"));
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