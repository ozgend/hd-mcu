#ifndef __direct_sensor_handler__
#define __direct_sensor_handler__

#include "../base_handler.h"
#include <OneWire.h>
#include <DallasTemperature.h>

#define DIRECT_CHANNEL_SIZE 6
#define DIRECT_UPDATE_INTERVAL 1000

#define DIRECT_CHANNEL_UPTIME 0
#define DIRECT_CHANNEL_VOLTAGE 1
#define DIRECT_CHANNEL_TEMPERATURE 2
#define DIRECT_CHANNEL_RPM 3
#define DIRECT_CHANNEL_SPEED 4
#define DIRECT_CHANNEL_OIL_PRESSURE 5

#define VOLTAGE_R1 32500.0       // ohm
#define VOLTAGE_R2 7500.0        // ohm
#define SENSOR_ADC_LOSS 0.06     // percent
#define SENSOR_ADC_REFERENCE 3.3 // volts
#define SENSOR_ADC_RESOLUTION 1024.0

class DirectSensorHandler : public BaseHandler
{
public:
  DirectSensorHandler(SerialCom *com) : BaseHandler(F("DirectSensorHandler"), SERVICE_TYPE_DYNAMIC, com)
  {
  }

  void initialize()
  {
    this->_com->writeConsole(F("init.DirectSensorHandler +"));
    pinMode(PIN_SENSOR_VOLTAGE, INPUT);
    pinMode(PIN_SENSOR_TEMP, INPUT);
    pinMode(PIN_SENSOR_RPM, INPUT);
    pinMode(PIN_SENSOR_SPEED, INPUT);
    pinMode(PIN_SENSOR_OIL_PRESSURE, INPUT);
    this->_com->writeConsole(F("init.DirectSensorHandler - done"));
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
      return;
    }
    this->_com->writeConsole(F("start.DirectSensorHandler +"));
    _oneWire = &OneWire(PIN_SENSOR_TEMP);
    _airTempSensor = &DallasTemperature(_oneWire);
    _airTempSensor->begin();
    this->_com->writeConsole(F("start.DDirectSensorHandler - started"));
    isRunning = true;
  }

  void stop()
  {
    if (!isRunning)
    {
      return;
    }
    this->_com->writeConsole(F("stop.DirectSensorHandler - stopping"));
    delete _airTempSensor;
    delete _oneWire;
    this->_com->writeConsole(F("stop.DirectSensorHandler - stopped"));
    isRunning = false;
  }

private:
  OneWire *_oneWire;
  DallasTemperature *_airTempSensor;
  int _adcValue;
  float _adcVolts;

  long _lastUpdateTime;
  float _sensorValues[DIRECT_CHANNEL_SIZE] = {-1, -1, -1, -1, -1, -1};

  void readVoltage()
  {
    _adcValue = analogRead(PIN_SENSOR_VOLTAGE); // 800-806
    _adcVolts = (_adcValue * SENSOR_ADC_REFERENCE) / SENSOR_ADC_RESOLUTION;
    _adcVolts = _adcVolts - (_adcVolts * SENSOR_ADC_LOSS);
    _sensorValues[DIRECT_CHANNEL_VOLTAGE] = _adcVolts / (VOLTAGE_R2 / (VOLTAGE_R1 + VOLTAGE_R2));
  }

  void readAirTemperature()
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

  void readOilPressure()
  {
    _sensorValues[DIRECT_CHANNEL_OIL_PRESSURE] = -1;
  }

  void readAll()
  {
    _sensorValues[DIRECT_CHANNEL_UPTIME] = millis();
    readVoltage();
    readAirTemperature();
    readRpm();
    readSpeed();
  }

  void sendAll()
  {
    for (int i = 0; i < DIRECT_CHANNEL_SIZE; i++)
    {
      sendData(String(F("dts_")) + String(i), String(_sensorValues[i]));
    }
  }
};

#endif