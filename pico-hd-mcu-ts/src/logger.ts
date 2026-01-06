import { Gpio } from "../../ts-schema/constants";

pinMode(Gpio.ONCHIP_LED, OUTPUT);

const LEVEL_NAMES = ["DEBUG", "INFO", "ERROR"];
enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  ERROR = 2,
}

export class Logging {
  private static LOG_LEVEL: LogLevel = LogLevel.DEBUG;

  static generateTraceId(): string {
    return `(${Math.random().toString(36).substring(2, 15)})`;
  }

  static debug(code: string, message: string, data?: any): void {
    this._log(LogLevel.DEBUG, code, message, data);
  }

  static info(code: string, message: string, data?: any): void {
    this._log(LogLevel.INFO, code, message, data);
  }

  static error(code: string, message: string, data?: any): void {
    this._log(LogLevel.ERROR, code, message, data);
  }

  private static _log(level: LogLevel, code: string, message: string, data?: any): void {
    if (level >= this.LOG_LEVEL) {
      message = data ? `${message} ${JSON.stringify(data)}` : message;
      console.log(`${LEVEL_NAMES[level]} | [${code}] ${message}`);
    }
  }
}

export class Pulsing {
  private static _state: number = HIGH;

  static up(): void {
    this._state = HIGH;
    digitalWrite(Gpio.ONCHIP_LED, HIGH);
  }

  static down(): void {
    this._state = LOW;
    digitalWrite(Gpio.ONCHIP_LED, LOW);
  }

  static toggle(): void {
    this._state = this._state === HIGH ? LOW : HIGH;
    digitalWrite(Gpio.ONCHIP_LED, this._state);
  }
}
