#ifndef __service_runtime__
#define __service_runtime__

#include "./serial_com.h"
#include "./base_handler.h"

#define COMMAND_START_SENSORS "sensors=1"
#define COMMAND_STOP_SENSORS "sensors=0"

// #define COMMAND_START_DIRECT "dct=1"
// #define COMMAND_STOP_DIRECT "dct=0"

// #define COMMAND_START_MUXED "mux=1"
// #define COMMAND_STOP_MUXED "mux=0"

#define COMMAND_START_TSM_ALL "tsm=1"
#define COMMAND_STOP_TSM "tsm=0"
#define COMMAND_START_TSM_LEFT "tsm=L"
#define COMMAND_START_TSM_RIGHT "tsm=R"

class ServiceRuntime
{
public:
  ServiceRuntime(SerialCom *com)
  {
    this->_com = com;
    this->_serviceCount = 0;
  }

  void initialize()
  {
    for (int i = 0; i < this->_serviceCount; i++)
    {
      this->_services[i]->initialize();
    }
  }

  void update()
  {
    if (this->_com->hasCommand(COMMAND_START_SENSORS))
    {
      this->_com->writeConsole("ServiceRuntime: start sensors");
      toggleDynamicHandlers(true);
    }

    if (this->_com->hasCommand(COMMAND_STOP_SENSORS))
    {
      this->_com->writeConsole("ServiceRuntime: stop sensors");
      toggleDynamicHandlers(false);
    }

    if (!this->_com->hasConnection())
    {
      this->_com->writeConsole("ServiceRuntime: stop sensors, no connection");
      toggleDynamicHandlers(false);
    }

    updateHandlers();
  }

  void registerService(BaseHandler *handler)
  {
    this->_services[this->_serviceCount] = handler;
    this->_serviceCount++;
  }

private:
  SerialCom *_com;
  BaseHandler *_services[10];
  int8_t _serviceCount;

  void toggleDynamicHandlers(boolean willStart)
  {
    for (int i = 0; i < this->_serviceCount; i++)
    {
      if (this->_services[i]->serviceType == SERVICE_TYPE_DYNAMIC)
      {
        if (willStart)
        {
          this->_services[i]->start();
        }
        else
        {
          this->_services[i]->stop();
        }
      }
    }
  }

  void updateHandlers()
  {
    for (int i = 0; i < this->_serviceCount; i++)
    {
      this->_services[i]->update();
    }
  }
};

#endif