#ifndef __system_sensor_service__
#define __system_sensor_service__

#include "../base_service.h"
#include <OneWire.h>
#include <DallasTemperature.h>

#define SYSTEM_CHANNEL_SIZE 1
#define SYSTEM_UPDATE_INTERVAL 1000

#define SYSTEM_CHANNEL_UPTIME 0

const char *const SYSTEM_CHANNEL_NAMES[SYSTEM_CHANNEL_SIZE] PROGMEM = {
    "UPTIME"};

class SystemSensorService : public BaseService
{
public:
  SystemSensorService(SerialCom *com) : BaseService(SERVICE_CODE_SYS, SERVICE_TYPE_ON_DEMAND, com)
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

  void processCommand(const String &command)
  {
    if (isCommandMatch(command, SERVICE_COMMAND_START_SYS))
    {
      start();
    }
    else if (isCommandMatch(command, SERVICE_COMMAND_STOP_SYS))
    {
      stop();
    }
  }

private:
  long _lastUpdateTime;
  float _sensorValues[SYSTEM_CHANNEL_SIZE] = {-1};

  void readAll()
  {
    _sensorValues[SYSTEM_CHANNEL_UPTIME] = millis();
  }

  void sendAll()
  {
    if (SERIAL_WRITE_AT_ONCE)
    {
      sendAllData(SYSTEM_CHANNEL_NAMES, _sensorValues, SYSTEM_CHANNEL_SIZE);
    }
    else
    {
      for (int i = 0; i < SYSTEM_CHANNEL_SIZE; i++)
      {
        sendOneData(SYSTEM_CHANNEL_NAMES[i], _sensorValues[i]);
      }
    }
  }
};

#endif