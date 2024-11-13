"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX6675 = void 0;
// refs
// https://github.com/zhenek-kreker/MAX6675/blob/master/MAX6675.cpp
// https://github.com/adafruit/MAX6675-library/blob/master/max6675.cpp
const gpio_1 = require("gpio");
const spi_1 = require("spi");
const MAX6675_BPS = 2 * 1000 * 1000;
const MAX6675_OPEN_BIT = 0x4;
const MAX6675_CONVERSION_RATIO = 0.25;
const MAX6675_READER_CMD = [0, 0, 0, 0];
class MAX6675 {
    constructor(options) {
        this.cs = options.cs || 13;
        this.bus = options.bus || 1;
        this.spiOptions = {
            mode: options.mode || spi_1.SPI.MODE_1,
            baudrate: options.baudrate || MAX6675_BPS,
            bitorder: options.bitorder || spi_1.SPI.MSB,
            sck: options.sck || 10,
            clk: options.sck || 10,
            miso: options.miso || 12,
            mosi: -1,
        };
    }
    init() {
        try {
            this.spiBus = new spi_1.SPI(this.bus, this.spiOptions);
            this.spiCs = new gpio_1.GPIO(this.cs, "out");
            this.spiCs.high();
            console.log("MAX6675: init");
            console.log(this.spiCs);
            console.log(this.spiBus);
            return true;
        }
        catch (err) {
            console.error(err);
            return false;
        }
    }
    close() {
        if (this.spiBus) {
            console.log("MAX6675: close");
            this.spiBus.close();
        }
    }
    readCelcius() {
        const bytes = this.readRaw();
        if (bytes & MAX6675_OPEN_BIT) {
            console.error("MAX6675: no thermocouple attached!");
            return null;
        }
        const value = (bytes >> 3) * MAX6675_CONVERSION_RATIO;
        return value;
    }
    readFahrenheit() {
        const celsius = this.readCelcius();
        if (celsius === null) {
            return null;
        }
        return celsius * 1.8 + 32;
    }
    readRaw() {
        if (this.spiCs) {
            this.spiCs.low();
            const value = this.readRaw2();
            this.spiCs.high();
            return value;
        }
        console.error("SPICS is not initialized");
        return 0;
    }
    readRaw1() {
        try {
            this.spiBus.send(new Uint8Array(MAX6675_READER_CMD));
            const bytes = this.spiBus.recv(16);
            if (bytes === null) {
                console.error("MAX6675: recv error");
            }
            return bytes;
        }
        catch (err) {
            console.error(err);
        }
        return new Uint8Array();
    }
    readRaw2() {
        try {
            let raw = this.spiBus.transfer(new Uint8Array([0])) << 8;
            raw |= this.spiBus.transfer(new Uint8Array([0]));
            return raw;
        }
        catch (err) {
            console.error(err);
        }
        return 0;
    }
}
exports.MAX6675 = MAX6675;
