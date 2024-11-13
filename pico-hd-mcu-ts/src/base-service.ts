/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { Logging } from "./logger";
import { IEventBus } from "./event-bus";
import { ServiceCommand, EventType, ServiceStatus, BroadcastMode } from "../../ts-schema/constants";
import { SchemaVersion } from "../../ts-schema/schema.version";

export interface BaseServiceOptions {
  serviceCode: string;
  serviceType: string;
  updateInterval?: number;
  broadcastMode?: BroadcastMode;
  idleTimeout?: number;
  commands?: string[];
}

export class BaseService<TData> {
  data: TData | any;
  options: BaseServiceOptions;
  status: ServiceStatus;
  isRunning: boolean;

  private eventBus: IEventBus;
  private broadcastPid: number | null;

  constructor(eventBus: IEventBus, options: BaseServiceOptions) {
    this.options = {
      serviceCode: options.serviceCode,
      serviceType: options.serviceType,
      updateInterval: options.updateInterval ?? 1000 * 5,
      idleTimeout: options.idleTimeout ?? 1000 * 120,
      broadcastMode: options.broadcastMode ?? BroadcastMode.OnDemandPolling,
      commands: options.commands && options.commands.length > 0 ? [...Object.values(ServiceCommand), ...options.commands] : Object.values(ServiceCommand),
    };

    this.eventBus = eventBus ?? { emit: () => {}, on: () => {} };
    this.status = ServiceStatus.Initialized;
    this.broadcastPid = null;
    this.isRunning = false;
    this.data = {};

    this.eventBus.on(EventType.CommandForService, (code, command, raw) => {
      if (code === this.options.serviceCode) {
        this.handleCommand(command, raw);
      }
    });
  }

  public handleCommand(command: string, raw?: any) {
    Logging.debug(this.options.serviceCode, EventType.CommandForService, command, raw);
    switch (command) {
      case ServiceCommand.START:
        this.start();
        break;
      case ServiceCommand.STOP:
        this.stop();
        break;
      case ServiceCommand.INFO:
        this.publishInformation();
        break;
      case ServiceCommand.DATA:
        this.publishData();
        break;
      case ServiceCommand.SET:
        this.peristSettings(raw);
        break;
      default:
        break;
    }
  }

  public isStarted(): boolean {
    return this.status === ServiceStatus.Started;
  }

  public setup() {
    Logging.info(this.options.serviceCode, "setup");
    this.status = ServiceStatus.Available;
  }

  public start() {
    if (this.isStarted()) {
      Logging.info(this.options.serviceCode, "already running");
      return;
    }
    Logging.info(this.options.serviceCode, "starting");
    this.isRunning = true;
    if (this.options.broadcastMode === BroadcastMode.ContinuousStream) {
      this.broadcastPid = setInterval(() => {
        this.publishData();
      }, this.options.updateInterval);
    }
    Logging.info(this.options.serviceCode, "started.");
    if (this.options.broadcastMode === BroadcastMode.ContinuousStream) {
      setTimeout(() => {
        this.stop();
      }, this.options.idleTimeout);
    }
    this.status = ServiceStatus.Started;
    this.publishInformation();
  }

  public stop() {
    if (!this.isRunning) {
      Logging.info(this.options.serviceCode, "already stopped");
      return;
    }
    Logging.info(this.options.serviceCode, "stopping");
    if (this.broadcastPid) {
      clearInterval(this.broadcastPid);
    }
    this.isRunning = false;
    this.broadcastPid = null;
    Logging.info(this.options.serviceCode, "stopped.");
    this.status = ServiceStatus.Stopped;
    this.publishInformation();
  }

  public getInfo() {
    return { schemaVersion: SchemaVersion, status: this.status, isRunning: this.isRunning, ...this.options };
  }

  public peristSettings(data: any) {
    Logging.debug(this.options.serviceCode, ServiceCommand.SET, data);
  }

  public publishData() {
    Logging.debug(this.options.serviceCode, ServiceCommand.DATA);
    this.eventBus.emit(EventType.DataFromService, this.options.serviceCode, ServiceCommand.DATA, this.data);
  }

  public publishInformation() {
    Logging.debug(this.options.serviceCode, ServiceCommand.INFO, this.isRunning);
    this.eventBus.emit(EventType.DataFromService, this.options.serviceCode, ServiceCommand.INFO, this.getInfo());
  }
}
