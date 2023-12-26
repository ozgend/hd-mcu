const { Button } = require('button');
const { Hardware, Gpio, ServiceCode, ServiceCommand, ServiceType } = require('../constants');
const BaseService = require('../base-service');
const logger = require('../logger');

// test out 3.3v
pinMode(25, OUTPUT);
digitalWrite(25, LOW);
pinMode(16, OUTPUT);
digitalWrite(16, HIGH);
//

const _action = {
  Left: false,
  Right: false
};

const _state = {
  Left: false,
  Right: false
};

const _irq = {
  Left: 0,
  Right: 0
};

let _flasherPid = 0;
let _cancelerPid = 0;
let _checkerPid = 0;
let _diagCounter = 0;

// const _handleInterrupt = (pin, mode) => {
//   logger.debug(ServiceCode.TurnSignalModule, 'handleInterrupt', { pin, mode });

//   if (pin === Gpio.SIGNAL_IN_LEFT && mode === RISING) {
//     _irq.Left++;
//   }
//   if (pin === Gpio.SIGNAL_IN_RIGHT && mode === RISING) {
//     _irq.Right++;
//   }
//   _setFlasher(_irq.Left > 0, _irq.Right > 0);
// }

const _diagnostic = () => {
  _diagCounter = 0;
  logger.debug(ServiceCode.TurnSignalModule, 'diagnostic', { _state, _irq, _action });
  _disableFlasher("diag-start");

  _flasherPid = setInterval(() => {
    // digitalToggle(Gpio.SIGNAL_OUT_LEFT);
    // digitalToggle(Gpio.SIGNAL_OUT_RIGHT);
    _state.Left = !_state.Left;
    _state.Right = !_state.Right;
    digitalWrite(Gpio.SIGNAL_OUT_LEFT, _state.Left ? HIGH : LOW);
    digitalWrite(Gpio.SIGNAL_OUT_RIGHT, _state.Right ? HIGH : LOW);
    if (++_diagCounter >= Hardware.TURN_SIGNAL_DIAG_COUNT) {
      _disableFlasher("diag-complete");
    }
    logger.debug(ServiceCode.TurnSignalModule, 'blink', { _state, _diagCounter });
  }, Hardware.TURN_SIGNAL_DIAG_RATE);
}

const _enableFlasher = (isLeft, isRight, blinkRate, cancelTimeout) => {
  logger.debug(ServiceCode.TurnSignalModule, 'enableFlasher', { isLeft, isRight });
  _cancelerPid = setTimeout(() => { _disableFlasher("timeout"); }, cancelTimeout);
  _flasherPid = setInterval(() => {
    if (isLeft) {
      digitalToggle(Gpio.SIGNAL_OUT_LEFT);
      _state.Left = !_state.Left;
    }
    if (isRight) {
      digitalToggle(Gpio.SIGNAL_OUT_RIGHT);
      _state.Right = !_state.Right;
    }
    logger.debug(ServiceCode.TurnSignalModule, 'state', _state);
  }, blinkRate);
}

const _disableFlasher = (reason) => {
  clearInterval(_flasherPid);
  clearTimeout(_cancelerPid);
  digitalWrite(Gpio.SIGNAL_OUT_LEFT, LOW);
  digitalWrite(Gpio.SIGNAL_OUT_RIGHT, LOW);
  _flasherPid = 0;
  _cancelerPid = 0;
  _state.Left = false;
  _state.Right = false;
  _diagCounter = 0;
  logger.debug(ServiceCode.TurnSignalModule, 'disableFlasher', { reason });
}

const _setFlasher = (isLeft, isRight) => {
  logger.debug(ServiceCode.TurnSignalModule, 'setFlasher', { isLeft, isRight });
  _disableFlasher("cancel-any");
  if (isLeft || isRight) {
    _enableFlasher(isLeft, isRight, Hardware.TURN_SIGNAL_BLINK_RATE, Hardware.TURN_SIGNAL_BLINK_TIMEOUT);
  }
  // _irq.Left = 0;
  // _irq.Right = 0;
  // _action.Left = false;
  // _action.Right = false;
}

const _checkAction = (btnLeft, btnRight) => {
  if (btnLeft.read() === HIGH) {
    logger.debug(ServiceCode.TurnSignalModule, `checkAction.left-0 ${_action.Left}`);
    _action.Left = !_action.Left;
    logger.debug(ServiceCode.TurnSignalModule, `checkAction.left-1 ${_action.Left}`);
  }
  else {
    _action.Left = false;
    logger.debug(ServiceCode.TurnSignalModule, `checkAction.left-NA ${_action.Left}`);
  }

  if (btnRight.read() === HIGH) {
    logger.debug(ServiceCode.TurnSignalModule, `checkAction.right-0 ${_action.Right}`);
    _action.Right = !_action.Right;
    logger.debug(ServiceCode.TurnSignalModule, `checkAction.right-1 ${_action.Right}`);
  }
  else {
    _action.Right = false;
    logger.debug(ServiceCode.TurnSignalModule, `checkAction.right-NA ${_action.Right}`);
  }

  _setFlasher(_action.Left, _action.Right);
};

class TurnSignalService extends BaseService {
  constructor(messageBus) {
    super(ServiceCode.TurnSignalModule, ServiceType.ON_DEMAND, 1000, messageBus);
  }

  setup() {
    super.setup();
    // pinMode(Gpio.SIGNAL_IN_LEFT, INPUT);
    // pinMode(Gpio.SIGNAL_IN_RIGHT, INPUT);
    pinMode(Gpio.SIGNAL_OUT_LEFT, OUTPUT);
    pinMode(Gpio.SIGNAL_OUT_RIGHT, OUTPUT);

    _diagnostic();

    // attachInterrupt(Gpio.SIGNAL_IN_LEFT, _handleInterrupt, FALLING);
    // attachInterrupt(Gpio.SIGNAL_IN_RIGHT, _handleInterrupt, FALLING);

    this.leftButton = new Button(Gpio.SIGNAL_IN_LEFT, { mode: INPUT, event: RISING, debounce: Hardware.TURN_SIGNAL_BTN_DEBOUNCE });
    this.rightButton = new Button(Gpio.SIGNAL_IN_RIGHT, { mode: INPUT, event: RISING, debounce: Hardware.TURN_SIGNAL_BTN_DEBOUNCE });

    this.leftButton.on('click', () => {
      clearTimeout(_checkerPid);
      _checkerPid = setTimeout(() => {
        _checkAction(this.leftButton, this.rightButton);
      }, Hardware.TURN_SIGNAL_BTN_DEBOUNCE);
    });

    this.rightButton.on('click', () => {
      clearTimeout(_checkerPid);
      _checkerPid = setTimeout(() => {
        _checkAction(this.leftButton, this.rightButton);
      }, Hardware.TURN_SIGNAL_BTN_DEBOUNCE);
    });
  }

  handleCommand(command) {
    super.handleCommand(command);
    switch (command) {
      case ServiceCommand.DIAG:
        _diagnostic();
        break;
      case ServiceCommand.NONE:
        _setFlasher(false, false);
        break;
      case ServiceCommand.ALL:
      case ServiceCommand.BOTH:
        _setFlasher(true, true);
        break;
      case ServiceCommand.LEFT:
        _setFlasher(true, false);
        break;
      case ServiceCommand.RIGHT:
        _setFlasher(false, true);
        break;
      default:
        break;
    }
  }

  update() {
    this.data.blink = _state;
    this.data.irq = _irq;
    this.data.will = _action;
    super.update();
  }
}

module.exports = TurnSignalService;