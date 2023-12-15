#ifndef __base_handler__
#define __base_handler__

#include "./serial_com.h"
#include "./config_hw.h"

#define SERVICE_TYPE_SYSTEM 1
#define SERVICE_TYPE_DYNAMIC 2
#define SERVICE_DCT F("DCT")
#define SERVICE_MUX F("MUX")
#define SERVICE_TSM F("TSM")
#define SEPARATOR_SVC F("_")
#define SEPARATOR_KV F("|")

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

  void sendData(const String key, const String value)
  {
    this->_com->writeAll(serviceCode + String(SEPARATOR_SVC) + key + String(SEPARATOR_KV) + value);
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