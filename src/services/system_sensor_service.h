#ifndef __system_sensor_service__
#define __system_sensor_service__

#include <Arduino.h>
#include <avr/pgmspace.h>
#include "../base_service.h"

#define SYSTEM_CHANNEL_SIZE 4
#define SYSTEM_UPDATE_INTERVAL 5000

#define SYSTEM_CHANNEL_UPTIME 0
#define SYSTEM_CHANNEL_FLASH 1
#define SYSTEM_CHANNEL_CPU 2
#define SYSTEM_CHANNEL_RAM_FREE 3
#define SYSTEM_CHANNEL_RAM_TOTAL 4

class SystemSensorService : public BaseService
{
public:
  SystemSensorService(SerialCom *com) : BaseService(SERVICE_SYS, SERVICE_TYPE_DYNAMIC, com)
  {
  }

  void setup()
  {
    this->log(F("setup"));
    this->log(F("setup"), F("done"));
  }

  void update()
  {
    if (!isRunning)
    {
      return;
    }

    if (millis() - _lastUpdateTime < SYSTEM_UPDATE_INTERVAL)
    {
      return;
    }

    readAll();
    sendAll();

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
    this->log(F("stopped"));
    isRunning = false;
  }

private:
  long _lastUpdateTime;
  float _sensorValues[SYSTEM_CHANNEL_SIZE] = {-1, -1, -1, -1};

  int getFreeMemory()
  {
    extern int __heap_start, *__brkval;
    int v;
    return (int)&v - (__brkval == 0 ? (int)&__heap_start : (int)__brkval);
  }

  void readAll()
  {
    _sensorValues[SYSTEM_CHANNEL_UPTIME] = _lastUpdateTime;
    _sensorValues[SYSTEM_CHANNEL_CPU] = F_CPU / 1000000;
    _sensorValues[SYSTEM_CHANNEL_RAM_FREE] = getFreeMemory();
    _sensorValues[SYSTEM_CHANNEL_RAM_TOTAL] = RAMEND - RAMSTART + 1;
    _sensorValues[SYSTEM_CHANNEL_FLASH] = -1;
  }

  void sendAll()
  {
    for (int i = 0; i < SYSTEM_CHANNEL_SIZE; i++)
    {
      sendData(i, _sensorValues[i]);
    }
  }
};

#endif