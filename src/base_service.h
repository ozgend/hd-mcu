#ifndef __base_service__
#define __base_service__

#include "./serial_com.h"
#include "./config_hw.h"

#define SERVICE_TYPE_SYSTEM 1
#define SERVICE_TYPE_DYNAMIC 2
#define SERVICE_SYS F("SYS")
#define SERVICE_DCT F("DCT")
#define SERVICE_MUX F("MUX")
#define SERVICE_TSM F("TSM")
#define SEPARATOR_SVC F("_")
#define SEPARATOR_KV F("|")
#define SEPARATOR_EVENT F(":")

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
    this->_com->writeAll(serviceCode + String(SEPARATOR_SVC) + String(sensorIndex) + String(SEPARATOR_KV) + String(value));
  }

  void log(const String &event, const String &message = "")
  {
    if (message.length() == 0)
    {
      this->_com->writeConsole(serviceCode + String(SEPARATOR_EVENT) + String(event));
    }
    else
    {
      this->_com->writeConsole(serviceCode + String(SEPARATOR_EVENT) + String(event) + String(SEPARATOR_EVENT) + String(SEPARATOR_EVENT) + String(message));
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