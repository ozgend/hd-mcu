const { Button } = require('button');
const { Hardware, Gpio, ServiceCode, ServiceCommand } = require('../constants');
const BaseService = require('../base-service');

const CurrentState = {
  Left: false,
  Right: false,
  Both: false
};

const WillBlink = {
  Left: false,
  Right: false,
  Both: false
};

let _pid = 0;
let _valueLeft = -1;
let _valueRight = -1;

class TurnSignalModuleService extends BaseService {
  constructor(messageBus) {
    super(ServiceCode.TurnSignalModule, 200, messageBus);

    pinMode(Gpio.SIGNAL_OUT_LEFT, OUTPUT);
    pinMode(Gpio.SIGNAL_OUT_RIGHT, OUTPUT);
    pinMode(Gpio.SIGNAL_IN_LEFT, INPUT);
    pinMode(Gpio.SIGNAL_IN_RIGHT, INPUT);
  }

  handleCommand(command) {
    super.handleCommand(command);

    switch (command) {
      case ServiceCommand.ALL:
        this._setTargetChannel(true, true);
        break;
      case ServiceCommand.LEFT:
        this._setTargetChannel(true, false);
        break;
      case ServiceCommand.RIGHT:
        this._setTargetChannel(false, true);
        break;
      default:
        break;
    }
  }

  update() {
    this._readSwitchInputs();
    this._processState();
    base.update();
  }

  _setTargetChannel(isLeft, isRight) {
    if (isLeft && isRight) {
      WillBlink.Both = !WillBlink.Both;
      WillBlink.Left = false;
      WillBlink.Right = false;
      console.log(`TurnSignalModuleService._setTargetChannel: BOTH ${WillBlink.Both}`);
    }
    else if (isLeft) {
      WillBlink.Both = false;
      WillBlink.Left = !WillBlink.Left;
      WillBlink.Right = false;
      console.log(`TurnSignalModuleService._setTargetChannel: LEFT ${WillBlink.Left}`);
    }
    else if (isRight) {
      WillBlink.Both = false;
      WillBlink.Left = false;
      WillBlink.Right = !WillBlink.Right;
      console.log(`TurnSignalModuleService._setTargetChannel: RIGHT ${WillBlink.Right}`);
    }
  }

  _readSwitchInputs() {
    _valueLeft = digitalRead(Gpio.SIGNAL_IN_LEFT);
    _valueRight = digitalRead(Gpio.SIGNAL_IN_RIGHT);
    // console.log(`TurnSignalModuleService._readSwitchInputs: LEFT:${_valueLeft} RIGHT:${_valueRight}`);
    this._setTargetChannel(_valueLeft === HIGH, _valueRight === HIGH);
  }

  _processState() {
    if (!CurrentState.Both && WillBlink.Both) {
      this._enableFlasher(true, true);
      console.log(`TurnSignalModuleService._processState: BOTH ENABLE`);
    }
    else if (!CurrentState.Left && WillBlink.Left) {
      this._enableFlasher(true, false);
      console.log(`TurnSignalModuleService._processState: LEFT ENABLE`);
    }
    else if (!CurrentState.Right && WillBlink.Right) {
      this._enableFlasher(false, true);
      console.log(`TurnSignalModuleService._processState: RIGHT ENABLE`);
    }
    else if (CurrentState.Both && !WillBlink.Both) {
      this._disableFlasher("cancel_both");
      console.log(`TurnSignalModuleService._processState: BOTH DISABLE`);
    }
    else if (CurrentState.Left && !WillBlink.Left) {
      this._disableFlasher("cancel_left");
      console.log(`TurnSignalModuleService._processState: LEFT DISABLE`);
    }
    else if (CurrentState.Right && !WillBlink.Right) {
      this._disableFlasher("cancel_right");
      console.log(`TurnSignalModuleService._processState: RIGHT DISABLE`);
    }
  }

  _disableFlasher(reason) {
    cancelInterval(_pid);
    _pid = 0;
    console.log(`TurnSignalModuleService.disableFlasher: ${reason}`);
  }

  _enableFlasher(isLeft, isRight) {
    this._disableFlasher(_pid, "cancel");

    _pid = setInterval(() => {
      digitalWrite(Gpio.SIGNAL_OUT_LEFT, isLeft ? HIGH : LOW);
      digitalWrite(Gpio.SIGNAL_OUT_RIGHT, isRight ? HIGH : LOW);
    }, Hardware.TURN_SIGNAL_BLINK_RATE);

    CurrentState.Both = isLeft && isRight;
    CurrentState.Left = isLeft && !isRight;
    CurrentState.Right = !isLeft && isRight;

    setTimeout(() => {
      cancelInterval(_pid);

      _pid = 0;
    }, Hardware.TURN_SIGNAL_BLINK_TIMEOUT);
  }
}

module.exports = TurnSignalModuleService;