/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { IEventBus } from "../event-bus";
import { readObject, writeObject } from "../utils";
import { Logging, Pulsing } from "../logger";
import { Button } from "button";
import { Hardware, Gpio, ServiceCode, TurnSignalCommands, ServiceType, BroadcastMode, FILE_TSM_CONFIG } from "../../../ts-schema/constants";
import { BaseService } from "../base-service";
import { TsmSettings } from "../../../ts-schema/data.model";

const defaultTsmConfig = {
  blinkRate: Hardware.TURN_SIGNAL_BLINK_RATE,
  blinkTimeout: Hardware.TURN_SIGNAL_BLINK_TIMEOUT,
  btnDebounce: Hardware.TURN_SIGNAL_BTN_DEBOUNCE,
  diagCount: Hardware.TURN_SIGNAL_DIAG_COUNT,
  diagRate: Hardware.TURN_SIGNAL_DIAG_RATE,
};

let tsmConfig = readObject(FILE_TSM_CONFIG);

if (!tsmConfig) {
  Logging.debug(ServiceCode.TurnSignalModule, "TSM config not found, creating default config");
  tsmConfig = TsmSettings.default(defaultTsmConfig);
  writeObject(FILE_TSM_CONFIG, tsmConfig);
}

const _action = {
  left: false,
  right: false,
};

const _state = {
  left: false,
  right: false,
};

let _flasherPid = 0;
let _cancelerPid = 0;
let _diagCounter = 0;

const _diagnostic = () => {
  Logging.debug(ServiceCode.TurnSignalModule, "diagnostic", { _state, _action });
  Pulsing.down();
  _disableFlasher("diag-start");

  _flasherPid = setInterval(() => {
    if (_diagCounter > tsmConfig.diagCount * 2) {
      _disableFlasher("diag-complete [" + _diagCounter + "] cycles");
      _diagCounter = 0;
      return;
    }
    _state.left = !_state.left;
    _state.right = !_state.right;
    digitalToggle(Gpio.SIGNAL_OUT_LEFT);
    digitalToggle(Gpio.SIGNAL_OUT_RIGHT);
    _diagCounter++;
    Pulsing.toggle();
    Logging.debug(ServiceCode.TurnSignalModule, "diagnostic", { _state, _diagCounter });
  }, tsmConfig.diagRate);
};

const _enableFlasher = (isLeft, isRight, blinkRate, cancelTimeout, doNotCancel) => {
  Logging.debug(ServiceCode.TurnSignalModule, "enableFlasher", { isLeft, isRight });

  if (doNotCancel) {
    _cancelerPid = 0;
    Logging.debug(ServiceCode.TurnSignalModule, "will not cancel", { isLeft, isRight });
  } else {
    Logging.debug(ServiceCode.TurnSignalModule, "will auto-cancel", { isLeft, isRight });
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
    Pulsing.toggle();
    Logging.debug(ServiceCode.TurnSignalModule, "state", _state);
  }, blinkRate);
};

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

  Logging.debug(ServiceCode.TurnSignalModule, "disableFlasher", { reason });
  Pulsing.up();
};

const _setFlasher = (isLeft, isRight) => {
  Logging.debug(ServiceCode.TurnSignalModule, "setFlasher", { isLeft, isRight });
  Pulsing.down();
  _disableFlasher("cancel-any");
  if (isLeft || isRight) {
    _enableFlasher(isLeft, isRight, tsmConfig.blinkRate, tsmConfig.blinkTimeout, isLeft && isRight);
  }
};

let lastHazardInputTime = 0;

const _checkAction = (btnLeft, btnRight) => {
  const traceId = Logging.generateTraceId();

  const _readLeft = btnLeft.read();
  const _readRight = btnRight.read();

  Logging.debug(ServiceCode.TurnSignalModule, `checkAction.left-current ${_action.left}, read: ${_readLeft} @ ${traceId}`);
  Logging.debug(ServiceCode.TurnSignalModule, `checkAction.right-current ${_action.right}, read: ${_readRight} @ ${traceId}`);

  // hazard lights check
  if (_readLeft === 1 && _readRight === 1) {
    const currentTime = Date.now();
    if (currentTime - lastHazardInputTime < tsmConfig.btnDebounce) {
      Logging.debug(ServiceCode.TurnSignalModule, `checkAction.hazard debounce active @ ${traceId}`);
      return; // debounce active, ignore
    }
    lastHazardInputTime = currentTime;
    Logging.debug(ServiceCode.TurnSignalModule, `checkAction.hazard input detected @ ${traceId}`);

    if (_action.left && _action.right) {
      _action.left = false;
      _action.right = false;
      Logging.debug(ServiceCode.TurnSignalModule, `checkAction.hazard will disable : lr: ${_action.left && _action.right} @ ${traceId}`);
    } else {
      _action.left = true;
      _action.right = true;
      Logging.debug(ServiceCode.TurnSignalModule, `checkAction.hazard will enable: lr: ${_action.left && _action.right} @ ${traceId}`);
    }
  } else {
    // turn signal check
    if (_readLeft === HIGH) {
      _action.left = !_action.left;
      Logging.debug(ServiceCode.TurnSignalModule, `checkAction.left-HIGH ${_action.left} @ ${traceId}`);
    } else {
      _action.left = false;
      Logging.debug(ServiceCode.TurnSignalModule, `checkAction.left-LOW ${_action.left} @ ${traceId}`);
    }
    if (_readRight === HIGH) {
      _action.right = !_action.right;
      Logging.debug(ServiceCode.TurnSignalModule, `checkAction.right-HIGH ${_action.right} @ ${traceId}`);
    } else {
      _action.right = false;
      Logging.debug(ServiceCode.TurnSignalModule, `checkAction.right-LOW ${_action.right} @ ${traceId}`);
    }
  }

  _setFlasher(_action.left, _action.right);
};

export class TurnSignalService extends BaseService<any> {
  private leftButton: Button;
  private rightButton: Button;

  constructor(eventBus: IEventBus) {
    super(eventBus, {
      serviceCode: ServiceCode.TurnSignalModule,
      serviceType: ServiceType.OnDemand,
      broadcastMode: BroadcastMode.OnDemandPolling,
      commands: Object.values(TurnSignalCommands),
    });
  }

  setup() {
    super.setup();
    pinMode(Gpio.SIGNAL_IN_LEFT, INPUT);
    pinMode(Gpio.SIGNAL_IN_RIGHT, INPUT);
    pinMode(Gpio.SIGNAL_OUT_LEFT, OUTPUT);
    pinMode(Gpio.SIGNAL_OUT_RIGHT, OUTPUT);

    _diagnostic();

    this.leftButton = new Button(Gpio.SIGNAL_IN_LEFT, { mode: INPUT, event: RISING, debounce: tsmConfig.btnDebounce });
    this.rightButton = new Button(Gpio.SIGNAL_IN_RIGHT, { mode: INPUT, event: RISING, debounce: tsmConfig.btnDebounce });

    this.leftButton.on("click", () => {
      _checkAction(this.leftButton, this.rightButton);
    });

    this.rightButton.on("click", () => {
      _checkAction(this.leftButton, this.rightButton);
    });
  }

  handleCommand(command: string) {
    super.handleCommand(command);

    if (command === TurnSignalCommands.DIAG) {
      _diagnostic();
    } else {
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
