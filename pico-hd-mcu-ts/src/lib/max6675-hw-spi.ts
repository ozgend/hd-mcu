// refs
// https://github.com/zhenek-kreker/MAX6675/blob/master/MAX6675.cpp
// https://github.com/adafruit/MAX6675-library/blob/master/max6675.cpp

import { GPIO } from "gpio";
import { SPI } from "spi";

const MAX6675_BPS = 2 * 1000 * 1000;
const MAX6675_OPEN_BIT = 0x4;
const MAX6675_CONVERSION_RATIO = 0.25;
const MAX6675_READER_CMD = [0, 0, 0, 0];

export interface MAX6675Options {
  cs?: number;
  bus?: number;
  mode?: number;
  baudrate?: number;
  bitorder?: number;
  sck?: number;
  miso?: number;
}

export class MAX6675 {
  private cs: number;
  private bus: number;
  private spiOptions: unknown;
  private spiBus: ISPI | null;
  private spiCs: IGPIO | null;

  constructor(options: MAX6675Options) {
    this.cs = options.cs || 13;
    this.bus = options.bus || 1;
    this.spiBus = null;
    this.spiCs = null;
    this.spiOptions = {
      mode: options.mode || SPI.MODE_1,
      baudrate: options.baudrate || MAX6675_BPS,
      bitorder: options.bitorder || SPI.MSB,
      sck: options.sck || 10,
      clk: options.sck || 10,
      miso: options.miso || 12,
      mosi: -1,
    };
  }

  init(): boolean {
    try {
      this.spiBus = new SPI(this.bus, this.spiOptions);
      this.spiCs = new GPIO(this.cs, OUTPUT);
      this.spiCs.high();
      console.log("MAX6675: init");
      console.log(this.spiCs);
      console.log(this.spiBus);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  close(): void {
    if (this.spiBus) {
      console.log("MAX6675: close");
      this.spiBus.close();
    }
  }

  readCelcius(): number | null {
    const bytes = this.readRaw();

    if (bytes & MAX6675_OPEN_BIT) {
      console.error("MAX6675: no thermocouple attached!");
      return null;
    }
    const value = (bytes >> 3) * MAX6675_CONVERSION_RATIO;
    return value;
  }

  readFahrenheit(): number | null {
    const celsius = this.readCelcius();
    if (celsius === null) {
      return null;
    }
    return celsius * 1.8 + 32;
  }

  private readRaw(): number {
    if (this.spiCs) {
      this.spiCs.low();
      const value = this.readRaw2();
      this.spiCs.high();
      return value;
    }
    console.error("SPICS is not initialized");
    return 0;
  }

  private readRaw1(): Uint8Array {
    try {
      this.spiBus.send(new Uint8Array(MAX6675_READER_CMD));
      const bytes = this.spiBus.recv(16);
      if (bytes === null) {
        console.error("MAX6675: recv error");
      }
      return bytes;
    } catch (err) {
      console.error(err);
    }
    return new Uint8Array();
  }

  private readRaw2(): number {
    try {
      let raw = this.spiBus.transfer(new Uint8Array([0])) << 8;
      raw |= this.spiBus.transfer(new Uint8Array([0]));
      return raw;
    } catch (err) {
      console.error(err);
    }
    return 0;
  }
}
