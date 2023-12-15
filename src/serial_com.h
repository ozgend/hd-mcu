#ifndef __serial_com__
#define __serial_com__

#include "./config_hw.h"
#include <SoftwareSerial.h>

#define SERIAL_BAUD_COM 9600
#define SERIAL_BAUD_BT 9600

class SerialCom
{
public:
  SerialCom()
  {
  }

  void initialize()
  {
    Serial.begin(SERIAL_BAUD_COM);
    writeConsole(F("SerialCom::init start"));

    // opt if phsical serial connected
    if (!hasConsole())
    {
      _btSerial = &SoftwareSerial(PIN_BLUETOOTH_SERIAL_RX, PIN_BLUETOOTH_SERIAL_TX);
      _btSerial->begin(SERIAL_BAUD_BT);
    }
    writeConsole(F("SerialCom::init done"));
  }

  void writeAll(String data)
  {
    writeConsole(data);
    writeBT(data);
  }

  void writeBT(String data)
  {
    if (_btSerial->available() > 0)
    {
      _btSerial->println(data);
    }
  }

  void writeConsole(String data)
  {
    if (Serial.available() > 0)
    {
      Serial.println(data);
    }
  }

  String readBT()
  {
    if (hasBT())
    {
      String data = _btSerial->readString();
      return data;
    }
    return "";
  }

  String readConsole()
  {
    if (hasConsole())
    {
      String data = Serial.readString();
      return data;
    }
    return "";
  }

  boolean hasCommand(String command)
  {
    String data = readBT();
    if (data == command)
    {
      return true;
    }

    data = readConsole();
    if (data == command)
    {
      return true;
    }

    return false;
  }

  boolean hasBT()
  {
    return _btSerial->available() > 0;
  }

  boolean hasConsole()
  {
    return Serial.available() > 0;
  }

  boolean hasConnection()
  {
    return hasBT() || hasConsole();
  }

private:
  SoftwareSerial *_btSerial;
};

#endif