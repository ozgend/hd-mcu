#ifndef __serial_com__
#define __serial_com__

#include "./config_hw.h"
#include <SoftwareSerial.h>

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

    if (P_HAS_BLUETOOTH)
    {
      _btSerial = &SoftwareSerial(PIN_BLUETOOTH_RX, PIN_BLUETOOTH_TX);
      _btSerial->begin(SERIAL_BAUD_BT);
    }
    else
    {
      writeConsole("SerialCom::readBT: no BT peripheral");
    }

    writeConsole(F("SerialCom::init done"));
  }

  void writeAll(const String payload)
  {
    writeConsole(payload);
    writeBT(payload);
  }

  void writeBT(const String payload)
  {
    if (!P_HAS_BLUETOOTH)
    {
      // writeConsole("SerialCom::readBT: no BT peripheral");
      return;
    }
    _btSerial->println(payload);
  }

  void writeConsole(const String payload)
  {
    Serial.println(payload);
  }

  String readBT()
  {
    if (!P_HAS_BLUETOOTH)
    {
      return "";
    }

    // writeConsole("SerialCom::readBT");
    if (hasBTSerialData())
    {
      // writeConsole("SerialCom::readBT: has data");
      String payload = _btSerial->readString();
      // writeConsole("SerialCom::readBT: payload=[" + payload + "]");
      return payload;
    }
    // writeConsole("SerialCom::readBT: no data");
    return "";
  }

  String readConsole()
  {
    // writeConsole("SerialCom::readConsole");
    if (hasConsoleSerialData())
    {
      // writeConsole("SerialCom::readConsole: has data");
      String payload = Serial.readString();
      // writeConsole("SerialCom::readConsole: payload=[" + payload + "]");
      return payload;
    }
    // writeConsole("SerialCom::readConsole: no data");
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

  boolean hasBTSerialData()
  {
    return _btSerial->available() > 0;
  }

  boolean hasConsoleSerialData()
  {
    return Serial.available() > 0;
  }

private:
  SoftwareSerial *_btSerial;
};

#endif