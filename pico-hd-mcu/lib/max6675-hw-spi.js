// refs
// https://github.com/zhenek-kreker/MAX6675/blob/master/MAX6675.cpp
// https://github.com/adafruit/MAX6675-library/blob/master/max6675.cpp

const { GPIO } = require('gpio');
const { SPI } = require('spi');

const MAX6675_BPS = 1 * 1000 * 1000;
const MAX6675_OPEN_BIT = 0x4;
const MAX6675_CONVERSION_RATIO = 0.25;
let MAX6675_READER_CMD = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

class MAX6675 {
  constructor(options) {
    this.cs = options.cs || 13;
    this.bus = options.bus || 1;
    this.spiOptions = {
      mode: options.mode || SPI.MODE_1,
      baudrate: options.baudrate || MAX6675_BPS,
      bitorder: options.bitorder || SPI.MSB,
      sck: options.sck || 10,
      clk: options.sck || 10,
      miso: options.miso || 12,
      mosi: -1
    };
  }

  init() {
    try {
      this.spiCs = new GPIO(this.cs, OUTPUT);
      this.spiCs.high();
      this.spiBus = new SPI(this.bus, this.spiOptions);
      console.log('MAX6675: init');
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
      console.log('MAX6675: close')
      this.spiBus.close();
    }
  }

  readCelcius() {
    console.log('MAX6675: readCelcius');

    let bytes = this.readRaw();

    if (bytes & MAX6675_OPEN_BIT) {
      console.error('MAX6675: no thermocouple attached!');
      return null;
    }
    const value = (bytes >> 3) * MAX6675_CONVERSION_RATIO;
    return value;
  }

  readFahrenheit() {
    return this.readCelcius() * 1.8 + 32;
  }

  readRaw() {
    this.spiCs.low();
    let val = this.readRaw1();
    this.spiCs.high();
    return val;
  }

  readRaw1() {
    try {

      const sent = this.spiBus.send(new Uint8Array(MAX6675_READER_CMD));
      console.log(`MAX6675: readRaw.sent: ${sent}b`);
      let bytes = this.spiBus.recv(16);
      if (bytes === null) {
        console.error('MAX6675: recv error');
      }
      console.log(`MAX6675: readRaw.bytes: ${bytes} length: ${bytes.length}`);
      return bytes;
    }
    catch (err) {
      console.error(err);
    }
    return [];
  }

  readRaw2() {
    let bytes = this.spiBus.transfer(new Uint8Array(MAX6675_READER_CMD));
    console.log(`MAX6675: readRaw.bytes: ${bytes} length: ${bytes.length}`);
    return bytes;
  }
}

module.exports = MAX6675;