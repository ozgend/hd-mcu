#ifndef __turn_signal_service__
#define __turn_signal_service__

#include "../base_service.h"
#include "../config_hw.h"

#define SIGNAL_FLASHER_DELAY_MS 400
#define SWITCH_READ_DELAY_INITIAL_MS 200
#define SWITCH_ANALOGUE_VALUE_THRESHOLD 800
#define SIGNAL_FLASHER_CANCEL_TIMEOUT_MS 30000

#define ACTION_TOGGLE_BOTH F("TOGGLE_BOTH")
#define ACTION_TOGGLE_LEFT F("TOGGLE_LEFT")
#define ACTION_TOGGLE_RIGHT F("TOGGLE_RIGHT")

#define MODE_RELAY_LEFT 0
#define MODE_RELAY_RIGHT 1
#define MODE_RELAY_BOTH 2
#define MODE_RELAY_NONE 3

int RELAY_CHANNEL_STATUS[3] = {false, false, false};

class TurnSignalService : public BaseService
{
public:
  TurnSignalService(SerialCom *com) : BaseService(SERVICE_CODE_TSM, SERVICE_TYPE_ALWAYS_RUN, com)
  {
    _lastBlinkTime = 0;
    _now = millis();
    _selectedChannel = MODE_RELAY_NONE;
    _rightSwitchAnalogueValue = 0;
    _leftSwitchAnalogueValue = 0;
  }

  void setup()
  {
    this->log(F("setup"));
    pinMode(PIN_SIGNAL_IN_LEFT, INPUT);
    pinMode(PIN_SIGNAL_IN_RIGHT, INPUT);
    pinMode(PIN_SIGNAL_OUT_LEFT, OUTPUT);
    pinMode(PIN_SIGNAL_OUT_RIGHT, OUTPUT);
    pinMode(LED_BUILTIN, OUTPUT);
    disableRelayChannels();
    this->log(F("setup"), F("done"));
  }

  void update()
  {
    if (!P_HAS_TURN_SIGNAL)
    {
      this->log(F("update"), F("no TSM peripheral"));
      return;
    }

    _now = millis();
    readSwitchInputs();
    processState();
  }

  void diagnosis(int checkCount, int delayMs)
  {
    // this->log(F("diagnosis"), String(checkCount) + " times with " + String(delayMs) + "ms delay");

    int count = 0;
    int loopCount = checkCount * 2;
    bool isOn = false;

    while (count != loopCount)
    {
      if (count == loopCount)
      {
        break;
      }

      _now = millis();

      if (_now - _lastBlinkTime < delayMs)
      {
        continue;
      }

      _lastBlinkTime = millis();
      isOn = toggleRelayChannel(MODE_RELAY_BOTH);
      digitalWrite(LED_BUILTIN, isOn ? HIGH : LOW);
      count++;
    }

    turnOff(F("init diagnosis"));
  }

  void processCommand(const String &command)
  {
    if (isCommandMatch(command, SERVICE_COMMAND_BEGIN_TSM_DIAG))
    {
      _hasRemoteControl = true;
      diagnosis(5, 100);
    }
    else if (isCommandMatch(command, SERVICE_COMMAND_BEGIN_TSM_LEFT))
    {
      _hasRemoteControl = true;
      decideState(true, false);
    }
    else if (isCommandMatch(command, SERVICE_COMMAND_BEGIN_TSM_RIGHT))
    {
      _hasRemoteControl = true;
      decideState(false, true);
    }
    else if (isCommandMatch(command, SERVICE_COMMAND_BEGIN_TSM_ALL))
    {
      _hasRemoteControl = true;
      decideState(true, true);
    }
    else if (isCommandMatch(command, SERVICE_COMMAND_END_TSM))
    {
      _hasRemoteControl = true;
      turnOff(F("remote cancel"));
    }
  }

private:
  String _action;

  bool _willBlinkBoth;
  bool _willBlinkLeft;
  bool _willBlinkRight;
  bool _willBlinkAny;
  bool _isBlinkerOn;

  int _selectedChannel;
  int _rightSwitchAnalogueValue;
  int _leftSwitchAnalogueValue;

  long _now;
  long _blinkStartedTime;
  long _lastBlinkTime;

  long _lastSwitchReadTime;

  int _encoderStateA;
  int _encoderLastStateA;

  bool _hasRemoteControl;

  void decideState(bool left, bool right)
  {
    if (left && right)
    {
      _willBlinkBoth = !_willBlinkBoth;
      _willBlinkLeft = false;
      _willBlinkRight = false;
      _blinkStartedTime = _willBlinkBoth ? _now : -1;
      _selectedChannel = _willBlinkBoth ? MODE_RELAY_BOTH : MODE_RELAY_NONE;
      _action = ACTION_TOGGLE_BOTH;
      // this->log(F("readSwitchInputs"), String(F("action: ")) + _action + String(F(",  _willBlinkBoth: ")) + String(_willBlinkBoth));
    }

    else if (left)
    {
      _willBlinkBoth = false;
      _willBlinkLeft = !_willBlinkLeft;
      _willBlinkRight = false;
      _blinkStartedTime = _willBlinkLeft ? _now : -1;
      _selectedChannel = _willBlinkLeft ? MODE_RELAY_LEFT : MODE_RELAY_NONE;
      _action = ACTION_TOGGLE_LEFT;
      // this->log(F("readSwitchInputs"), String(F("action: ")) + _action + String(F(",  _willBlinkLeft: ")) + String(_willBlinkLeft));
    }

    else if (right)
    {
      _willBlinkBoth = false;
      _willBlinkLeft = false;
      _willBlinkRight = !_willBlinkRight;
      _blinkStartedTime = _willBlinkRight ? _now : -1;
      _selectedChannel = _willBlinkRight ? MODE_RELAY_RIGHT : MODE_RELAY_NONE;
      _action = ACTION_TOGGLE_RIGHT;
      // this->log(F("readSwitchInputs"), String(F("action: ")) + _action + String(F(",  _willBlinkRight: ")) + String(_willBlinkRight));
    }
  }

  void readSwitchInputs()
  {
    if (_now - _lastSwitchReadTime < SWITCH_READ_DELAY_INITIAL_MS)
    {
      return;
    }

    _lastSwitchReadTime = millis();
    _leftSwitchAnalogueValue = analogRead(PIN_SIGNAL_IN_LEFT);
    _rightSwitchAnalogueValue = analogRead(PIN_SIGNAL_IN_RIGHT);

    decideState(_leftSwitchAnalogueValue > SWITCH_ANALOGUE_VALUE_THRESHOLD, _rightSwitchAnalogueValue > SWITCH_ANALOGUE_VALUE_THRESHOLD);
  }

  void processState()
  {
    _willBlinkAny = _willBlinkBoth || _willBlinkLeft || _willBlinkRight;

    // if blinking, check for cancellation
    if (_isBlinkerOn && !_willBlinkAny)
    {
      turnOff(F("cancelled"));
      return;
    }

    // if not blinking and no input switch, do nothing
    if (!_isBlinkerOn && !_willBlinkAny)
    {
      return;
    }

    // if blinking, check for timeout
    if (_isBlinkerOn && _now - _blinkStartedTime > SIGNAL_FLASHER_CANCEL_TIMEOUT_MS)
    {
      turnOff(F("timeout"));
      return;
    }

    // if blinking, check for flash delay
    if (_isBlinkerOn && _now - _lastBlinkTime < SIGNAL_FLASHER_DELAY_MS)
    {
      return;
    }

    _isBlinkerOn = true;
    _lastBlinkTime = millis();
    toggle(_selectedChannel);
  }

  void toggle(int channel)
  {
    bool channelState = toggleRelayChannel(_selectedChannel);
    digitalWrite(LED_BUILTIN, channelState ? HIGH : LOW);
    // this->log(F("toggle"), String(F("channelState: ")) + String(channelState) + String(F(",  _selectedChannel: ")) + String(_selectedChannel) + String(F(",  _isBlinkerOn: ")) + String(_isBlinkerOn));
  }

  void turnOff(const String &reason)
  {
    _isBlinkerOn = false;
    _blinkStartedTime = -1;

    _willBlinkBoth = false;
    _willBlinkLeft = false;
    _willBlinkRight = false;
    _hasRemoteControl = false;

    disableRelayChannels();
    digitalWrite(LED_BUILTIN, LOW);
    this->log(F("turnOff"), reason);
  }

  void setRelayModeState(int mode, bool isOn)
  {
    // this->log(F("setRelayModeState"), String(F("mode: ")) + String(mode) + String(F(",  isOn: ")) + String(isOn));

    switch (mode)
    {
    case MODE_RELAY_LEFT:
      digitalWrite(PIN_SIGNAL_OUT_LEFT, isOn ? HIGH : LOW);
      digitalWrite(PIN_SIGNAL_OUT_RIGHT, LOW);
      RELAY_CHANNEL_STATUS[MODE_RELAY_BOTH] = false;
      RELAY_CHANNEL_STATUS[MODE_RELAY_LEFT] = isOn;
      RELAY_CHANNEL_STATUS[MODE_RELAY_RIGHT] = false;
      break;

    case MODE_RELAY_RIGHT:
      digitalWrite(PIN_SIGNAL_OUT_LEFT, LOW);
      digitalWrite(PIN_SIGNAL_OUT_RIGHT, isOn ? HIGH : LOW);
      RELAY_CHANNEL_STATUS[MODE_RELAY_BOTH] = false;
      RELAY_CHANNEL_STATUS[MODE_RELAY_LEFT] = false;
      RELAY_CHANNEL_STATUS[MODE_RELAY_RIGHT] = isOn;
      break;

    case MODE_RELAY_BOTH:
      digitalWrite(PIN_SIGNAL_OUT_LEFT, isOn ? HIGH : LOW);
      digitalWrite(PIN_SIGNAL_OUT_RIGHT, isOn ? HIGH : LOW);
      RELAY_CHANNEL_STATUS[MODE_RELAY_BOTH] = isOn;
      RELAY_CHANNEL_STATUS[MODE_RELAY_LEFT] = false;
      RELAY_CHANNEL_STATUS[MODE_RELAY_RIGHT] = false;
      break;

    case MODE_RELAY_NONE:
    default:
      digitalWrite(PIN_SIGNAL_OUT_LEFT, LOW);
      digitalWrite(PIN_SIGNAL_OUT_RIGHT, LOW);
      RELAY_CHANNEL_STATUS[MODE_RELAY_BOTH] = false;
      RELAY_CHANNEL_STATUS[MODE_RELAY_LEFT] = false;
      RELAY_CHANNEL_STATUS[MODE_RELAY_RIGHT] = false;
      break;
    }
  }

  void disableRelayChannels()
  {
    setRelayModeState(MODE_RELAY_NONE, false);
  }

  bool toggleRelayChannel(int mode)
  {
    setRelayModeState(mode, !RELAY_CHANNEL_STATUS[mode]);
    return RELAY_CHANNEL_STATUS[mode];
  }
};

#endif