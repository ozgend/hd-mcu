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

const _will = {
  Left: false,
  Right: false
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
let _diagCounter = 0;

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
  _diagCounter = 0;
  logger.debug(ServiceCode.TurnSignalModule, 'diagnostic', { _blink, _interrupts });
  _disableFlasher("diag-start");

  _flasherPid = setInterval(() => {
    // digitalToggle(Gpio.SIGNAL_OUT_LEFT);
    // digitalToggle(Gpio.SIGNAL_OUT_RIGHT);
    _blink.Left = !_blink.Left;
    _blink.Right = !_blink.Right;
    digitalWrite(Gpio.SIGNAL_OUT_LEFT, _blink.Left ? HIGH : LOW);
    digitalWrite(Gpio.SIGNAL_OUT_RIGHT, _blink.Right ? HIGH : LOW);
    if (++_diagCounter >= Hardware.TURN_SIGNAL_DIAG_COUNT) {
      // setTimeout(() => { 
      _disableFlasher("diag-complete");
      // }, 250);
    }
    logger.debug(ServiceCode.TurnSignalModule, 'blink', { _blink, _diagCounter });
  }, Hardware.TURN_SIGNAL_DIAG_RATE);
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
}

const _disableFlasher = (reason) => {
  clearInterval(_flasherPid);
  clearTimeout(_cancelerPid);
  digitalWrite(Gpio.SIGNAL_OUT_LEFT, LOW);
  digitalWrite(Gpio.SIGNAL_OUT_RIGHT, LOW);
  _flasherPid = 0;
  _cancelerPid = 0;
  _blink.Left = false;
  _blink.Right = false;
  _diagCounter = 0;
  logger.debug(ServiceCode.TurnSignalModule, 'disableFlasher', { reason });
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
      logger.debug(ServiceCode.TurnSignalModule, 'click.left', { _interrupts });
      _interrupts.Left = _interrupts.Left > 0 ? 0 : 1;
      if (this.rightButton.read() === HIGH) {
        _interrupts.Right = _interrupts.Right > 0 ? 0 : 1;
      }
      // else {
      //   _interrupts.Left = _interrupts.Left > 0 ? 0 : 1;
      // }
      _setFlasher(_interrupts.Left > 0, _interrupts.Right > 0);
    });

    this.rightButton.on('click', () => {
      logger.debug(ServiceCode.TurnSignalModule, 'click.right', { _interrupts });
      _interrupts.Right = _interrupts.Right > 0 ? 0 : 1;
      if (this.leftButton.read() === HIGH) {
        _interrupts.Left = _interrupts.Left > 0 ? 0 : 1;
      }
      // else {
      //   _interrupts.Right = _interrupts.Right > 0 ? 0 : 1;
      // }
      _setFlasher(_interrupts.Left > 0, _interrupts.Right > 0);
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
    this.data.blink = _blink;
    this.data.irq = _interrupts;
    super.update();
  }
}

module.exports = TurnSignalService;