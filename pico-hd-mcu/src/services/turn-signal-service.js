const { readObject, writeObject } = require('../utils');
const logger = require('../logger');
const { Button } = require('button');
const { Hardware, Gpio, ServiceCode, TurnSignalCommands, ServiceType, BroadcastMode, FILE_TSM_CONFIG } = require('../../../ts-schema/constants');
const BaseService = require('../base-service');
const { TsmSettings } = require('../../../ts-schema/data.model');

const defaultTsmConfig = {
  blinkRate: Hardware.TURN_SIGNAL_BLINK_RATE,
  blinkTimeout: Hardware.TURN_SIGNAL_BLINK_TIMEOUT,
  btnDebounce: Hardware.TURN_SIGNAL_BTN_DEBOUNCE,
  diagCount: Hardware.TURN_SIGNAL_DIAG_COUNT,
  diagRate: Hardware.TURN_SIGNAL_DIAG_RATE,
};

const tsmConfig = readObject(FILE_TSM_CONFIG) || TsmSettings.default(defaultTsmConfig);

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
let _diagCounter = 0;

const _diagnostic = () => {
  logger.debug(ServiceCode.TurnSignalModule, 'diagnostic', { _state, _action });
  logger.pulse.down();
  _disableFlasher("diag-start");

  _flasherPid = setInterval(() => {
    if (_diagCounter > ((tsmConfig.diagCount) * 2)) {
      _disableFlasher("diag-complete [" + _diagCounter + "] cycles");
      _diagCounter = 0;
      return;
    }
    _state.left = !_state.left;
    _state.right = !_state.right;
    digitalToggle(Gpio.SIGNAL_OUT_LEFT);
    digitalToggle(Gpio.SIGNAL_OUT_RIGHT);
    _diagCounter++;
    logger.pulse.toggle();
    logger.debug(ServiceCode.TurnSignalModule, 'diagnostic', { _state, _diagCounter });
  }, tsmConfig.diagRate);
}

const _enableFlasher = (isLeft, isRight, blinkRate, cancelTimeout, doNotCancel) => {
  logger.debug(ServiceCode.TurnSignalModule, 'enableFlasher', { isLeft, isRight });

  if (doNotCancel) {
    _cancelerPid = 0;
    logger.debug(ServiceCode.TurnSignalModule, 'will not cancel', { isLeft, isRight });
  }
  else {
    logger.debug(ServiceCode.TurnSignalModule, 'will auto-cancel', { isLeft, isRight });
    _cancelerPid = setTimeout(() => {
      _disableFlasher("timeout");
      _action.left = false;
      _action.right = false;
    }, cancelTimeout);
  }

  _flasherPid = setInterval(() => {
    if (isLeft) {
      digitalToggle(Gpio.SIGNAL_OUT_LEFT);
      _state.left = !_state.left;
    }
    if (isRight) {
      digitalToggle(Gpio.SIGNAL_OUT_RIGHT);
      _state.right = !_state.right;
    }
    logger.pulse.toggle();
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
  logger.pulse.up();
}

const _setFlasher = (isLeft, isRight) => {
  logger.debug(ServiceCode.TurnSignalModule, 'setFlasher', { isLeft, isRight });
  logger.pulse.down();
  _disableFlasher("cancel-any");
  if (isLeft || isRight) {
    _enableFlasher(isLeft, isRight, tsmConfig.blinkRate, tsmConfig.blinkTimeout, isLeft && isRight);
  }
}

const _checkAction = (btnLeft, btnRight) => {
  let _readLeft = btnLeft.read();
  let _readRight = btnRight.read();

  logger.debug(ServiceCode.TurnSignalModule, `checkAction.left-current ${_action.left}, read: ${_readLeft}`);
  logger.debug(ServiceCode.TurnSignalModule, `checkAction.right-current ${_action.right}, read: ${_readRight}`);

  // hazard lights check
  if (_readLeft === HIGH && _readRight === HIGH) {

  }

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
      broadcastMode: BroadcastMode.OnDemandPolling,
      commands: Object.values(TurnSignalCommands),
    });
  }

  setup() {
    super.setup();
    pinMode(Gpio.SIGNAL_IN_LEFT, INPUT_PULLUP);
    pinMode(Gpio.SIGNAL_IN_RIGHT, INPUT_PULLUP);
    pinMode(Gpio.SIGNAL_OUT_LEFT, OUTPUT);
    pinMode(Gpio.SIGNAL_OUT_RIGHT, OUTPUT);

    _diagnostic();

    this.leftButton = new Button(Gpio.SIGNAL_IN_LEFT, { mode: INPUT, event: RISING, debounce: tsmConfig.btnDebounce });
    this.rightButton = new Button(Gpio.SIGNAL_IN_RIGHT, { mode: INPUT, event: RISING, debounce: tsmConfig.btnDebounce });

    this.leftButton.on('click', () => {
      _checkAction(this.leftButton, this.rightButton);
    });

    this.rightButton.on('click', () => {
      _checkAction(this.leftButton, this.rightButton);
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