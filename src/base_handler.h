#ifndef __base_handler__
#define __base_handler__

#include "./serial_com.h"
#include "./config_hw.h"

#define SERVICE_TYPE_SYSTEM 1
#define SERVICE_TYPE_DYNAMIC 2

class BaseHandler
{
public:
  BaseHandler(const String name, const int8_t serviceType, SerialCom *com)
  {
    this->name = name;
    this->serviceType = serviceType;
    this->isRunning = false;
    this->_com = com;
  }

  sendData(const String key, const String value)
  {
    this->_com->writeAll(key + String(F("|")) + value);
  }

  virtual void initialize(){};
  virtual void update(){};
  virtual void start() {}
  virtual void stop() {}

  String name;
  boolean isRunning;
  int8_t serviceType;

protected:
  SerialCom *_com;
};

#endif