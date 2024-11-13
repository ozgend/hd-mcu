/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { EventEmitter } from "events";

export interface IEventBus {
  on: (event: string, listener: (...args: any[]) => void) => this;
  emit: (event: string, ...args: any[]) => boolean;
}

export class EventBus extends EventEmitter implements IEventBus {
  on: (event: string, listener: (...args: any[]) => void) => this;
  emit: (event: string, ...args: any[]) => boolean;
}

export const eventBus = new EventBus();
