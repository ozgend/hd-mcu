#ifndef __service_runtime__
#define __service_runtime__

#include "./serial_com.h"
#include "./base_service.h"

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
    updateServices();

    String payload = this->_com->getPayload();

    if (payload.length() == 0)
    {
      return;
    }

    dispatchCommandToServices(payload);
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

  void dispatchCommandToServices(String &command)
  {
    for (int i = 0; i < this->_serviceCount; i++)
    {
      this->_services[i]->processCommand(command);
    }
  }

  void updateServices()
  {
    for (int i = 0; i < this->_serviceCount; i++)
    {
      this->_services[i]->update();
    }
  }

  // void toggleDynamicServices(boolean willStart)
  // {
  //   for (int i = 0; i < this->_serviceCount; i++)
  //   {
  //     if (this->_services[i]->serviceType == SERVICE_TYPE_ON_DEMAND)
  //     {
  //       if (willStart)
  //       {
  //         this->_services[i]->start();
  //       }
  //       else
  //       {
  //         this->_services[i]->stop();
  //       }
  //     }
  //   }
  // }

  // boolean isMatchingCommand(String &payload, String &expectedCommand)
  // {
  //   return payload.indexOf(expectedCommand) > -1;
  // }
};

#endif