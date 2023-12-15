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

  void setup()
  {
    Serial.begin(SERIAL_BAUD_COM);
    writeConsole(F("SerialCom::init start"));

    // opt if phsical serial connected
    if (!hasConsole())
    {
      _btSerial = &SoftwareSerial(PIN_BLUETOOTH_RX, PIN_BLUETOOTH_TX);
      _btSerial->begin(SERIAL_BAUD_BT);
    }
    writeConsole(F("SerialCom::init done"));
  }

  void writeAll(String payload)
  {
    writeConsole(payload);
    writeBT(payload);
  }

  void writeBT(String payload)
  {
    if (_btSerial->available() > 0)
    {
      _btSerial->println(payload);
    }
  }

  void writeConsole(String payload)
  {
    if (Serial.available() > 0)
    {
      Serial.println(payload);
    }
  }

  String readBT()
  {
    if (hasBT())
    {
      String payload = _btSerial->readString();
      return payload;
    }
    return "";
  }

  String readConsole()
  {
    if (hasConsole())
    {
      String payload = Serial.readString();
      return payload;
    }
    return "";
  }

  // struct CommandPayload
  // {
  //   String command;
  //   String data;
  // };

  String getPayload()
  {
    String payload = readBT();
    if (payload.length() > 0)
    {
      return payload;
    }

    payload = readConsole();
    if (payload.length() > 0)
    {
      return payload;
    }

    return "";
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