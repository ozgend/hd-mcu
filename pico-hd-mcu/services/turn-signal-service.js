const { GPIO } = require('gpio');
const { Hardware, Gpio, ServiceCode, ServiceCommand, ServiceType } = require('../constants');
const BaseService = require('../base-service');

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
  console.log(`TSM.handleInterrupt: PIN:${pin} MODE:${mode}`);

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

const _enableFlasher = (isLeft, isRight) => {
  console.log(`TSM.enableFlasher: LEFT:${isLeft} RIGHT:${isRight}`);
  _cancelerPid = setTimeout(() => { _disableFlasher("timeout"); }, Hardware.TURN_SIGNAL_BLINK_TIMEOUT);
  _flasherPid = setInterval(() => {
    if (isLeft) {
      digitalToggle(Gpio.SIGNAL_OUT_LEFT);
      _blink.Left = !_blink.Left;
    }
    if (isRight) {
      digitalToggle(Gpio.SIGNAL_OUT_RIGHT);
      _blink.Right = !_blink.Right;
    }
    console.log(`TSM.toggle: LEFT:${isLeft} RIGHT:${isRight} -- OUT_LEFT:${_blink.Left} OUT_RIGHT:${_blink.Right}`);
  }, Hardware.TURN_SIGNAL_BLINK_RATE);
  _state.Both = isLeft && isRight;
  _state.Left = isLeft && !isRight;
  _state.Right = !isLeft && isRight;
}

const _disableFlasher = (reason) => {
  console.log(`TSM.disableFlasher: ${reason}`);
  clearInterval(_flasherPid);
  clearTimeout(_cancelerPid);
  _flasherPid = 0;
  digitalWrite(Gpio.SIGNAL_OUT_LEFT, LOW);
  digitalWrite(Gpio.SIGNAL_OUT_RIGHT, LOW);
  _state.Both = false;
  _state.Left = false;
  _state.Right = false;
}

const _setFlasher = (isLeft, isRight) => {
  console.log(`TSM.setFlasher: LEFT:${isLeft} RIGHT:${isRight}`);
  _disableFlasher("cancel-any");
  if (isLeft || isRight) {
    _enableFlasher(isLeft, isRight);
  }
  _interrupts.Left = 0;
  _interrupts.Right = 0;
}

class TurnSignalService extends BaseService {
  constructor(messageBus) {
    super(ServiceCode.TurnSignalModule, ServiceType.ALWAYS_RUN, 1000, messageBus);
    pinMode(Gpio.SIGNAL_IN_LEFT, INPUT);
    pinMode(Gpio.SIGNAL_IN_RIGHT, INPUT);
    pinMode(Gpio.SIGNAL_OUT_LEFT, OUTPUT);
    pinMode(Gpio.SIGNAL_OUT_RIGHT, OUTPUT);
  }

  setup() {
    super.setup();
    attachInterrupt(Gpio.SIGNAL_IN_LEFT, _handleInterrupt, RISING);
    attachInterrupt(Gpio.SIGNAL_IN_RIGHT, _handleInterrupt, RISING);
  }

  handleCommand(command) {
    super.handleCommand(command);
    switch (command) {
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