const { Button } = require('button');
const { Hardware, Gpio, ServiceCode, ServiceCommand, ServiceType, Broadcasting } = require('../constants');
const BaseService = require('../base-service');
const logger = require('../logger');

const _action = {
  left: false,
  right: false
};

const _state = {
  left: false,
  right: false
};

const _irq = {
  left: 0,
  right: 0
};

let _flasherPid = 0;
let _cancelerPid = 0;
let _checkerPid = 0;
let _diagCounter = 0;

// const _handleInterrupt = (pin, mode) => {
//   logger.debug(ServiceCode.TurnSignalModule, 'handleInterrupt', { pin, mode });

//   if (pin === Gpio.SIGNAL_IN_LEFT && mode === RISING) {
//     _irq.left++;
//   }
//   if (pin === Gpio.SIGNAL_IN_RIGHT && mode === RISING) {
//     _irq.right++;
//   }
//   _setFlasher(_irq.left > 0, _irq.right > 0);
// }

const _diagnostic = () => {
  _diagCounter = 0;
  logger.debug(ServiceCode.TurnSignalModule, 'diagnostic', { _state, _irq, _action });
  _disableFlasher("diag-start");

  _flasherPid = setInterval(() => {
    // digitalToggle(Gpio.SIGNAL_OUT_LEFT);
    // digitalToggle(Gpio.SIGNAL_OUT_RIGHT);
    _state.left = !_state.left;
    _state.right = !_state.right;
    digitalWrite(Gpio.SIGNAL_OUT_LEFT, _state.left ? HIGH : LOW);
    digitalWrite(Gpio.SIGNAL_OUT_RIGHT, _state.right ? HIGH : LOW);
    if (_diagCounter >= Hardware.TURN_SIGNAL_DIAG_COUNT) {
      _disableFlasher("diag-complete");
    }
    logger.debug(ServiceCode.TurnSignalModule, 'blink', { _state, _diagCounter });
    _diagCounter++;
  }, Hardware.TURN_SIGNAL_DIAG_RATE);
}

const _enableFlasher = (isLeft, isRight, blinkRate, cancelTimeout) => {
  logger.debug(ServiceCode.TurnSignalModule, 'enableFlasher', { isLeft, isRight });
  _cancelerPid = setTimeout(() => {
    _disableFlasher("timeout");
    _action.left = false;
    _action.right = false;
  }, cancelTimeout);
  _flasherPid = setInterval(() => {
    if (isLeft) {
      digitalToggle(Gpio.SIGNAL_OUT_LEFT);
      _state.left = !_state.left;
    }
    if (isRight) {
      digitalToggle(Gpio.SIGNAL_OUT_RIGHT);
      _state.right = !_state.right;
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
  _state.left = false;
  _state.right = false;
  _diagCounter = 0;
  logger.debug(ServiceCode.TurnSignalModule, 'disableFlasher', { reason });
}

const _setFlasher = (isLeft, isRight) => {
  logger.debug(ServiceCode.TurnSignalModule, 'setFlasher', { isLeft, isRight });
  _disableFlasher("cancel-any");
  if (isLeft || isRight) {
    _enableFlasher(isLeft, isRight, Hardware.TURN_SIGNAL_BLINK_RATE, Hardware.TURN_SIGNAL_BLINK_TIMEOUT);
  }
  // _irq.left = 0;
  // _irq.right = 0;
  // _action.left = false;
  // _action.right = false;
}

const _checkAction = (btnLeft, btnRight) => {
  if (btnLeft.read() === HIGH) {
    logger.debug(ServiceCode.TurnSignalModule, `checkAction.left-0 ${_action.left}`);
    _action.left = !_action.left;
    logger.debug(ServiceCode.TurnSignalModule, `checkAction.left-1 ${_action.left}`);
  }
  else {
    _action.left = false;
    logger.debug(ServiceCode.TurnSignalModule, `checkAction.left-NA ${_action.left}`);
  }

  if (btnRight.read() === HIGH) {
    logger.debug(ServiceCode.TurnSignalModule, `checkAction.right-0 ${_action.right}`);
    _action.right = !_action.right;
    logger.debug(ServiceCode.TurnSignalModule, `checkAction.right-1 ${_action.right}`);
  }
  else {
    _action.right = false;
    logger.debug(ServiceCode.TurnSignalModule, `checkAction.right-NA ${_action.right}`);
  }

  _setFlasher(_action.left, _action.right);
};

class TurnSignalService extends BaseService {
  constructor(eventBus) {
    super(eventBus, {
      serviceCode: ServiceCode.TurnSignalModule,
      serviceType: ServiceType.ON_DEMAND,
      broadcastMode: Broadcasting.OnDemandPolling
    });
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

  publishData() {
    this.data.state = _state;
    this.data.action = _action;
    super.publishData();
  }
}

module.exports = TurnSignalService;