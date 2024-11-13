"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.TurnSignalService = void 0;
const utils_1 = require("../utils");
const logger_1 = require("../logger");
const button_1 = require("button");
const constants_1 = require("../../../ts-schema/constants");
const base_service_1 = require("../base-service");
const data_model_1 = require("../../../ts-schema/data.model");
const defaultTsmConfig = {
    blinkRate: constants_1.Hardware.TURN_SIGNAL_BLINK_RATE,
    blinkTimeout: constants_1.Hardware.TURN_SIGNAL_BLINK_TIMEOUT,
    btnDebounce: constants_1.Hardware.TURN_SIGNAL_BTN_DEBOUNCE,
    diagCount: constants_1.Hardware.TURN_SIGNAL_DIAG_COUNT,
    diagRate: constants_1.Hardware.TURN_SIGNAL_DIAG_RATE,
};
const tsmConfig = (0, utils_1.readObject)(constants_1.FILE_TSM_CONFIG) || data_model_1.TsmSettings.default(defaultTsmConfig);
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
    logger_1.Logging.debug(constants_1.ServiceCode.TurnSignalModule, "diagnostic", { _state, _action });
    logger_1.Pulsing.down();
    _disableFlasher("diag-start");
    _flasherPid = setInterval(() => {
        if (_diagCounter > tsmConfig.diagCount * 2) {
            _disableFlasher("diag-complete [" + _diagCounter + "] cycles");
            _diagCounter = 0;
            return;
        }
        _state.left = !_state.left;
        _state.right = !_state.right;
        digitalToggle(constants_1.Gpio.SIGNAL_OUT_LEFT);
        digitalToggle(constants_1.Gpio.SIGNAL_OUT_RIGHT);
        _diagCounter++;
        logger_1.Pulsing.toggle();
        logger_1.Logging.debug(constants_1.ServiceCode.TurnSignalModule, "diagnostic", { _state, _diagCounter });
    }, tsmConfig.diagRate);
};
const _enableFlasher = (isLeft, isRight, blinkRate, cancelTimeout, doNotCancel) => {
    logger_1.Logging.debug(constants_1.ServiceCode.TurnSignalModule, "enableFlasher", { isLeft, isRight });
    if (doNotCancel) {
        _cancelerPid = 0;
        logger_1.Logging.debug(constants_1.ServiceCode.TurnSignalModule, "will not cancel", { isLeft, isRight });
    }
    else {
        logger_1.Logging.debug(constants_1.ServiceCode.TurnSignalModule, "will auto-cancel", { isLeft, isRight });
        _cancelerPid = setTimeout(() => {
            _disableFlasher("timeout");
            _action.left = false;
            _action.right = false;
        }, cancelTimeout);
    }
    _flasherPid = setInterval(() => {
        if (isLeft) {
            digitalToggle(constants_1.Gpio.SIGNAL_OUT_LEFT);
            _state.left = !_state.left;
        }
        if (isRight) {
            digitalToggle(constants_1.Gpio.SIGNAL_OUT_RIGHT);
            _state.right = !_state.right;
        }
        logger_1.Pulsing.toggle();
        logger_1.Logging.debug(constants_1.ServiceCode.TurnSignalModule, "state", _state);
    }, blinkRate);
};
const _disableFlasher = (reason) => {
    clearInterval(_flasherPid);
    clearTimeout(_cancelerPid);
    digitalWrite(constants_1.Gpio.SIGNAL_OUT_LEFT, LOW);
    digitalWrite(constants_1.Gpio.SIGNAL_OUT_RIGHT, LOW);
    _flasherPid = 0;
    _cancelerPid = 0;
    _state.left = false;
    _state.right = false;
    _diagCounter = 0;
    logger_1.Logging.debug(constants_1.ServiceCode.TurnSignalModule, "disableFlasher", { reason });
    logger_1.Pulsing.up();
};
const _setFlasher = (isLeft, isRight) => {
    logger_1.Logging.debug(constants_1.ServiceCode.TurnSignalModule, "setFlasher", { isLeft, isRight });
    logger_1.Pulsing.down();
    _disableFlasher("cancel-any");
    if (isLeft || isRight) {
        _enableFlasher(isLeft, isRight, tsmConfig.blinkRate, tsmConfig.blinkTimeout, isLeft && isRight);
    }
};
const _checkAction = (btnLeft, btnRight) => {
    const _readLeft = btnLeft.read();
    const _readRight = btnRight.read();
    logger_1.Logging.debug(constants_1.ServiceCode.TurnSignalModule, `checkAction.left-current ${_action.left}, read: ${_readLeft}`);
    logger_1.Logging.debug(constants_1.ServiceCode.TurnSignalModule, `checkAction.right-current ${_action.right}, read: ${_readRight}`);
    // hazard lights check
    // if (_readLeft === HIGH && _readRight === HIGH) {
    // }
    if (_readLeft === HIGH) {
        _action.left = !_action.left;
        logger_1.Logging.debug(constants_1.ServiceCode.TurnSignalModule, `checkAction.left-HIGH ${_action.left}`);
    }
    else {
        _action.left = false;
        // logger.debug(ServiceCode.TurnSignalModule, `checkAction.left-LOW ${_action.left}`);
    }
    if (_readRight === HIGH) {
        _action.right = !_action.right;
        logger_1.Logging.debug(constants_1.ServiceCode.TurnSignalModule, `checkAction.right-HIGH ${_action.right}`);
    }
    else {
        _action.right = false;
        // logger.debug(ServiceCode.TurnSignalModule, `checkAction.right-LOW ${_action.right}`);
    }
    _setFlasher(_action.left, _action.right);
};
class TurnSignalService extends base_service_1.BaseService {
    constructor(eventBus) {
        super(eventBus, {
            serviceCode: constants_1.ServiceCode.TurnSignalModule,
            serviceType: constants_1.ServiceType.OnDemand,
            broadcastMode: constants_1.BroadcastMode.OnDemandPolling,
            commands: Object.values(constants_1.TurnSignalCommands),
        });
    }
    setup() {
        super.setup();
        pinMode(constants_1.Gpio.SIGNAL_IN_LEFT, INPUT_PULLUP);
        pinMode(constants_1.Gpio.SIGNAL_IN_RIGHT, INPUT_PULLUP);
        pinMode(constants_1.Gpio.SIGNAL_OUT_LEFT, OUTPUT);
        pinMode(constants_1.Gpio.SIGNAL_OUT_RIGHT, OUTPUT);
        _diagnostic();
        this.leftButton = new button_1.Button(constants_1.Gpio.SIGNAL_IN_LEFT, { mode: INPUT, event: RISING, debounce: tsmConfig.btnDebounce });
        this.rightButton = new button_1.Button(constants_1.Gpio.SIGNAL_IN_RIGHT, { mode: INPUT, event: RISING, debounce: tsmConfig.btnDebounce });
        this.leftButton.on("click", () => {
            _checkAction(this.leftButton, this.rightButton);
        });
        this.rightButton.on("click", () => {
            _checkAction(this.leftButton, this.rightButton);
        });
    }
    handleCommand(command) {
        super.handleCommand(command);
        if (command === constants_1.TurnSignalCommands.DIAG) {
            _diagnostic();
        }
        else {
            switch (command) {
                case constants_1.TurnSignalCommands.ALL:
                    _action.left = true;
                    _action.right = true;
                    break;
                case constants_1.TurnSignalCommands.LEFT:
                    _action.left = !_action.left;
                    _action.right = false;
                    break;
                case constants_1.TurnSignalCommands.RIGHT:
                    _action.left = false;
                    _action.right = !_action.right;
                    break;
                case constants_1.TurnSignalCommands.NONE:
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
exports.TurnSignalService = TurnSignalService;
