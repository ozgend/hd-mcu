"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
const logger_1 = require("./logger");
const constants_1 = require("../../ts-schema/constants");
const schema_version_1 = require("../../ts-schema/schema.version");
class BaseService {
    constructor(eventBus, options) {
        var _a, _b, _c;
        this.options = {
            serviceCode: options.serviceCode,
            serviceType: options.serviceType,
            updateInterval: (_a = options.updateInterval) !== null && _a !== void 0 ? _a : 1000 * 5,
            idleTimeout: (_b = options.idleTimeout) !== null && _b !== void 0 ? _b : 1000 * 120,
            broadcastMode: (_c = options.broadcastMode) !== null && _c !== void 0 ? _c : constants_1.BroadcastMode.OnDemandPolling,
            commands: options.commands && options.commands.length > 0 ? [...Object.values(constants_1.ServiceCommand), ...options.commands] : Object.values(constants_1.ServiceCommand),
        };
        this.eventBus = eventBus !== null && eventBus !== void 0 ? eventBus : { emit: () => { }, on: () => { } };
        this.status = constants_1.ServiceStatus.Initialized;
        this.broadcastPid = null;
        this.isRunning = false;
        this.data = {};
        this.eventBus.on(constants_1.EventType.CommandForService, (code, command, raw) => {
            if (code === this.options.serviceCode) {
                this.handleCommand(command, raw);
            }
        });
    }
    handleCommand(command, raw) {
        logger_1.Logging.debug(this.options.serviceCode, constants_1.EventType.CommandForService, command, raw);
        switch (command) {
            case constants_1.ServiceCommand.START:
                this.start();
                break;
            case constants_1.ServiceCommand.STOP:
                this.stop();
                break;
            case constants_1.ServiceCommand.INFO:
                this.publishInformation();
                break;
            case constants_1.ServiceCommand.DATA:
                this.publishData();
                break;
            case constants_1.ServiceCommand.SET:
                this.peristSettings(raw);
                break;
            default:
                break;
        }
    }
    isStarted() {
        return this.status === constants_1.ServiceStatus.Started;
    }
    setup() {
        logger_1.Logging.info(this.options.serviceCode, "setup");
        this.status = constants_1.ServiceStatus.Available;
    }
    start() {
        if (this.isStarted()) {
            logger_1.Logging.info(this.options.serviceCode, "already running");
            return;
        }
        logger_1.Logging.info(this.options.serviceCode, "starting");
        this.isRunning = true;
        if (this.options.broadcastMode === constants_1.BroadcastMode.ContinuousStream) {
            this.broadcastPid = setInterval(() => {
                this.publishData();
            }, this.options.updateInterval);
        }
        logger_1.Logging.info(this.options.serviceCode, "started.");
        if (this.options.broadcastMode === constants_1.BroadcastMode.ContinuousStream) {
            setTimeout(() => {
                this.stop();
            }, this.options.idleTimeout);
        }
        this.status = constants_1.ServiceStatus.Started;
        this.publishInformation();
    }
    stop() {
        if (!this.isRunning) {
            logger_1.Logging.info(this.options.serviceCode, "already stopped");
            return;
        }
        logger_1.Logging.info(this.options.serviceCode, "stopping");
        if (this.broadcastPid) {
            clearInterval(this.broadcastPid);
        }
        this.isRunning = false;
        this.broadcastPid = null;
        logger_1.Logging.info(this.options.serviceCode, "stopped.");
        this.status = constants_1.ServiceStatus.Stopped;
        this.publishInformation();
    }
    getInfo() {
        return Object.assign({ schemaVersion: schema_version_1.SchemaVersion, status: this.status, isRunning: this.isRunning }, this.options);
    }
    peristSettings(data) {
        logger_1.Logging.debug(this.options.serviceCode, constants_1.ServiceCommand.SET, data);
    }
    publishData() {
        logger_1.Logging.debug(this.options.serviceCode, constants_1.ServiceCommand.DATA);
        this.eventBus.emit(constants_1.EventType.DataFromService, this.options.serviceCode, constants_1.ServiceCommand.DATA, this.data);
    }
    publishInformation() {
        logger_1.Logging.debug(this.options.serviceCode, constants_1.ServiceCommand.INFO, this.isRunning);
        this.eventBus.emit(constants_1.EventType.DataFromService, this.options.serviceCode, constants_1.ServiceCommand.INFO, this.getInfo());
    }
}
exports.BaseService = BaseService;
