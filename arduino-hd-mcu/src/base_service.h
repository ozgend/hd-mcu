#ifndef __base_service__
#define __base_service__

#include "./serial_com.h"
#include "./config_hw.h"

#define SERVICE_COMMAND_START_DCT F("DCT=1")
#define SERVICE_COMMAND_STOP_DCT F("DCT=0")
#define SERVICE_COMMAND_START_MUX F("MUX=1")
#define SERVICE_COMMAND_STOP_MUX F("MUX=0")
#define SERVICE_COMMAND_START_SYS F("SYS=1")
#define SERVICE_COMMAND_STOP_SYS F("SYS=0")
#define SERVICE_COMMAND_START_DEV F("DEV=1")
#define SERVICE_COMMAND_STOP_DEV F("DEV=0")
#define SERVICE_COMMAND_BEGIN_TSM_ALL F("TSM=1")
#define SERVICE_COMMAND_END_TSM F("TSM=0")
#define SERVICE_COMMAND_BEGIN_TSM_DIAG F("TSM=D")
#define SERVICE_COMMAND_BEGIN_TSM_LEFT F("TSM=L")
#define SERVICE_COMMAND_BEGIN_TSM_RIGHT F("TSM=R")

#define SERVICE_TYPE_ALWAYS_RUN 1
#define SERVICE_TYPE_ON_DEMAND 2
#define SERVICE_TYPE_ONE_TIME 3

#define SERVICE_CODE_DCT F("DCT")
#define SERVICE_CODE_MUX F("MUX")
#define SERVICE_CODE_SYS F("SYS")
#define SERVICE_CODE_DEV F("DEV")
#define SERVICE_CODE_TSM F("TSM")

#define LOG_SEPARATOR_SVC F("_")
#define LOG_SEPARATOR_KV F("|")
#define LOG_SEPARATOR_EVENT F(":")
#define LOG_SEPARATOR_KV_PAIR F(":")
#define LOG_SEPARATOR_JSON_FIELD F(",")
#define LOG_SEPARATOR_JSON_KV_PAIR F("\":\"")
#define LOG_SEPARATOR_JSON_QUOTE F("\"")
#define LOG_SEPARATOR_JSON_OBJECT_START F("{")
#define LOG_SEPARATOR_JSON_OBJECT_END F("}")

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

  void sendOneData(const uint8_t key, const float value)
  {
    sendOneData(key, String(value));
  }

  void sendOneData(const uint8_t key, const String &value)
  {
    this->_com->writeAll(serviceCode + String(LOG_SEPARATOR_SVC) + String(key) + String(LOG_SEPARATOR_KV_PAIR) + value);
  }

  void sendAllData(const float values[], const uint8_t length)
  {
    String data = String(LOG_SEPARATOR_JSON_OBJECT_START);
    for (uint8_t i = 0; i < length; i++)
    {
      data += String(LOG_SEPARATOR_JSON_QUOTE) + serviceCode + String(LOG_SEPARATOR_SVC) + String(i) + String(LOG_SEPARATOR_JSON_KV_PAIR) + String(values[i]) + String(LOG_SEPARATOR_JSON_QUOTE);
      if (i < length - 1)
      {
        data += String(LOG_SEPARATOR_JSON_FIELD);
      }
    }
    data += String(LOG_SEPARATOR_JSON_OBJECT_END);
    this->_com->writeAll(data);
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

  boolean isCommandMatch(const String &command, const String &commandToMatch)
  {
    return command.startsWith(commandToMatch);
  }

  virtual void setup(){};
  virtual void update(){};
  virtual void start() {}
  virtual void stop() {}
  virtual void processCommand(const String &command) {}

  String serviceCode;
  int8_t serviceType;
  boolean isRunning;

protected:
  SerialCom *_com;
};

#endif