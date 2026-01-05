import { Hardware } from "../../../ts-schema/constants";
import { IAdcValue } from "../../../ts-schema/data.interface";
import { readADC, watchADC } from "../utils";

export class AdcHallSensor {
  private adcPin: number;
  private readIntervalMs: number | null = null;
  private pidAdcWatcher: number | null = null;
  private readCallback: ((adcValue: IAdcValue) => void) | undefined;

  constructor(adcPin: number, readIntervalMs?: number, readCallback?: (adcValue: IAdcValue) => void) {
    this.adcPin = adcPin;
    this.readIntervalMs = readIntervalMs;
    this.readCallback = readCallback;
  }

  init(): void {
    pinMode(this.adcPin, INPUT);
    if (this.readIntervalMs && this.readCallback && !this.pidAdcWatcher) {
      this.pidAdcWatcher = watchADC(this.adcPin, this.readIntervalMs, this.readCallback);
    }
  }

  read(willTriggerCallback: boolean): IAdcValue {
    const adcValue = readADC(this.adcPin);
    if (willTriggerCallback && this.readCallback) {
      this.readCallback(adcValue);
    }
    return adcValue;
  }

  close(): void {
    if (this.pidAdcWatcher) {
      clearInterval(this.pidAdcWatcher);
      this.pidAdcWatcher = null;
    }
  }
}
