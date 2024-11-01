const logger = require('../logger');
const { Button } = require('button');
const { Hardware, Gpio, ServiceCode, TurnSignalCommands, ServiceType, Broadcasting } = require('../../ts-schema/constants');
const BaseService = require('../base-service');

const _action = {
  left: false,
  right: false
};

const _state = {
  left: false,
  right: false
};

let _flasherPid = 0;
let _cancelerPid = 0;
let _checkerPid = 0;
let _diagCounter = 0;

const _diagnostic = () => {
  logger.debug(ServiceCode.TurnSignalModule, 'diagnostic', { _state, _action });
  _disableFlasher("diag-start");

  _flasherPid = setInterval(() => {
    if (_diagCounter > (Hardware.TURN_SIGNAL_DIAG_COUNT) * 2) {
      _disableFlasher("diag-complete [" + _diagCounter + "] cycles");
      _diagCounter = 0;
      return;
    }
    _state.left = !_state.left;
    _state.right = !_state.right;
    digitalWrite(Gpio.SIGNAL_OUT_LEFT, _state.left ? HIGH : LOW);
    digitalWrite(Gpio.SIGNAL_OUT_RIGHT, _state.right ? HIGH : LOW);
    logger.debug(ServiceCode.TurnSignalModule, 'diagnostic', { _state, _diagCounter });
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
}

const _checkAction = (btnLeft, btnRight) => {
  let _readLeft = btnLeft.read();
  let _readRight = btnRight.read();

  logger.debug(ServiceCode.TurnSignalModule, `checkAction.left-current ${_action.left}, read: ${_readLeft}`);
  logger.debug(ServiceCode.TurnSignalModule, `checkAction.right-current ${_action.right}, read: ${_readRight}`);

  if (_readLeft === HIGH) {
    _action.left = !_action.left;
    logger.debug(ServiceCode.TurnSignalModule, `checkAction.left-HIGH ${_action.left}`);
  }
  else {
    _action.left = false;
    // logger.debug(ServiceCode.TurnSignalModule, `checkAction.left-LOW ${_action.left}`);
  }

  if (_readRight === HIGH) {
    _action.right = !_action.right;
    logger.debug(ServiceCode.TurnSignalModule, `checkAction.right-HIGH ${_action.right}`);
  }
  else {
    _action.right = false;
    // logger.debug(ServiceCode.TurnSignalModule, `checkAction.right-LOW ${_action.right}`);
  }

  _setFlasher(_action.left, _action.right);
};

class TurnSignalService extends BaseService {
  constructor(eventBus) {
    super(eventBus, {
      serviceCode: ServiceCode.TurnSignalModule,
      serviceType: ServiceType.ON_DEMAND,
      broadcastMode: Broadcasting.OnDemandPolling,
      commands: Object.values(TurnSignalCommands),
    });
  }

  setup() {
    super.setup();
    pinMode(Gpio.SIGNAL_OUT_LEFT, OUTPUT);
    pinMode(Gpio.SIGNAL_OUT_RIGHT, OUTPUT);

    _diagnostic();

    this.leftButton = new Button(Gpio.SIGNAL_IN_LEFT, { mode: INPUT, event: RISING, debounce: Hardware.TURN_SIGNAL_BTN_DEBOUNCE });
    this.rightButton = new Button(Gpio.SIGNAL_IN_RIGHT, { mode: INPUT, event: RISING, debounce: Hardware.TURN_SIGNAL_BTN_DEBOUNCE });

    this.leftButton.on('click', () => {
      _checkAction(this.leftButton, this.rightButton);

      // clearTimeout(_checkerPid);
      // _checkerPid = setTimeout(() => {
      //   _checkAction(this.leftButton, this.rightButton);
      // }, Hardware.TURN_SIGNAL_BTN_DEBOUNCE);
    });

    this.rightButton.on('click', () => {
      _checkAction(this.leftButton, this.rightButton);

      // clearTimeout(_checkerPid);
      // _checkerPid = setTimeout(() => {
      //   _checkAction(this.leftButton, this.rightButton);
      // }, Hardware.TURN_SIGNAL_BTN_DEBOUNCE);
    });
  }

  handleCommand(command) {
    super.handleCommand(command);

    if (command === TurnSignalCommands.DIAG) {
      _diagnostic();
    }
    else {
      switch (command) {
        case TurnSignalCommands.ALL:
          _action.left = true;
          _action.right = true;
          break;
        case TurnSignalCommands.LEFT:
          _action.left = !_action.left;
          _action.right = false;
          break;
        case TurnSignalCommands.RIGHT:
          _action.left = false;
          _action.right = !_action.right;
          break;
        case TurnSignalCommands.NONE:
          _action.left = false;
          _action.right = false;
          break;
        default:
          _action.left = false;
          _action.right = false;
          break;
      }
      _setFlasher(_action.left, _action.right);
    }
  }

  publishData() {
    this.data.state = _state;
    this.data.action = _action;
    super.publishData();
  }
}

module.exports = TurnSignalService;