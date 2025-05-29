/* eslint-disable @typescript-eslint/no-explicit-any */

import { EventEmitter } from "events";

export interface IEventBus {
  on: (event: string, listener: (...args: any[]) => void) => void;
  emit: (event: string, ...args: any[]) => void;
}

export class EventBus extends EventEmitter implements IEventBus {
  constructor() {
    super();
  }

  public on(event: string, listener: (...args: any[]) => void) {
    super.on(event, listener);
  }

  public emit(event: string, ...args: any[]) {
    super.emit(event, ...args);
  }
}

export const eventBus = new EventBus();
