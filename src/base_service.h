#ifndef __base_service__
#define __base_service__

#include "./serial_com.h"
#include "./config_hw.h"

#define SERVICE_TYPE_ALWAYS_RUN 1
#define SERVICE_TYPE_ON_DEMAND 2
#define SERVICE_TYPE_ONE_TIME 3

#define SERVICE_SYS F("SYS")
#define SERVICE_CODE_DCT F("DCT")
#define SERVICE_CODE_MUX F("MUX")
#define SERVICE_CODE_TSM F("TSM")

#define LOG_SEPARATOR_SVC F("_")
#define LOG_SEPARATOR_KV F("|")
#define LOG_SEPARATOR_EVENT F(":")

class BaseService
{
public:
  BaseService(const String serviceCode, const int8_t serviceType, SerialCom *com)
  {
    this->serviceCode = serviceCode;
    this->serviceType = serviceType;
    this->isRunning = false;
    this->_com = com;
  }

  void sendData(const uint8_t sensorIndex, const float value)
  {
    this->_com->writeAll(serviceCode + String(LOG_SEPARATOR_SVC) + String(sensorIndex) + String(LOG_SEPARATOR_KV) + String(value));
  }

  void log(const String &event, const String &message = "")
  {
    if (message.length() == 0)
    {
      this->_com->writeConsole(serviceCode + String(LOG_SEPARATOR_EVENT) + String(event));
    }
    else
    {
      this->_com->writeConsole(serviceCode + String(LOG_SEPARATOR_EVENT) + String(event) + String(LOG_SEPARATOR_EVENT) + String(LOG_SEPARATOR_EVENT) + String(message));
    }
  }

  virtual void setup(){};
  virtual void update(){};
  virtual void start() {}
  virtual void stop() {}

  String serviceCode;
  int8_t serviceType;
  boolean isRunning;

protected:
  SerialCom *_com;
};

#endif