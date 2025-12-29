// kalumajs servo library
// original: https://github.com/niklauslee/servo

import { PWM } from "pwm";

export class ServoPWM {
  private pin: number;
  private period: number;
  private minPulse: number;
  private maxPulse: number;
  private pwm: PWM | null;

  constructor() {
    this.pin = -1;
    this.period = 20000;
    this.minPulse = 544;
    this.maxPulse = 2400;
    this.pwm = null;
  }

  attach(pin: number, minPulse?: number, maxPulse?: number, period?: number): void {
    if (this.pin < 0) {
      this.pin = pin;
      if (minPulse) {
        this.minPulse = minPulse;
      }
      if (maxPulse) {
        this.maxPulse = maxPulse;
      }
      if (period) {
        this.period = period;
      }
      const hz = 1000000 / this.period;
      this.pwm = new PWM(this.pin, hz, this.minPulse);
      this.pwm.start();
    } else {
      throw "Already attached";
    }
  }

  detach(): void {
    if (this.pwm) {
      this.pwm.stop();
      this.pwm = null;
      this.pin = -1;
    }
  }

  write(angle: number): void {
    // var d = (this.maxPulse - this.minPulse) / 180;
    // this.pwm.setDuty((this.minPulse + angle * d) / this.period);

    if (this.pwm) {
      const pulseWidth = this.minPulse + (angle / 180) * (this.maxPulse - this.minPulse);
      this.pwm.setDuty(pulseWidth);
    } else {
      throw "Not attached";
    }
  }

  read(): number {
    if (this.pwm) {
      const dutyCycle = this.pwm.getDuty();
      const angle = ((dutyCycle - this.minPulse) * 180) / (this.maxPulse - this.minPulse);
      return angle;
    } else {
      throw "Not attached";
    }
  }
}
