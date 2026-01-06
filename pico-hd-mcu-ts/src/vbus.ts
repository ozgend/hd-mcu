import { GPIO } from "gpio";
import { Gpio, Hardware } from "../../ts-schema/constants";

export class UsbDetection {
  private pin: any;
  private pid: any;
  private lastState: boolean = false;

  constructor(private readonly pinNumber: number = Gpio.ONCHIP_VBUS) {
    this.pin = new GPIO(this.pinNumber, INPUT);
  }

  onChange(callback: (connected: boolean) => void) {
    this.pid = setInterval(() => {
      const state = this.pin.read() === 1;
      if (state !== this.lastState) {
        this.lastState = state;
        callback(state);
      }
    }, Hardware.VBUS_DETECT_INTERVAL);
  }

  stop() {
    if (this.pid) {
      clearInterval(this.pid);
      this.pid = null;
    }
  }

  get currentState(): boolean {
    return this.pin.read() === 1;
  }
}
