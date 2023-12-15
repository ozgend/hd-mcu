#ifndef __direct_sensor_service__
#define __direct_sensor_service__

#include "../base_service.h"
#include <OneWire.h>
#include <DallasTemperature.h>

#define DIRECT_CHANNEL_SIZE 4
#define DIRECT_UPDATE_INTERVAL 1000

#define DIRECT_CHANNEL_VOLTAGE 0
#define DIRECT_CHANNEL_TEMPERATURE 1
#define DIRECT_CHANNEL_RPM 2
#define DIRECT_CHANNEL_SPEED 3

#define VOLTAGE_R1 32500.0           // ohm
#define VOLTAGE_R2 7500.0            // ohm
#define SENSOR_ADC_LOSS 0.06         // percent
#define SENSOR_ADC_REFERENCE 3.3     // volts
#define SENSOR_ADC_RESOLUTION 1024.0 // resolution map

class DirectSensorService : public BaseService
{
public:
  DirectSensorService(SerialCom *com) : BaseService(SERVICE_CODE_DCT, SERVICE_TYPE_ON_DEMAND, com)
  {
  }

  void setup()
  {
    this->log(F("setup"));
    pinMode(PIN_SENSOR_VOLTAGE, INPUT);
    pinMode(PIN_SENSOR_TEMP, INPUT);
    pinMode(PIN_SENSOR_RPM, INPUT);
    pinMode(PIN_SENSOR_SPEED, INPUT);
    this->log(F("setup"), F("done"));
  }

  void update()
  {
    if (!isRunning)
    {
      return;
    }

    if (millis() - _lastUpdateTime < DIRECT_UPDATE_INTERVAL)
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

    if (!P_HAS_DIRECT_SENSOR)
    {
      this->log(F("start"), F("cannot start: no DCT peripheral"));
      return;
    }

    this->log(F("starting"));
    _oneWire = new OneWire(PIN_SENSOR_TEMP);
    _airTempSensor = new DallasTemperature(_oneWire);
    _airTempSensor->begin();
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
    delete _airTempSensor;
    delete _oneWire;
    this->log(F("stopped"));
    isRunning = false;
  }

  void processCommand(const String &command)
  {
    if (isCommandMatch(command, SERVICE_COMMAND_START_DCT))
    {
      start();
    }
    else if (isCommandMatch(command, SERVICE_COMMAND_STOP_DCT))
    {
      stop();
    }
  }

private:
  OneWire *_oneWire;
  DallasTemperature *_airTempSensor;
  long _lastUpdateTime;
  float _sensorValues[DIRECT_CHANNEL_SIZE] = {-1, -1, -1, -1};

  void readVoltage()
  {
    int _adcValue = analogRead(PIN_SENSOR_VOLTAGE); // 800-806
    int _adcVolts = (_adcValue * SENSOR_ADC_REFERENCE) / SENSOR_ADC_RESOLUTION;
    _adcVolts = _adcVolts - (_adcVolts * SENSOR_ADC_LOSS);
    _sensorValues[DIRECT_CHANNEL_VOLTAGE] = _adcVolts / (VOLTAGE_R2 / (VOLTAGE_R1 + VOLTAGE_R2));
  }

  void readTemperature()
  {
    _airTempSensor->requestTemperatures();
    _sensorValues[DIRECT_CHANNEL_TEMPERATURE] = _airTempSensor->getTempCByIndex(0);
  }

  void readRpm()
  {
    _sensorValues[DIRECT_CHANNEL_RPM] = -1;
  }

  void readSpeed()
  {
    _sensorValues[DIRECT_CHANNEL_SPEED] = -1;
  }

  void readAll()
  {
    readVoltage();
    readTemperature();
    readRpm();
    readSpeed();
  }

  void sendAll()
  {
    if (SERIAL_WRITE_AT_ONCE)
    {
      sendAllData(_sensorValues, DIRECT_CHANNEL_SIZE);
    }
    else
    {
      for (int i = 0; i < DIRECT_CHANNEL_SIZE; i++)
      {
        sendOneData(i, _sensorValues[i]);
      }
    }
  }
};

#endif