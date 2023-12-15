#ifndef __service_runtime__
#define __service_runtime__

#include "./serial_com.h"
#include "./base_service.h"

#define COMMAND_START_SENSORS F("sensors=1")
#define COMMAND_STOP_SENSORS F("sensors=0")

#define COMMAND_START_TSM_ALL F("tsm=1")
#define COMMAND_STOP_TSM F("tsm=0")
#define COMMAND_START_TSM_LEFT F("tsm=L")
#define COMMAND_START_TSM_RIGHT F("tsm=R")

class ServiceRuntime
{
public:
  ServiceRuntime(SerialCom *com)
  {
    this->_com = com;
    this->_serviceCount = 0;
  }

  void setup()
  {
    for (int i = 0; i < this->_serviceCount; i++)
    {
      this->_services[i]->setup();
    }
  }

  void update()
  {
    if (this->_com->hasCommand(COMMAND_START_SENSORS))
    {
      this->_com->writeConsole(F("ServiceRuntime: start sensors"));
      toggleDynamicServices(true);
    }

    if (this->_com->hasCommand(COMMAND_STOP_SENSORS))
    {
      this->_com->writeConsole(F("ServiceRuntime: stop sensors"));
      toggleDynamicServices(false);
    }

    if (!this->_com->hasConnection())
    {
      this->_com->writeConsole(F("ServiceRuntime: stop sensors, no connection"));
      toggleDynamicServices(false);
    }

    updateServices();
  }

  void add(BaseService *service)
  {
    this->_services[this->_serviceCount] = service;
    this->_serviceCount++;
  }

private:
  SerialCom *_com;
  BaseService *_services[10];
  int8_t _serviceCount;

  void toggleDynamicServices(boolean willStart)
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

  void updateServices()
  {
    for (int i = 0; i < this->_serviceCount; i++)
    {
      this->_services[i]->update();
    }
  }
};

#endif