#ifndef __device_stats_service__
#define __device_stats_service__

#include <Arduino.h>
#include <avr/pgmspace.h>
#include "../base_service.h"

#define DEVICE_STATS_CHANNEL_SIZE 5

#define DEVICE_STATS_CHANNEL_CPU 0
#define DEVICE_STATS_CHANNEL_RAM_FREE 1
#define DEVICE_STATS_CHANNEL_RAM_TOTAL 2
#define DEVICE_STATS_CHANNEL_FLASH_FREE 3
#define DEVICE_STATS_CHANNEL_FLASH_TOTAL 4

class DeviceStatsService : public BaseService
{
public:
  DeviceStatsService(SerialCom *com) : BaseService(SERVICE_CODE_DEV, SERVICE_TYPE_ONE_TIME, com)
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

    readAll();
    sendAll();
    stop();
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
    if (isCommandMatch(command, SERVICE_COMMAND_START_DEV))
    {
      start();
    }
    else if (isCommandMatch(command, SERVICE_COMMAND_STOP_DEV))
    {
      stop();
    }
  }

private:
  float _sensorValues[DEVICE_STATS_CHANNEL_SIZE] = {-1, -1, -1, -1};

  // int getFreeMemory()
  // {
  //   extern int __heap_start, *__brkval;
  //   int v;
  //   return (int)&v - (__brkval == 0 ? (int)&__heap_start : (int)__brkval);
  // }

  void readAll()
  {
    this->log(F("readAll"));
    // _sensorValues[DEVICE_STATS_CHANNEL_CPU] = F_CPU / 1000000;
    // _sensorValues[DEVICE_STATS_CHANNEL_RAM_FREE] = getFreeMemory();
    _sensorValues[DEVICE_STATS_CHANNEL_RAM_TOTAL] = 2048;
    _sensorValues[DEVICE_STATS_CHANNEL_FLASH_FREE] = -1;
    _sensorValues[DEVICE_STATS_CHANNEL_FLASH_TOTAL] = 30720;
  }

  void sendAll()
  {
    if (SERIAL_WRITE_AT_ONCE)
    {
      sendAllData(_sensorValues, DEVICE_STATS_CHANNEL_SIZE);
    }
    else
    {
      for (int i = 0; i < DEVICE_STATS_CHANNEL_SIZE; i++)
      {
        sendOneData(i, _sensorValues[i]);
      }
    }
  }
};

#endif