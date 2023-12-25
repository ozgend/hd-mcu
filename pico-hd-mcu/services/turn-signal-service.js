const { GPIO } = require('gpio');
const { Hardware, Gpio, ServiceCode, ServiceCommand, ServiceType } = require('../constants');
const BaseService = require('../base-service');
const logger = require('../logger');

const _state = {
  Left: false,
  Right: false,
  Both: false
};

const _blink = {
  Left: false,
  Right: false
};

const _interrupts = {
  Left: 0,
  Right: 0
};

let _flasherPid = 0;
let _cancelerPid = 0;

const _handleInterrupt = (pin, mode) => {
  logger.debug(ServiceCode.TurnSignalModule, 'handleInterrupt', { pin, mode });

  // wait 100ms for the signal to settle for two pins before we check the state
  if (pin === Gpio.SIGNAL_IN_LEFT && mode === RISING) {
    _interrupts.Left++;
  }
  if (pin === Gpio.SIGNAL_IN_RIGHT && mode === RISING) {
    _interrupts.Right++;
  }
  setTimeout(() => {
    _setFlasher(_interrupts.Left > 0, _interrupts.Right > 0);
  }, Hardware.TURN_SIGNAL_INTERRUPT_WAIT);
}

const _diagnostic = () => {
  logger.debug(ServiceCode.TurnSignalModule, 'diagnostic', { _state, _blink, _interrupts });
  _disableFlasher("cancel-any");
  _enableFlasher(true, true, Hardware.TURN_SIGNAL_DIAG_RATE, Hardware.TURN_SIGNAL_DIAG_TIMEOUT);
}

const _enableFlasher = (isLeft, isRight, blinkRate, cancelTimeout) => {
  logger.debug(ServiceCode.TurnSignalModule, 'enableFlasher', { isLeft, isRight });
  _cancelerPid = setTimeout(() => { _disableFlasher("timeout"); }, cancelTimeout);
  _flasherPid = setInterval(() => {
    if (isLeft) {
      digitalToggle(Gpio.SIGNAL_OUT_LEFT);
      _blink.Left = !_blink.Left;
    }
    if (isRight) {
      digitalToggle(Gpio.SIGNAL_OUT_RIGHT);
      _blink.Right = !_blink.Right;
    }
    logger.debug(ServiceCode.TurnSignalModule, 'blink', _blink);
  }, blinkRate);
  _state.Both = isLeft && isRight;
  _state.Left = isLeft && !isRight;
  _state.Right = !isLeft && isRight;
}

const _disableFlasher = (reason) => {
  logger.debug(ServiceCode.TurnSignalModule, 'disableFlasher', { reason });
  digitalWrite(Gpio.SIGNAL_OUT_LEFT, LOW);
  digitalWrite(Gpio.SIGNAL_OUT_RIGHT, LOW);
  clearInterval(_flasherPid);
  clearTimeout(_cancelerPid);
  _flasherPid = 0;
  _cancelerPid = 0;
  _state.Both = false;
  _state.Left = false;
  _state.Right = false;
}

const _setFlasher = (isLeft, isRight) => {
  logger.debug(ServiceCode.TurnSignalModule, 'setFlasher', { isLeft, isRight });
  _disableFlasher("cancel-any");
  if (isLeft || isRight) {
    _enableFlasher(isLeft, isRight, Hardware.TURN_SIGNAL_BLINK_RATE, Hardware.TURN_SIGNAL_BLINK_TIMEOUT);
  }
  _interrupts.Left = 0;
  _interrupts.Right = 0;
}

class TurnSignalService extends BaseService {
  constructor(messageBus) {
    super(ServiceCode.TurnSignalModule, ServiceType.ON_DEMAND, 1000, messageBus);
  }

  setup() {
    super.setup();
    pinMode(Gpio.SIGNAL_IN_LEFT, INPUT);
    pinMode(Gpio.SIGNAL_IN_RIGHT, INPUT);
    pinMode(Gpio.SIGNAL_OUT_LEFT, OUTPUT);
    pinMode(Gpio.SIGNAL_OUT_RIGHT, OUTPUT);
    attachInterrupt(Gpio.SIGNAL_IN_LEFT, _handleInterrupt, RISING);
    attachInterrupt(Gpio.SIGNAL_IN_RIGHT, _handleInterrupt, RISING);
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
    this.data.blink = _blink;
    this.data.state = _state;
    this.data.irq = _interrupts;
    super.update();
  }
}

module.exports = TurnSignalService;